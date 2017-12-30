/* @flow */
/**
 * Class for metrics that can be read instantly
*/
export class Gauge {
  _readFn: Function;

  constructor(readFn: Function) {
    this._readFn = readFn;
  }
  // This is sync for now, but maybe async gauges would be useful as well?
  toJSON() {
    return this._readFn();
  }
}
