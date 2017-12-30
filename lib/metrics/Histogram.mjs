/* @flow */
import { ExponentiallyDecayingSample } from '../util/ExponentiallyDecayingSample';

export class Histogram {
  _properties: Object;
  _sample: ExponentiallyDecayingSample;
  _min: ?number;
  _max: ?number;
  _count: number;
  _sum: number;
  _properties: Object;
  _varianceM: number;
  _varianceS: number;

  constructor(properties: Object = {}) {
    this._properties = properties;
    this.init(this._properties);
  }

  update(value: number) {
    this._count++;
    this._sum += value;

    this._sample.update(value);
    this._updateMin(value);
    this._updateMax(value);
    this._updateVariance(value);
  }

  percentiles(percentiles: Array<number>): Object {
    const values: Array<number> = this._sample
      .toArray()
      .sort((a, b) => ((a === b) ? 0 : a - b));
    // console.log(values);
    let results: Object = {};

    let i: number;
    let percentile: number;
    let pos: number;
    let lower: number;
    let upper: number;

    for (i = 0; i < percentiles.length; i++) {
      percentile = percentiles[i];
      if (values.length) {
        pos = percentile * (values.length + 1);
        if (pos < 1) {
          results = { percentile: values[0] }; // NOTE: asked for object destructuring but I think this translated wrong
          // results[percentile] = values[0];
        } else if (pos >= values.length) {
          results[percentile] = values[values.length - 1];
        } else {
          lower = values[Math.floor(pos) - 1];
          upper = values[Math.ceil(pos) - 1];
          results[percentile] =
            lower + ((pos - Math.floor(pos)) * (upper - lower));
        }
      } else {
        results[percentile] = null;
      }
    }
    return results;
  }

  init(properties: Object = {}) {
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

  reset() {
    this.init();
  }

  hasValues(): boolean {
    return this._count > 0;
  }

  toJSON(): Object {
    const percentiles = this.percentiles([0.5, 0.75, 0.95, 0.99, 0.999]);

    return {
      min: this._min,
      max: this._max,
      sum: this._sum,
      variance: this._calculateVariance(),
      mean: this._calculateMean(),
      stddev: this._calculateStdDev(),
      count: this._count,
      median: percentiles[0.5],
      p75: percentiles[0.75],
      p95: percentiles[0.95],
      p99: percentiles[0.99],
      p999: percentiles[0.999],
    };
  }

  _updateMin(value: number) {
    if (this._min === null || value < this._min) {
      this._min = value;
    }
  }

  _updateMax(value: number) {
    if (this._max === null || value > this._max) {
      this._max = value;
    }
  }

  _updateVariance(value: number): ?number {
    if (this._count === 1) {
      this._varianceM = value;
      return value;
    }
    const oldM = this._varianceM;

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
    return (this._count < 1) ? null : Math.sqrt(this._calculateVariance());
  }
}
