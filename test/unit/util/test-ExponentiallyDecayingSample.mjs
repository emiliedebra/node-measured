/* global describe, it, beforeEach, afterEach */
import assert from 'assert';
import { describe, it, beforeEach } from 'mocha';
import { ExponentiallyDecayingSample } from '../../../lib/util/ExponentiallyDecayingSample';
import * as units from '../../../lib/util/units';

describe('ExponentiallyDecayingSample#toSortedArray', () => {
  let sample;
  beforeEach(() => {
    sample = new ExponentiallyDecayingSample({
      size: 3,
      random: () => 1,
    });
  });

  it('returns an empty array by default', () => {
    assert.deepEqual(sample.toSortedArray(), []);
  });

  it('is always sorted by priority', () => {
    sample.update('a', Date.now() + 3000);
    sample.update('b', Date.now() + 2000);
    sample.update('c', Date.now());

    assert.deepEqual(sample.toSortedArray(), ['c', 'b', 'a']);
  });
});

describe('ExponentiallyDecayingSample#toArray', () => {
  let sample;
  beforeEach(() => {
    sample = new ExponentiallyDecayingSample({
      size: 3,
      random: () => 1,
    });
  });

  it('returns an empty array by default', () => {
    assert.deepEqual(sample.toArray(), []);
  });

  it('may return an unsorted array', () => {
    sample.update('a', Date.now() + 3000);
    sample.update('b', Date.now() + 2000);
    sample.update('c', Date.now());

    assert.deepEqual(sample.toArray(), ['c', 'a', 'b']);
  });
});

describe('ExponentiallyDecayingSample#update', () => {
  let sample;
  beforeEach(() => {
    sample = new ExponentiallyDecayingSample({
      size: 2,
      random: () => 1,
    });
  });

  it('can add one item', () => {
    sample.update('a');

    assert.deepEqual(sample.toSortedArray(), ['a']);
  });

  it('sorts items according to priority ascending', () => {
    sample.update('a', Date.now());
    sample.update('b', Date.now() + 1000);

    assert.deepEqual(sample.toSortedArray(), ['a', 'b']);
  });

  it('pops items with lowest priority', () => {
    sample.update('a', Date.now());
    sample.update('b', Date.now() + 1000);
    sample.update('c', Date.now() + 2000);

    assert.deepEqual(sample.toSortedArray(), ['b', 'c']);
  });

  it('items with too low of a priority do not make it in', () => {
    sample.update('a', Date.now() + 1000);
    sample.update('b', Date.now() + 2000);
    sample.update('c', Date.now());

    assert.deepEqual(sample.toSortedArray(), ['a', 'b']);
  });
});

describe('ExponentiallyDecayingSample#_rescale', () => {
  let sample;
  beforeEach(() => {
    sample = new ExponentiallyDecayingSample({
      size: 2,
      random: () => 1,
    });
  });

  it('works as expected', () => {
    sample.update('a', Date.now() + (50 * units.MINUTES));
    sample.update('b', Date.now() + (55 * units.MINUTES));

    let elements = sample._elements.toSortedArray();
    assert.ok(elements[0].priority > 1000);
    assert.ok(elements[1].priority > 1000);

    sample._rescale(Date.now() + (60 * units.MINUTES));

    elements = sample._elements.toSortedArray();
    assert.ok(elements[0].priority < 1);
    assert.ok(elements[0].priority > 0);
    assert.ok(elements[1].priority < 1);
    assert.ok(elements[1].priority > 0);
  });
});
