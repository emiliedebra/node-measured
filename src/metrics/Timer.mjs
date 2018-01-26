/* @flow */
import { Meter } from './Meter';
import { Histogram } from './Histogram';
import { Stopwatch } from '../util/Stopwatch';
import type {
  TTimerOutput,
} from '../types';
/**
 * Combination of Meters and Histograms
 * Measures rate as well as distribution of scalar events
*/
export class Timer {
  _meter: Meter;
  _histogram: Histogram;
  _getTime: Function;

  constructor(properties: Object = {}) {
    this._meter = properties.meter || new Meter();
    this._histogram = properties.histogram || new Histogram();
    this._getTime = properties.getTime;
  }

  // starts the stopwatch
  start(): Stopwatch {
    const watch = new Stopwatch({ getTime: this._getTime });

    watch.once('end', (elapsed: number) => {
      this.update(elapsed);
    });

    return watch;
  }

  // update meter and histogram values
  update(value: number) {
    this._meter.mark();
    this._histogram.update(value);
  }

  // resets meter and histogram
  reset() {
    this._meter.reset();
    this._histogram.reset();
  }

  // ends the meter (clears interval)
  end() {
    this._meter.end();
  }

  ref() {
    this._meter.ref();
  }

  unref() {
    this._meter.unref();
  }

  // outputs JSON
  toJSON(): TTimerOutput {
    return {
      meter: this._meter.toJSON(),
      histogram: this._histogram.toJSON(),
    };
  }
}
