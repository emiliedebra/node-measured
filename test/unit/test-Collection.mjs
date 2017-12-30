/* global describe, it, beforeEach, afterEach */
import { describe, it, beforeEach } from 'mocha';
import assert from 'assert';
import { Collection } from '../../lib/Collection';
// var common = require('../common');
// var assert = require('assert');

describe('Collection', () => {
  let collection;
  beforeEach(() => {
    // collection = common.measured.createCollection();
    collection = new Collection();
  });

  it('with two counters', () => {
    // collection = new common.measured.Collection('counters');
    collection = new Collection('counters');
    const a = collection.counter('a');
    const b = collection.counter('b');
    a.inc(3);
    b.inc(5);

    assert.deepEqual(collection.toJSON(), {
      counters: {
        a: 3,
        b: 5,
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
