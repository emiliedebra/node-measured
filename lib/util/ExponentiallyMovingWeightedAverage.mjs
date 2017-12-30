/* @flow */
import * as units from '../util/units';

export class ExponentiallyMovingWeightedAverage {
  _timePeriod: number;
  _tickInterval: number;
  _alpha: number;
  _count: number;
  _rate: number;

  // constant
  TICK_INTERVAL: number;

  constructor(timePeriod: number, tickInterval: number) {
    this.TICK_INTERVAL = 5 * units.SECONDS;
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
    return (this._rate || 0) * timeUnit; // NOTE: Not sure why the || 0 is there
  }
}
