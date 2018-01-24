/*  */
import { Meter } from './Meter';
import { Histogram } from './Histogram';
import { Stopwatch } from '../util/Stopwatch';
/**
 * Combination of Meters and Histograms
 * Measures rate as well as distribution of scalar events
*/
export class Timer {

  constructor(properties = {}) {
    this._meter = properties.meter || new Meter();
    this._histogram = properties.histogram || new Histogram();
    this._getTime = properties.getTime;
  }

  start() {
    const watch = new Stopwatch({ getTime: this._getTime });

    watch.once('end', (elapsed) => {
      this.update(elapsed);
    });

    return watch;
  }

  update(value) {
    this._meter.mark();
    this._histogram.update(value);
  }

  reset() {
    this._meter.reset();
    this._histogram.reset();
  }

  end() {
    this._meter.end();
  }

  ref() {
    this._meter.ref();
  }

  unref() {
    this._meter.unref();
  }

  toJSON() {
    return {
      meter: this._meter.toJSON(),
      histogram: this._histogram.toJSON(),
    };
  }
}
