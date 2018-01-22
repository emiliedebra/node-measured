/*  */
import EventEmitter from 'events';

export class Stopwatch extends EventEmitter {

  constructor(options = {}) {
    super();

    this._getTime = options.getTime || Stopwatch.getTime;
    this._start = this._getTime();
    this._ended = false;
  }


  end() {
    if (this._ended) {
      return null;
    }

    this._ended = true;
    const elapsed = this._getTime() - this._start;

    this.emit('end', elapsed);
    return elapsed;
  }

  static getTime() {
    if (!process.hrtime) {
      return Date.now();
    }

    const hrtime = process.hrtime();
    return ((hrtime[0] * 1000) + hrtime[1]) / (1000 * 1000);
  }
}
