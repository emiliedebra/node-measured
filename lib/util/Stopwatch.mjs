/* @flow */

const inherits = require('inherits');
const EventEmitter = require('events').EventEmitter;

export default class StopWatch {
  _options: Object;
  _getTime: number;
  _start: number;
  _ended: boolean;

  constructor(options: Object) {
    _options = options || {};
    EventEmitter.call(this);

    if (options.getTime) {
      this._getTime = options.getTime;
    }
    this._start = this._getTime();
    this._ended = false;
  }

  inherits(Stopwatch, EventEmitter); // NOTE: not sure how to use this in es6

  end(): number | null {
    if (this._ended) {
      return;
    }

    this._ended = true;
    const elapsed   = this._getTime() - this._start;

    this.emit('end', elapsed);
    return elapsed;
  }

  _getTime(): number {
    if (!process.hrtime) {
      return Date.now();
    }

    const hrtime = process.hrtime();
    return hrtime[0] * 1000 + hrtime[1] / (1000 * 1000);
  }
}
