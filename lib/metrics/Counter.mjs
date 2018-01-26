/*  */
/**
 * Class for metrics that increment and decrement
*/
export class Counter {

  constructor(count = 0) {
  // constructor(properties: Object = {}) {
    this._count = count; // || 0;
  }

  // outputs JSON
  toJSON() {
    return this._count;
  }

  // increase counter, default to 1 if no param
  inc(n = 1) {
    this._count += n;
  }

  // decrease counter, default to 1 if no param
  dec(n = 1) {
    this._count -= n;
  }

  // reset counter, default to 0 if no param
  reset(count = 0) {
    this._count = count;
  }
}
