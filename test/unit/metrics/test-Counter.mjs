/* global describe, it, beforeEach, afterEach */
import { describe, it, beforeEach } from 'mocha';
import { Counter } from '../../../lib/metrics/Counter';

const assert = require('assert');

describe('Counter', () => {
  let counter;
  beforeEach(() => {
    counter = new Counter();
  });

  it('has initial value of 0', () => {
    const json = counter.toJSON();
    assert.deepEqual(json, 0);
  });

  it('can be initialized with a given count', () => {
    counter = new Counter({ count: 5 });
    assert.equal(counter.toJSON(), 5);
  });

  it('#inc works incrementally', () => {
    counter.inc(5);
    assert.equal(counter.toJSON(), 5);

    counter.inc(3);
    assert.equal(counter.toJSON(), 8);
  });

  it('#inc defaults to 1', () => {
    counter.inc();
    assert.equal(counter.toJSON(), 1);

    counter.inc();
    assert.equal(counter.toJSON(), 2);
  });

  it('#inc adds zero', () => {
    counter.inc(0);
    assert.equal(counter.toJSON(), 0);
  });

  it('#dec works incrementally', () => {
    counter.dec(3);
    assert.equal(counter.toJSON(), -3);

    counter.dec(2);
    assert.equal(counter.toJSON(), -5);
  });

  it('#dec defaults to 1', () => {
    counter.dec();
    assert.equal(counter.toJSON(), -1);

    counter.dec();
    assert.equal(counter.toJSON(), -2);
  });

  it('#dec subtracts zero', () => {
    counter.dec(0);
    assert.equal(counter.toJSON(), 0);
  });

  it('#reset works', () => {
    counter.inc(23);
    assert.equal(counter.toJSON(), 23);

    counter.reset();
    assert.equal(counter.toJSON(), 0);

    counter.reset(50);
    assert.equal(counter.toJSON(), 50);
  });
});
