/* @flow */
import Meter from './Meter';
import Histogram from './Histogram';

const Stopwatch = require('../util/Stopwatch');

export class Timer {
  _properties: Object;
  _meter: Meter;
  _histogram: Histogram;
  _getTime: number;

  constructor(properties: Object) {
    this._properties = properties || Object.create(null);

    this._meter = this._properties.meter || new Meter({});
    this._histogram = this._properties.histogram || new Histogram({});
    this._getTime = this._properties.getTime;
  }

  start(): Stopwatch {
    // const self = this;
    const watch = new Stopwatch({ getTime: this._getTime });

    watch.once('end', (elapsed) => {
      this.update(elapsed);
    });

    return watch;
  }

  update(value: number) {
    this._meter.mark(1);
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

  toJSON(): Object {
    return {
      meter: this._meter.toJSON(),
      histogram: this._histogram.toJSON(),
    };
  }
}
