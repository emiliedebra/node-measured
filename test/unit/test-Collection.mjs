/* global describe, it, beforeEach, afterEach */
import { describe, it, beforeEach } from 'mocha';
import assert from 'assert';
import { Collection } from '../..';

describe('Collection', () => {
  let collection;
  beforeEach(() => {
    collection = new Collection();
  });

  it('with two counters', () => {
    collection = new Collection('counters');
    const a = collection.counter('a');
    const b = collection.counter('b');
    a.inc(3);
    b.inc(5);
    assert.deepEqual(collection.toJSON(), {
      counters: {
        a: {
          COUNTER: 3,
        },
        b: {
          COUNTER: 5,
        },
      },
    });
  });

  it('returns same metric object when given the same name', () => {
    let a1 = collection.counter('a');
    let a2 = collection.counter('a');
    assert.strictEqual(a1, a2);

    a1 = collection.meter('a');
    a2 = collection.meter('a');
    assert.strictEqual(a1, a2);

    a1 = collection.histogram('a');
    a2 = collection.histogram('a');
    assert.strictEqual(a1, a2);

    a1 = collection.timer('a');
    a2 = collection.timer('a');

    assert.strictEqual(a1, a2);
    a1 = collection.gauge('a');
    a2 = collection.gauge('a');

    assert.strictEqual(a1, a2);
  });

  it('throws exception when creating a metric without name', () => {
    assert.throws(() => {
      collection.counter();
    }, /Collection\.NoMetricName/);
  });

  it('adds different metric types to the same metric object when given the same name', () => {
    collection = new Collection('metrics');
    collection.counter('a');
    collection.meter('a');
    collection.counter('b');
    collection.meter('b');
    assert.deepEqual(collection.toJSON(), {
      metrics: {
        a: {
          COUNTER: 0,
          METER: {
            mean: 0,
            count: 0,
            currentRate: 0,
            rate1Min: 0,
            rate5Min: 0,
            rate15Min: 0,
          },
        },
        b: {
          COUNTER: 0,
          METER: {
            mean: 0,
            count: 0,
            currentRate: 0,
            rate1Min: 0,
            rate5Min: 0,
            rate15Min: 0,
          },
        },
      },
    });
  });
});
