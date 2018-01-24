/*  */
/**
 * Class for metrics that increment and decrement
*/
export class Counter {

  constructor(properties = {}) {
    this._count = properties.count || 0;
  }

  toJSON() {
    return this._count;
  }

  inc(n = 1) {
    this._count += n;
  }

  dec(n = 1) {
    this._count -= n;
  }

  reset(count = 0) {
    this._count = count;
  }
}
