/* @flow */
const metrics = require('./metrics');

export class Collection {
  _name: string;
  _metrics: Object;

  constructor(name: string) {
    this._name = name;
    this._metrics = Object.create(null);
  }

  register(name: string, metric: Metric) {
    this._metrics[name] = metric;
  };

  toJSON(): Object {
    let json = {};

    let metric;
    for (metric in this._metrics) {
      if (this._metrics.hasOwnProperty(metric)) {
        json[metric] = this._metrics[metric].toJSON();
      }
    }

    if (!this.name) {
      return json;
    }

    let wrapper = {};
    wrapper[this.name] = json;

    return wrapper;
  }

  end() { // NOTE: is this a function overload?
    let metrics = this._metrics;
    Object.keys(metrics).forEach((name) => {
      let metric = metrics[name];
      if (metric.end) {
        metric.end();
      }
    });
  }

  // NOTE: Where is all this supposed to happen?
  Object.keys(metrics)
    .forEach((name) => {
      let MetricConstructor = metrics[name];
      let method = name.substr(0, 1).toLowerCase() + name.substr(1);

      Collection.prototype[method] = (name: string, properties: Object) => {
        if (!name) {
          throw new Error('Collection.NoMetricName');
        }

        if (this._metrics[name]) {
          return this._metrics[name];
        }

        let metric = new MetricConstructor(properties);
        this.register(name, metric);
        return metric;
      };
    });
}
