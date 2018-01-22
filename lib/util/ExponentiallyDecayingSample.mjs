/*  */

import { BinaryHeap } from './BinaryHeap';
import * as units from '../util/units';

export class ExponentiallyDecayingSample {

  // constants

  constructor(options = {}) {
    // NOTE: Shouldn't be done here I don't think
    this.ALPHA = 0.015;
    this.RESCALE_INTERVAL = units.HOURS;
    this.SIZE = 1028;

    this._elements = new BinaryHeap({
      score(element) {
        return -element.priority;
      },
    });

    this._rescaleInterval = options.rescaleInterval || this.RESCALE_INTERVAL;
    this._alpha = options.alpha || this.ALPHA;
    this._size = options.size || this.SIZE;
    this._random = options.random || ExponentiallyDecayingSample.random;
    this._landmark = null;
    this._nextRescale = null;
  }

  // NOTE: Using Date.now() twice yields different results?
  update(value, timestamp = Date.now()) {
    const now = Date.now();
    if (!this._landmark) {
      this._landmark = now;
      this._nextRescale = this._landmark + this._rescaleInterval;
    }
    const landmark = this._landmark;
    const nextRescale = this._nextRescale;

    const priority = this._priority(timestamp - landmark);
    const newSize = this._elements.size() + 1;

    const element = {
      priority,
      value,
    };

    if (newSize <= this._size) {
      this._elements.add(element);
    } else if (element.priority > this._elements.first().priority) {
      this._elements.removeFirst();
      this._elements.add(element);
    }

    if (nextRescale && now >= nextRescale) {
      this._rescale(now);
    }
  }

  toSortedArray() {
    return this._elements
      .toSortedArray()
      .map(element => (element.value));
  }

  toArray() {
    return this._elements
      .toArray()
      .map(element => (element.value));
  }

  _weight(age) {
    // We divide by 1000 to not run into huge numbers before reaching a
    // rescale event.
    return Math.exp(this._alpha * (age / 1000));
  }

  _priority(age) {
    return this._weight(age) / this._random();
  }

  static random() {
    return Math.random();
  }

  _rescale(now = Date.now()) {
    // this._landmark should not be null at this point
    const oldLandmark = this._landmark || now;
    this._landmark = now;
    this._nextRescale = now + this._rescaleInterval;
    const factor = this._priority(-(this._landmark - oldLandmark));

    this._elements
      .toArray()
      .forEach((element) => {
        element.priority *= factor;
      });
  }
}
