/* @flow */
export default class Counter {
  _count: number;

  constructor(properties: Object = {}) {
    this._count = properties.count || 0;
  }

  toJSON() {
    return this._count;
  }

  inc(n: number) {
    this._count += (arguments.length ? n : 1);
  }

  dec(n: number) {
    this._count -= (arguments.length ? n : 1);
  }

  reset(count: number) {
    this._count = count || 0;
  }
}
