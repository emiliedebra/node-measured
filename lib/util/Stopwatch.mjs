/* @flow */

// import inherits from 'inherits';
// import mixin from 'mixin';
import EventEmitter from 'events';

export default class Stopwatch extends EventEmitter {
  _getTime: any; // NOTE: how to represent a function type?
  _start: number;
  _ended: boolean;

  constructor(options: Object = {}) {
    super();
    // EventEmitter.call(this);

    if (options.getTime) {
      this._getTime = options.getTime;
    }
    this._start = this._getTime();
    this._ended = false;
  }


  end(): number | null {
    if (this._ended) {
      return 0;
    }

    this._ended = true;
    const elapsed = Stopwatch._getTime() - this._start;

    this.emit('end', elapsed);
    return elapsed;
  }

  static _getTime(): number {
    if (!process.hrtime) {
      return Date.now();
    }

    const hrtime = process.hrtime();
    return ((hrtime[0] * 1000) + hrtime[1]) / (1000 * 1000);
  }
}
