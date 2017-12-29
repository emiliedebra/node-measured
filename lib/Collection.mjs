/* @flow */
import {
  Meter,
  Counter,
  Gauge,
  Histogram,
  Timer,
} from './metrics';

// type Metric = Meter | Counter | Gauge | Histogram | Timer;

export default class Collection {
  _name: string;
  _metrics: Object;

  constructor(name: string) {
    this._name = name;
    this._metrics = Object.create(null);
  }

  // register(name: string, metric: Metric) {
  //   this._metrics[name] = metric;
  // }

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
    this._metrics[name] = new Meter(properties);
  }

  gauge(name: string, properties: Object = {}) {
    this._metrics[name] = new Gauge(properties);
  }

  histogram(name: string, properties: Object = {}) {
    this._metrics[name] = new Histogram(properties);
  }

  counter(name: string, properties: Object = {}) {
    this._metrics[name] = new Counter(properties);
  }

  Timer(name: string, properties: Object) {
    this._metrics[name] = new Timer(properties);
  }

  // NOTE: Where is all this supposed to happen?
  // Object.keys(metrics)
  //   .forEach((name) => {
  //     let MetricConstructor = metrics[name];
  //     let method = name.substr(0, 1).toLowerCase() + name.substr(1);

  //     Collection.prototype[method] = (name: string, properties: Object) => {
  //       if (!name) {
  //         throw new Error('Collection.NoMetricName');
  //       }

  //       if (this._metrics[name]) {
  //         return this._metrics[name];
  //       }

  //       let metric = new MetricConstructor(properties);
  //       this.register(name, metric);
  //       return metric;
  //     };
  //   });
}
