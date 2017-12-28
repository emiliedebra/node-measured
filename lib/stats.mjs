/* @flow */

export class Stats {
  _start: number;
  _stats: Object;

  constructor() {
    this.reset();
  }

  reset() {
    this._start = Date.now();
    this._stats = Object.create(null);
  }

  toJSON(stats: ?string | Array<string>) {
    const end = Date.now(); // get end time
    const elapsed = end - this._start; // work out duration
    const elapsedsec = elapsed / 1000; // get in to seconds
    // eslint-disable-next-line no-nested-ternary
    // if stats is a string, split it by comma else return stats, if stats return stats else return keys of _stats
    const collected = (stats ? (typeof stats === 'string' ? stats.split(/[, ]/) : stats) : Object.keys(this._stats))
      .reduce((o, k) => { // on each key and value pair
        const stat = this._stats[k]; // get stat value
        if (typeof stat !== 'undefined') { // if not undefined
          o[k] = Object.keys(stat) // set object value at key
            .reduce((oo, kk) => { // nested reduce
              oo.count = stat[kk]; // set count
              oo.perSec = stat[kk] / elapsedsec; // convert to seconds
              return oo;
            }, Object.create(null));
        }
        return o;
      }, Object.create(null));

    return {
      start: this._start,
      end,
      elapsed,
      collected, // array of collected
    };
  }

  toString() {
    const json = this.toJSON();
    return JSON.stringify(json);
  }

  has(stat: string) {
    return (typeof this._stats[stat] !== 'undefined');
  }

  get(stat: string) {
    return this._stats[stat];
  }

  increment(stat: string, bucket: string, value: number): Object {
    if (!stat) throw new Error('stat arg required');
    if (!bucket) throw new Error('bucket arg required');
    if (typeof value !== 'number') throw new Error('value arg must be a number');

    const _stat = this._stats[stat];
    if (!_stat) { // if it is not recorded in the _stats then add it
      this._stats[stat] = { [bucket]: value };
    } else if (typeof _stat[bucket] === 'undefined') { // if it hasn't got an initialised value set to value
      _stat[bucket] = value;
    } else {
      _stat[bucket] += value; // else add to value already existing
    }
    return this._stats[stat];
  }

  incrCount(stat: string, value: number = 1): Object {
    if (!stat) throw new Error('stat arg required');
    return this.increment(stat, 'count', value); // increase count bucket by 1
  }

  incrSize(stat: string, value: number = 1): Object {
    if (!stat) throw new Error('stat arg required');
    return this.increment(stat, 'size', value); // increase size bucket by 1
  }
}
