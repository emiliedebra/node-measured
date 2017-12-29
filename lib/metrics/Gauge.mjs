/* @flow */
export default class Gauge {
  // NOTE: unsure as to how to handle function types in flow
  _readFn: any;
  constructor(readFn: any) {
    this._readFn = readFn;
  }
  // This is sync for now, but maybe async gauges would be useful as well?
  toJSON() {
    return this._readFn();
  }
}
