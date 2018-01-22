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
          type: 'COUNTER',
          value: 3,
        },
        b: {
          type: 'COUNTER',
          value: 5,
        },
      },
    });
  });

  it('returns same metric object when given the same name', () => {
    const a1 = collection.counter('a');
    const a2 = collection.counter('a');

    assert.strictEqual(a1, a2);
  });

  it('throws exception when creating a metric without name', () => {
    assert.throws(() => {
      collection.counter();
    }, /Collection\.NoMetricName/);
  });
});
