/*  */
import { ExponentiallyDecayingSample } from '../util/ExponentiallyDecayingSample';
/**
 * Class for keeping a resevoir of statistically relevant values biased towards the last 5 minutes
 * Holds count of number of values as well
*/
export class Histogram {

  constructor(properties = {}) {
    this.init(properties);
  }

  init(properties = {}) {
    this._sample = properties.sample || new ExponentiallyDecayingSample();
    this._min = null;
    this._max = null;
    this._count = 0;
    this._sum = 0;

    // These are for the Welford algorithm for calculating running variance
    // without floating-point doom.
    this._varianceM = 0;
    this._varianceS = 0;
  }

  toJSON() {
    const percentiles = this.percentiles([0.5, 0.75, 0.95, 0.99, 0.999]);

    return {
      min: this._min,
      max: this._max,
      sum: this._sum,
      variance: this._calculateVariance(),
      mean: this._calculateMean(),
      stddev: this._calculateStdDev(),
      count: this._count, // number of values
      median: percentiles[0.5], // value at which 50% of the values in resevoir are at or below
      p75: percentiles[0.75],
      p95: percentiles[0.95],
      p99: percentiles[0.99],
      p999: percentiles[0.999],
    };
  }

  update(value) {
    this._count++;
    this._sum += value;

    this._sample.update(value);
    this._updateMin(value);
    this._updateMax(value);
    this._updateVariance(value);
  }

  // NOTE: Histograms initialized with custom options will be reset to the default settings (can be changed?)
  reset() {
    this.init();
  }

  percentiles(percentiles) {
    const values = this._sample
      .toArray()
      .sort((a, b) => ((a === b) ? 0 : a - b));

    let results = {};

    for (let i = 0; i < percentiles.length; i++) {
      const percentile = percentiles[i];
      if (values.length) {
        const pos = percentile * (values.length + 1);
        if (pos < 1) {
          results = { percentile: values[0] };
          // results[percentile] = values[0];
        } else if (pos >= values.length) {
          results[percentile] = values[values.length - 1];
        } else {
          const lower = values[Math.floor(pos) - 1];
          const upper = values[Math.ceil(pos) - 1];
          results[percentile] =
            lower + ((pos - Math.floor(pos)) * (upper - lower));
        }
      } else {
        results[percentile] = null;
      }
    }
    return results;
  }

  hasValues() {
    return this._count > 0;
  }


  _updateMin(value) {
    if (!this._min || value < this._min) {
      this._min = value;
    }
  }

  _updateMax(value) {
    if (!this._max || value > this._max) {
      this._max = value;
    }
  }

  _updateVariance(value) {
    if (this._count === 1) {
      this._varianceM = value;
      return value;
    }
    const oldM = this._varianceM;

    this._varianceM += ((value - oldM) / this._count);
    this._varianceS += ((value - oldM) * (value - this._varianceM));
  }

  _calculateMean() {
    return (this._count === 0) ? 0 : this._sum / this._count;
  }

  _calculateVariance() {
    return (this._count <= 1) ? null : this._varianceS / (this._count - 1);
  }

  _calculateStdDev() {
    const calculateVariance = this._calculateVariance();
    if (calculateVariance) {
      return Math.sqrt(calculateVariance);
    }
    return null;
  }
}
