/* @flow */

// import inherits from 'inherits';
// import mixin from 'mixin';
import EventEmitter from 'events';

export class Stopwatch extends EventEmitter {
  _getTime: Function;
  _start: number;
  _ended: boolean;

  constructor(options: Object = {}) {
    super();
    // EventEmitter.call(this);


    this._getTime = options.getTime || Stopwatch.getTime;
    this._start = this._getTime();
    this._ended = false;
  }


  end(): number | null {
    if (this._ended) {
      return null;
    }

    this._ended = true;
    const elapsed = this._getTime() - this._start;

    this.emit('end', elapsed);
    return elapsed;
  }

  static getTime(): number {
    if (!process.hrtime) {
      return Date.now();
    }

    const hrtime = process.hrtime();
    return ((hrtime[0] * 1000) + hrtime[1]) / (1000 * 1000);
  }
}
