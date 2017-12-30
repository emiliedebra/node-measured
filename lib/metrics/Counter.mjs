/* @flow */
export class Counter {
  _count: number;

  constructor(properties: Object = {}) {
    this._count = properties.count || 0;
  }

  toJSON() {
    return this._count;
  }

  inc(n: number = 1) {
    this._count += n;
  }

  dec(n: number = 1) {
    this._count -= n;
  }

  reset(count: number = 0) {
    this._count = count;
  }
}
