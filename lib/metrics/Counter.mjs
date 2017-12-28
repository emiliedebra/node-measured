/* @flow */
export class Counter {
  _count: number;
  _properties: Object;

  constructor(properties: Object) {
    this._properties = properties || Object.create(null);
    this._count = this._properties.count || 0;
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
