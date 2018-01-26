/* @flow */
import type {
  TGaugeOutput,
} from '../types';
/**
 * Class for metrics that can be read instantly
*/
export class Gauge {
  _readFn: Function;

  constructor(readFn: Function) {
    this._readFn = readFn;
  }
  // This is sync for now, but maybe async gauges would be useful as well?
  toJSON(): TGaugeOutput {
    return this._readFn();
  }
}
