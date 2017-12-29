/* global describe, it, beforeEach, afterEach */
// const common = require('../../common');
import assert from 'assert';
import { describe, it, beforeEach } from 'mocha';
import BinaryHeap from '../../../lib/util/BinaryHeap';

describe('BinaryHeap#toArray', () => {
  it('is empty in the beginning', () => {
    const heap = new BinaryHeap();
    assert.deepEqual(heap.toArray(), []);
  });

  it('does not leak internal references', () => {
    const heap = new BinaryHeap();
    const array = heap.toArray();
    array.push(1);

    assert.deepEqual(heap.toArray(), []);
  });
});

describe('BinaryHeap#toSortedArray', () => {
  it('is empty in the beginning', () => {
    const heap = new BinaryHeap();
    assert.deepEqual(heap.toSortedArray(), []);
  });

  it('does not leak internal references', () => {
    const heap = new BinaryHeap();
    const array = heap.toSortedArray();
    array.push(1);

    assert.deepEqual(heap.toSortedArray(), []);
  });

  it('returns a sorted array', () => {
    const heap = new BinaryHeap();
    heap.add(1, 2, 3, 4, 5, 6, 7, 8);

    assert.deepEqual(heap.toSortedArray(), [8, 7, 6, 5, 4, 3, 2, 1]);
  });
});

describe('BinaryHeap#add', () => {
  let heap;
  beforeEach(() => {
    heap = new BinaryHeap();
  });

  it('lets you add one element', () => {
    heap.add(1);

    assert.deepEqual(heap.toArray(), [1]);
  });

  it('lets you add two elements', () => {
    heap.add(1);
    heap.add(2);

    assert.deepEqual(heap.toArray(), [2, 1]);
  });

  it('lets you add two elements at once', () => {
    heap.add(1, 2);

    assert.deepEqual(heap.toArray(), [2, 1]);
  });

  it('places elements according to their valueOf()', () => {
    heap.add(2);
    heap.add(1);
    heap.add(3);

    assert.deepEqual(heap.toArray(), [3, 1, 2]);
  });
});

describe('BinaryHeap#removeFirst', () => {
  let heap;
  beforeEach(() => {
    heap = new BinaryHeap();
    heap.add(1, 2, 3, 4, 5, 6, 7, 8);
  });

  it('removeFirst returns the last element', () => {
    const element = heap.removeFirst();
    assert.equal(element, 8);
  });

  it('removeFirst removes the last element', () => {
    heap.removeFirst();
    assert.equal(heap.toArray().length, 7);
  });

  it('removeFirst works multiple times', () => {
    assert.equal(heap.removeFirst(), 8);
    assert.equal(heap.removeFirst(), 7);
    assert.equal(heap.removeFirst(), 6);
    assert.equal(heap.removeFirst(), 5);
    assert.equal(heap.removeFirst(), 4);
    assert.equal(heap.removeFirst(), 3);
    assert.equal(heap.removeFirst(), 2);
    assert.equal(heap.removeFirst(), 1);
    assert.equal(heap.removeFirst(), undefined);
  });
});

describe('BinaryHeap#first', () => {
  let heap;
  beforeEach(() => {
    heap = new BinaryHeap();
    heap.add(1, 2, 3);
  });

  it('returns the first element but does not remove it', () => {
    const element = heap.first();
    assert.equal(element, 3);

    assert.equal(heap.toArray().length, 3);
  });
});

describe('BinaryHeap#size', () => {
  it('takes custom score function', () => {
    const heap = new BinaryHeap({ elements: [1, 2, 3] });
    assert.equal(heap.size(), 3);
  });
});

describe('BinaryHeap', () => {
  it('takes custom score function', () => {
    const heap = new BinaryHeap({ score: obj => -obj });

    heap.add(8, 7, 6, 5, 4, 3, 2, 1);
    assert.deepEqual(heap.toSortedArray(), [1, 2, 3, 4, 5, 6, 7, 8]);
  });
});
