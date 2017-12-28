/* @flow */
import * as units from '../util/units';
// const units = require('./units');

export default class ExponentiallyMovingWeightedAverage {
  _timePeriod: number;
  _tickInterval: number;
  _alpha: number;
  _count: number;
  _rate: number;
  TICK_INTERVAL: number = 5 * units.SECONDS;

  constructor(timePeriod: number, tickInterval: number) {
    this._timePeriod = timePeriod || units.MINUTES;
    this._tickInterval = tickInterval || this.TICK_INTERVAL;
    this._alpha = 1 - Math.exp(-this._tickInterval / this._timePeriod);
    this._count = 0;
    this._rate = 0;
  }


  update(n: number) {
    this._count += n;
  }

  tick() {
    const instantRate = this._count / this._tickInterval;
    this._count = 0;

    this._rate += (this._alpha * (instantRate - this._rate));
  }

  rate(timeUnit: number): number {
    return (this._rate || 0) * timeUnit;
  }
}
