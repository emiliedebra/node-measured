/*  */
import {
  Meter,
  Counter,
  Gauge,
  Histogram,
  Timer,
} from './metrics';

export class Collection {

  constructor(name) {
    this._name = name;
    this._metrics = {};
  }

  toJSON() {
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

  end() {
    const metrics = this._metrics;
    for (const name of Object.keys(metrics)) {
      if (metrics[name].end) {
        metrics[name].end();
      }
    }
  }

  // Constructors of metric types

  meter(name, properties = {}) {
    if (!name) {
      throw new Error('Collection.NoMetricName');
    }
    if (!this._metrics[name]) {
      this._metrics[name] = new Meter(properties);
    }
    return this._metrics[name];
  }

  gauge(name, properties = {}) {
    if (!name) {
      throw new Error('Collection.NoMetricName');
    }
    if (!this._metrics[name]) {
      this._metrics[name] = new Gauge(properties);
    }
    return this._metrics[name];
  }

  histogram(name, properties = {}) {
    if (!name) {
      throw new Error('Collection.NoMetricName');
    }
    if (!this._metrics[name]) {
      this._metrics[name] = new Histogram(properties);
    }
    return this._metrics[name];
  }

  counter(name, properties = {}) {
    if (!name) {
      throw new Error('Collection.NoMetricName');
    }
    if (!this._metrics[name]) {
      this._metrics[name] = new Counter(properties);
    }
    return this._metrics[name];
  }

  timer(name, properties) {
    if (!name) {
      throw new Error('Collection.NoMetricName');
    }
    if (!this._metrics[name]) {
      this._metrics[name] = new Timer(properties);
    }
    return this._metrics[name];
  }
}
