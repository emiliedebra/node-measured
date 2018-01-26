/* @flow */
import type {
  TCounterOutput,
} from '../types';
/**
 * Class for metrics that increment and decrement
*/
export class Counter {
  _count: number;

  constructor(count: number = 0) {
  // constructor(properties: Object = {}) {
    this._count = count; // || 0;
  }

  // outputs JSON
  toJSON(): TCounterOutput {
    return this._count;
  }

  // increase counter, default to 1 if no param
  inc(n: number = 1) {
    this._count += n;
  }

  // decrease counter, default to 1 if no param
  dec(n: number = 1) {
    this._count -= n;
  }

  // reset counter, default to 0 if no param
  reset(count: number = 0) {
    this._count = count;
  }
}
