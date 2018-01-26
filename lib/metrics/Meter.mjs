/*  */
import { ExponentiallyMovingWeightedAverage } from '../util/ExponentiallyMovingWeightedAverage';
import * as units from '../util/units';
/**
 * Class for metric of things that are measured as an event/interval
 * Holds count of number of values as well
*/
export class Meter {
 // interval in which averages are updated

  // constants

  constructor(properties = {}) {
    this.init(properties);
  }

  init(properties = {}) {
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

  // output JSON
  toJSON() {
    return {
      mean: this.meanRate(),
      count: this._count,
      currentRate: this.currentRate(),
      rate1Min: this._m1Rate.rate(this._rateUnit),
      rate5Min: this._m5Rate.rate(this._rateUnit),
      rate15Min: this._m15Rate.rate(this._rateUnit),
    };
  }

  // NOTE: Meters initialized with custom options will be reset to the default settings
  reset() {
    this.end();
    this.init();
  }

  // update meter values
  mark(n = 1) {
    // if (!this._interval) {
    //   Meter.start();
    // }

    this._count += n;
    this._currentSum += n;
    this._m1Rate.update(n);
    this._m5Rate.update(n);
    this._m15Rate.update(n);
  }

  // NOTE: Not really used
  static start() {
    return null;
  }

  // clear interval
  end() {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
  }

  ref() {
    const interval = this._interval;
    if (interval && interval.ref) {
      interval.ref();
    }
  }

  unref() {
    const interval = this._interval;
    if (interval && interval.unref) {
      interval.unref();
    }
  }

  _tick() {
    this._m1Rate.tick();
    this._m5Rate.tick();
    this._m15Rate.tick();
  }

  // returns the average rate
  meanRate() {
    if (this._count === 0) {
      return 0;
    }

    const elapsed = this._getTime() - this._startTime;
    return (this._count / elapsed) * this._rateUnit;
  }

  // returns the current rate
  currentRate() {
    const currentSum = this._currentSum;
    const duration = this._getTime() - this._lastToJSON;
    const currentRate = (currentSum / duration) * this._rateUnit;

    this._currentSum = 0;
    this._lastToJSON = this._getTime();

    return currentRate || 0;
  }

  static getTime() {
    if (!process.hrtime) {
      return new Date().getTime();
    }

    const hrtime = process.hrtime();
    return (hrtime[0] * 1000) + (hrtime[1] / (1000 * 1000));
  }
}
