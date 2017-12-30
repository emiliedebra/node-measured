/* @flow */
import {
  Meter,
  Counter,
  Gauge,
  Histogram,
  Timer,
} from './metrics';

// type Metric = Meter | Counter | Gauge | Histogram | Timer;

export class Collection {
  _name: string;
  _metrics: Object;

  constructor(name: string) {
    this._name = name;
    this._metrics = {};
  }

  toJSON(): Object {
    const json = {};

    for (const metric of Object.keys(this._metrics)) {
      json[metric] = this._metrics[metric].toJSON();
    }

    if (!this._name) {
      return json;
    }

    const wrapper = {};
    wrapper[this._name] = json;

    return wrapper;
  }

  end() { // NOTE: is this a function overload?
    const metrics = this._metrics;
    for (const name of Object.keys(metrics)) {
      if (metrics[name].end) {
        metrics[name].end();
      }
    }
  }

  meter(name: string, properties: Object = {}) {
    if (!name) {
      throw new Error('Collection.NoMetricName');
    }
    if (!this._metrics[name]) {
      this._metrics[name] = new Meter(properties);
    }
    return this._metrics[name];
  }

  gauge(name: string, properties: Object = {}) {
    if (!name) {
      throw new Error('Collection.NoMetricName');
    }
    if (!this._metrics[name]) {
      this._metrics[name] = new Gauge(properties);
    }
    return this._metrics[name];
  }

  histogram(name: string, properties: Object = {}) {
    if (!name) {
      throw new Error('Collection.NoMetricName');
    }
    if (!this._metrics[name]) {
      this._metrics[name] = new Histogram(properties);
    }
    return this._metrics[name];
  }

  counter(name: string, properties: Object = {}) {
    if (!name) {
      throw new Error('Collection.NoMetricName');
    }
    if (!this._metrics[name]) {
      this._metrics[name] = new Counter(properties);
    }
    return this._metrics[name];
  }

  timer(name: string, properties: Object) {
    if (!name) {
      throw new Error('Collection.NoMetricName');
    }
    if (!this._metrics[name]) {
      this._metrics[name] = new Timer(properties);
    }
    return this._metrics[name];
  }
}
