/*  */
import * as units from '../util/units';

export class ExponentiallyMovingWeightedAverage {

  // constant

  constructor(timePeriod, tickInterval) {
    this.TICK_INTERVAL = 5 * units.SECONDS;
    this._timePeriod = timePeriod || units.MINUTES;
    this._tickInterval = tickInterval || this.TICK_INTERVAL;
    this._alpha = 1 - Math.exp(-this._tickInterval / this._timePeriod);
    this._count = 0;
    this._rate = 0;
  }

  update(n) {
    this._count += n;
  }

  tick() {
    const instantRate = this._count / this._tickInterval;
    this._count = 0;

    this._rate += (this._alpha * (instantRate - this._rate));
  }

  rate(timeUnit) {
    return this._rate * timeUnit;
  }
}
