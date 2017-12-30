/* @flow */
import { ExponentiallyMovingWeightedAverage } from '../util/ExponentiallyMovingWeightedAverage';
import * as units from '../util/units';

/**
 * Class for metric of things that are measured as an event/interval
 * Holds count of number of values as well
*/
export class Meter {
  _rateUnit: number;
  _tickInterval: number; // interval in which averages are updated
  _m1Rate: ExponentiallyMovingWeightedAverage;
  _m5Rate: ExponentiallyMovingWeightedAverage;
  _m15Rate: ExponentiallyMovingWeightedAverage;
  _count: number;
  _currentSum: number;
  _startTime: number;
  _lastToJSON: number;
  _interval: any; // NOTE: incorrect type here - should be Timer/Window?
  _getTime: Function;

  // constants
  TICK_INTERVAL: number;
  RATE_UNIT: number;

  constructor(properties: Object = {}) {
    this.init(properties);
  }

  init(properties: Object = {}) {
    this.TICK_INTERVAL = 5 * units.SECONDS;
    this.RATE_UNIT = units.SECONDS;
    this._rateUnit = properties.rateUnit || this.RATE_UNIT;
    this._tickInterval = properties.tickInterval || this.TICK_INTERVAL;
    this._getTime = properties.getTime || Meter.getTime;

    this._m1Rate = properties.m1Rate || new ExponentiallyMovingWeightedAverage(units.MINUTES, this._tickInterval);
    this._m5Rate = properties.m5Rate || new ExponentiallyMovingWeightedAverage(5 * units.MINUTES, this._tickInterval);
    this._m15Rate = properties.m15Rate || new ExponentiallyMovingWeightedAverage(15 * units.MINUTES, this._tickInterval);
    this._count = 0;
    this._currentSum = 0;
    this._startTime = this._getTime();
    this._lastToJSON = this._getTime();
    this._interval = setInterval(this._tick.bind(this), this.TICK_INTERVAL);
  }

  toJSON(): Object {
    return {
      mean: this.meanRate(),
      count: this._count,
      currentRate: this.currentRate(),
      oneMinuteRate: this._m1Rate.rate(this._rateUnit),
      fiveMinuteRate: this._m5Rate.rate(this._rateUnit),
      fifteenMinuteRate: this._m15Rate.rate(this._rateUnit),
    };
  }

  // NOTE: Meters initialized with custom options will be reset to the default settings
  reset() {
    this.end();
    this.init();
  }

  mark(n: number = 1) {
    if (!this._interval) {
      Meter.start();
    }

    this._count += n;
    this._currentSum += n;
    this._m1Rate.update(n);
    this._m5Rate.update(n);
    this._m15Rate.update(n);
  }

  static start() {
    return null;
  }

  end() {
    clearInterval(this._interval);
    this._interval = null;
  }

  ref() {
    if (this._interval && this._interval.ref) {
      this._interval.ref();
    }
  }

  unref() {
    if (this._interval && this._interval.unref) {
      this._interval.unref();
    }
  }

  _tick() {
    this._m1Rate.tick();
    this._m5Rate.tick();
    this._m15Rate.tick();
  }

  meanRate(): number {
    if (this._count === 0) {
      return 0;
    }

    const elapsed = this._getTime() - this._startTime;
    return (this._count / elapsed) * this._rateUnit;
  }

  currentRate(): number {
    const currentSum = this._currentSum;
    const duration = this._getTime() - this._lastToJSON;
    const currentRate = (currentSum / duration) * this._rateUnit;

    this._currentSum = 0;
    this._lastToJSON = this._getTime();

    // currentRate could be NaN if duration was 0, so fix that
    return currentRate || 0;
  }

  static getTime(): number {
    if (!process.hrtime) {
      return new Date().getTime();
    }

    const hrtime = process.hrtime();
    return (hrtime[0] * 1000) + (hrtime[1] / (1000 * 1000));
  }
}
