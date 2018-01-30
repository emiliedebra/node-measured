/* @flow */
import {
  Meter,
  Counter,
  Gauge,
  Histogram,
  Timer,
} from './metrics';

import {
  ExponentiallyDecayingSample,
} from './util';

import type {
  TCollectionOutput,
  TMetricOutput,
  TMetricCollectionOutput,
} from './types';

declare type TMetricDef = Meter | Counter | Histogram | Timer | Gauge;
declare type TMetricCollection = {
  [key: ?string]: {
    [key: ?string]: TMetricDef
  }
}
export class Collection {
  _name: string;
  _metrics: TMetricCollection;

  constructor(name: string) {
    this._name = name;
    this._metrics = {};
  }

  toJSON(name: ?string): TCollectionOutput {
    const json: TMetricCollectionOutput = {};
    const filter = name ? k => k === name : () => true;
    for (const metric of Object.keys(this._metrics).filter(filter)) {
      const content: TMetricOutput = {};
      for (const metricType of Object.keys(this._metrics[metric])) {
        content[metricType] = this._metrics[metric][metricType].toJSON();
      }
      json[metric] = content;
    }

    // NOTE: You should have to pass it a name so should never get here
    if (!this._name) {
      this._name = '';
    }

    const wrapper: TCollectionOutput = {};
    wrapper[this._name] = json;

    return wrapper;
  }

  // end collection by ending all metrics indvidually
  end() {
    const metrics = this._metrics;
    for (const name of Object.keys(metrics)) {
      for (const type of Object.keys(metrics[name])) {
        if (type === 'TIMER' || type === 'METER') {
          metrics[name][type].end();
        }
      }
    }
  }

  // constructor for a Meter metric
  meter(name: string, properties: Object = {}): Meter {
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

  // constructor for a Gauge metric
  gauge(name: string, properties: Object = {}): Gauge {
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

  // constructor for a Histogram metric
  histogram(name: string, sample: ?ExponentiallyDecayingSample): Histogram {
    if (!name) {
      throw new Error('Collection.NoMetricName');
    }
    if (!this._metrics[name]) {
      this._metrics[name] = {
        HISTOGRAM: new Histogram(sample),
      };
    } else if (!this._metrics[name].HISTOGRAM) {
      this._metrics[name].HISTOGRAM = new Histogram(sample);
    }
    return this._metrics[name].HISTOGRAM;
  }

  // constructor for a Counter metric
  counter(name: string, count: ?number): Counter {
    if (!name) {
      throw new Error('Collection.NoMetricName');
    }
    if (!this._metrics[name]) {
      this._metrics[name] = {
        COUNTER: new Counter(count),
      };
    } else if (!this._metrics[name].COUNTER) {
      this._metrics[name].COUNTER = new Counter(count);
    }
    return this._metrics[name].COUNTER;
  }

  // constructor for a Timer metric
  timer(name: string, properties: Object): Timer {
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
