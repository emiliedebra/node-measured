/* @flow */
import { ExponentiallyDecayingSample } from '../util/ExponentiallyDecayingSample';
import type {
  THistogramOutput,
} from '../types';

declare type percentileObject = {
  [key: ?string | ?number]: number;
}
/**
 * Class for keeping a reservoir of statistically relevant values biased towards the last 5 minutes
 * Holds count of number of values as well
*/
export class Histogram {
  _sample: ExponentiallyDecayingSample;
  _min: ?number;
  _max: ?number;
  _count: number;
  _sum: number;
  _varianceM: number;
  _varianceS: number;

  constructor(sample: ?ExponentiallyDecayingSample) {
    this.init(sample);
  }

  init(sample: ?ExponentiallyDecayingSample) {
    this._sample = sample || new ExponentiallyDecayingSample();
    this._min = null;
    this._max = null;
    this._count = 0;
    this._sum = 0;

    // These are for the Welford algorithm for calculating running variance
    // without floating-point doom.
    this._varianceM = 0;
    this._varianceS = 0;
  }

  // output to JSON
  toJSON(): THistogramOutput {
    const percentiles: percentileObject = this.percentiles([0.5, 0.75, 0.95, 0.99, 0.999]);

    return {
      min: this._min,
      max: this._max,
      sum: this._sum,
      variance: this._calculateVariance(),
      mean: this._calculateMean(),
      stddev: this._calculateStdDev(),
      count: this._count, // number of values
      median: percentiles[0.5], // value at which 50% of the values in reservoir are at or below
      p75: percentiles[0.75],
      p95: percentiles[0.95],
      p99: percentiles[0.99],
      p999: percentiles[0.999],
    };
  }

  // update histogram values
  update(value: number) {
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

  // calculate percentiles given an array of number values
  percentiles(percentiles: Array<number>): percentileObject {
    const values: Array<number> = this._sample
      .toArray()
      .sort((a, b) => ((a === b) ? 0 : a - b));

    let results: Object = {};

    for (let i = 0; i < percentiles.length; i++) {
      const percentile: number = percentiles[i];
      if (values.length) {
        const pos: number = percentile * (values.length + 1);
        if (pos < 1) {
          results = { ...results, [percentile]: values[0] };
        } else if (pos >= values.length) {
          results[percentile] = values[values.length - 1];
        } else {
          const lower: number = values[Math.floor(pos) - 1];
          const upper: number = values[Math.ceil(pos) - 1];
          results[percentile] =
            lower + ((pos - Math.floor(pos)) * (upper - lower));
        }
      } else {
        results[percentile] = null;
      }
    }
    return results;
  }

  // check that histogram has values to work with
  hasValues(): boolean {
    return this._count > 0;
  }


  _updateMin(value: number) {
    if (!this._min || value < this._min) {
      this._min = value;
    }
  }

  _updateMax(value: number) {
    if (!this._max || value > this._max) {
      this._max = value;
    }
  }

  _updateVariance(value: number): ?number {
    if (this._count === 1) {
      this._varianceM = value;
      return value;
    }
    const oldM: number = this._varianceM;

    this._varianceM += ((value - oldM) / this._count);
    this._varianceS += ((value - oldM) * (value - this._varianceM));
  }

  _calculateMean(): number {
    return (this._count === 0) ? 0 : this._sum / this._count;
  }

  _calculateVariance(): ?number {
    return (this._count <= 1) ? null : this._varianceS / (this._count - 1);
  }

  _calculateStdDev(): ?number {
    const calculateVariance = this._calculateVariance();
    if (calculateVariance) {
      return Math.sqrt(calculateVariance);
    }
    return null;
  }
}
