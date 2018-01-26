/* global describe, it, beforeEach, afterEach */
import { describe, it, beforeEach } from 'mocha';
import { Histogram } from '../../../lib/metrics/Histogram';
import { ExponentiallyDecayingSample } from '../../../lib/util/ExponentiallyDecayingSample';

const assert = require('assert');
const sinon = require('sinon');

describe('Histogram', () => {
  let histogram;
  beforeEach(() => {
    histogram = new Histogram();
  });

  it('all values are null in the beginning', () => {
    const json = histogram.toJSON();
    assert.strictEqual(json.min, null);
    assert.strictEqual(json.max, null);
    assert.strictEqual(json.sum, 0);
    assert.strictEqual(json.variance, null);
    assert.strictEqual(json.mean, 0);
    assert.strictEqual(json.stddev, null);
    assert.strictEqual(json.count, 0);
    assert.strictEqual(json.median, null);
    assert.strictEqual(json.p75, null);
    assert.strictEqual(json.p95, null);
    assert.strictEqual(json.p99, null);
    assert.strictEqual(json.p999, null);
  });
});

describe('Histogram#update', () => {
  let sample;
  let histogram;
  beforeEach(() => {
    sample = sinon.stub(new ExponentiallyDecayingSample());
    histogram = new Histogram(sample);

    sample.toArray.returns([]);
  });

  it('updates underlaying sample', () => {
    histogram.update(5);
    assert.ok(sample.update.calledWith(5));
  });

  it('keeps track of min', () => {
    histogram.update(5);
    histogram.update(3);
    histogram.update(6);

    assert.equal(histogram.toJSON().min, 3);
  });

  it('keeps track of max', () => {
    histogram.update(5);
    histogram.update(9);
    histogram.update(3);

    assert.equal(histogram.toJSON().max, 9);
  });

  it('keeps track of sum', () => {
    histogram.update(5);
    histogram.update(1);
    histogram.update(12);

    assert.equal(histogram.toJSON().sum, 18);
  });

  it('keeps track of count', () => {
    histogram.update(5);
    histogram.update(1);
    histogram.update(12);

    assert.equal(histogram.toJSON().count, 3);
  });

  it('keeps track of mean', () => {
    histogram.update(5);
    histogram.update(1);
    histogram.update(12);

    assert.equal(histogram.toJSON().mean, 6);
  });

  it('keeps track of variance (example without variance)', () => {
    histogram.update(5);
    histogram.update(5);
    histogram.update(5);

    assert.equal(histogram.toJSON().variance, 0);
  });

  it('keeps track of variance (example with variance)', () => {
    histogram.update(1);
    histogram.update(2);
    histogram.update(3);
    histogram.update(4);

    assert.equal(histogram.toJSON().variance.toFixed(3), '1.667');
  });

  it('keeps track of stddev', () => {
    histogram.update(1);
    histogram.update(2);
    histogram.update(3);
    histogram.update(4);

    assert.equal(histogram.toJSON().stddev.toFixed(3), '1.291');
  });

  it('keeps track of percentiles', () => {
    const values = [];
    let i;
    for (i = 1; i <= 100; i++) {
      values.push(i);
    }
    sample.toArray.returns(values);

    const json = histogram.toJSON();
    assert.equal(json.median.toFixed(3), '50.500');
    assert.equal(json.p75.toFixed(3), '75.750');
    assert.equal(json.p95.toFixed(3), '95.950');
    assert.equal(json.p99.toFixed(3), '99.990');
    assert.equal(json.p999.toFixed(3), '100.000');
  });
});

describe('Histogram#percentiles', () => {
  let sample;
  let histogram;
  beforeEach(() => {
    sample = sinon.stub(new ExponentiallyDecayingSample());
    histogram = new Histogram(sample);

    const values = [];
    let i;
    for (i = 1; i <= 100; i++) {
      values.push(i);
    }

    let swapWith;
    let value;
    for (i = 0; i < 100; i++) {
      swapWith = Math.floor(Math.random() * 100);
      value = values[i];

      values[i] = values[swapWith];
      values[swapWith] = value;
    }

    sample.toArray.returns(values);
  });

  it('calculates single percentile correctly', () => {
    let percentiles = histogram.percentiles([0.5]);
    assert.equal(percentiles[0.5], 50.5);

    percentiles = histogram.percentiles([0.99]);
    assert.equal(percentiles[0.99], 99.99);
  });
});

describe('Histogram#reset', () => {
  let sample;
  let histogram;
  beforeEach(() => {
    sample = new ExponentiallyDecayingSample();
    histogram = new Histogram(sample);
  });

  it('resets all values', () => {
    histogram.update(5);
    histogram.update(2);
    let json = histogram.toJSON();
    for (const key of Object.keys(json)) {
      if (key !== 'type') {
        assert.ok(typeof json[key] === 'number');
      }
    }

    histogram.reset();
    json = histogram.toJSON();

    for (const key of Object.keys(json)) {
      // console.log(json[key]);
      if (key !== 'type') {
        assert.ok(json[key] === 0 || json[key] === null);
      }
    }
  });
});

describe('Histogram#hasValues', () => {
  let histogram;
  beforeEach(() => {
    histogram = new Histogram();
  });

  it('has values', () => {
    histogram.update(5);
    assert.ok(histogram.hasValues());
  });

  it('has no values', () => {
    assert.equal(histogram.hasValues(), false);
  });
});
