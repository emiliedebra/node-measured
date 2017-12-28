/* @flow */
import EWMA from '../util/ExponentiallyMovingWeightedAverage';
import Stopwatch from '../util/Stopwatch';
import * as units from '../util/units';

// const units = require('../util/units');
export default class Meter {
  _properties: Object;
  _rateUnit: number;
  _tickInterval: number;
  _m1Rate: EWMA;
  _m5Rate: EWMA;
  _m15Rate: EWMA;
  _count: number;
  _currentSum: number;
  _startTime: number;
  _lastToJSON: number;
  _interval: number; // NOTE: incorrect type here - should be Timer/Window?
  _getTime: number;
  RATE_UNIT: number = units.SECONDS;
  TICK_INTERVAL: number = 5 * units.SECONDS;

  constructor(properties: Object) {
    this._properties = properties || Object.create(null);

    this._rateUnit = properties.rateUnit || this.RATE_UNIT;
    this._tickInterval = properties.tickInterval || this.TICK_INTERVAL;
    if (properties.getTime) {
      this._getTime = properties.getTime;
    }

    this._m1Rate = properties.m1Rate || new EWMA(units.MINUTES, this._tickInterval);
    this._m5Rate = properties.m5Rate || new EWMA(5 * units.MINUTES, this._tickInterval);
    this._m15Rate = properties.m15Rate || new EWMA(15 * units.MINUTES, this._tickInterval);
    this._count = 0;
    this._currentSum = 0;
    this._startTime = Meter._getTime();
    this._lastToJSON = Meter._getTime();
    this._interval = window.setInterval(this._tick.bind(this), this.TICK_INTERVAL);
  }


  mark(n: number | void) {
    if (!this._interval) {
      Meter.start();
    }
    const _n: number = n || 1;

    this._count += _n;
    this._currentSum += _n;
    this._m1Rate.update(_n);
    this._m5Rate.update(_n);
    this._m15Rate.update(_n);
  }

  static start() {
    return;
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

  reset() {
    this.end();
    this.constructor({});
  }

  meanRate(): number {
    if (this._count === 0) {
      return 0;
    }

    const elapsed = Meter._getTime() - this._startTime;
    return this._count / (elapsed * this._rateUnit);
  }

  currentRate(): number {
    const currentSum = this._currentSum;
    const duration = Meter._getTime() - this._lastToJSON;
    const currentRate = currentSum / (duration * this._rateUnit);

    this._currentSum = 0;
    this._lastToJSON = Meter._getTime();

    // currentRate could be NaN if duration was 0, so fix that
    return currentRate || 0;
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

  static _getTime(): number {
    if (!process.hrtime) {
      return new Date().getTime();
    }

    const hrtime = process.hrtime();
    return (hrtime[0] * 1000) + (hrtime[1] / (1000 * 1000));
  }
}
