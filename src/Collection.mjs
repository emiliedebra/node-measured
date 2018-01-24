/* @flow */
import {
  Meter,
  Counter,
  Gauge,
  Histogram,
  Timer,
} from './metrics';

export class Collection {
  _name: string;
  _metrics: Object;

  constructor(name: string) {
    this._name = name;
    this._metrics = {};
  }

  toJSON(name: ?string): Object {
    const json = {};
    const filter = name ? k => k === name : () => true;
    for (const metric of Object.keys(this._metrics).filter(filter)) {
      const content = {};
      for (const metricType of Object.keys(this._metrics[metric])) {
        content[metricType] = this._metrics[metric][metricType].toJSON();
      }
      json[metric] = content;
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

  meter(name: string, properties: Object = {}) {
    if (!name) {
      throw new Error('Collection.NoMetricName');
    }
    if (!this._metrics[name]) {
      this._metrics[name] = {
        METER: new Meter(properties),
      };
    } else if (!this._metrics[name].METER) {
      this._metrics[name].METER = new Meter(properties);
    }
    // if it already exists it returns existing metric
    return this._metrics[name].METER;
  }

  gauge(name: string, properties: Object = {}) {
    if (!name) {
      throw new Error('Collection.NoMetricName');
    }
    if (!this._metrics[name]) {
      this._metrics[name] = {
        GAUGE: new Gauge(properties),
      };
    } else if (!this._metrics[name].GAUGE) {
      this._metrics[name].GAUGE = new Gauge(properties);
    }
    return this._metrics[name].GAUGE;
  }

  histogram(name: string, properties: Object = {}) {
    if (!name) {
      throw new Error('Collection.NoMetricName');
    }
    if (!this._metrics[name]) {
      this._metrics[name] = {
        HISTOGRAM: new Histogram(properties),
      };
    } else if (!this._metrics[name].HISTOGRAM) {
      this._metrics[name].HISTOGRAM = new Histogram(properties);
    }
    return this._metrics[name].HISTOGRAM;
  }

  counter(name: string, properties: Object = {}) {
    if (!name) {
      throw new Error('Collection.NoMetricName');
    }
    if (!this._metrics[name]) {
      this._metrics[name] = {
        COUNTER: new Counter(properties),
      };
    } else if (!this._metrics[name].COUNTER) {
      this._metrics[name].COUNTER = new Counter(properties);
    }
    return this._metrics[name].COUNTER;
  }

  timer(name: string, properties: Object) {
    if (!name) {
      throw new Error('Collection.NoMetricName');
    }
    if (!this._metrics[name]) {
      this._metrics[name] = {
        TIMER: new Timer(properties),
      };
    } else if (!this._metrics[name].TIMER) {
      this._metrics[name].TIMER = new Timer(properties);
    }
    return this._metrics[name].TIMER;
  }
}
