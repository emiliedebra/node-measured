/* @flow */

import { BinaryHeap } from './BinaryHeap';
import * as units from '../util/units';
// const units = require('./units');

export class ExponentiallyDecayingSample {
  _options: Object;
  _elements: BinaryHeap;
  _rescaleInterval: number;
  _alpha: number;
  _size: number;
  _random: Function;
  _landmark: ?number; // not sure what type this is
  _nextRescale: ?number; // not sure what type this is

  ALPHA: number;
  RESCALE_INTERVAL: number;
  SIZE: number;

  constructor(options: Object = {}) {
    // NOTE: Shouldn't be done here I don't think
    this.ALPHA = 0.015;
    this.RESCALE_INTERVAL = units.HOURS;
    this.SIZE = 1028;

    this._elements = new BinaryHeap({
      score(element: Object) {
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

  update(value: number, timestamp: ?number) {
    const now = Date.now();
    if (!this._landmark) {
      this._landmark = now;
      this._nextRescale = this._landmark + this._rescaleInterval;
    }

    const _timestamp = timestamp || now;

    const newSize = this._elements.size() + 1;

    const element = {
      priority: this._priority(_timestamp - this._landmark),
      value,
    };

    if (newSize <= this._size) {
      this._elements.add(element);
    } else if (element.priority > this._elements.first().priority) {
      this._elements.removeFirst();
      this._elements.add(element);
    }

    if (now >= this._nextRescale) {
      this._rescale(now);
    }
  }

  toSortedArray(): Array<number> { // not sure what type it should be returning
    return this._elements
      .toSortedArray()
      .map(element => (element.value));
  }

  toArray(): Array<number> {
    return this._elements
      .toArray()
      .map(element => (element.value));
  }

  _weight(age: number): number {
    // We divide by 1000 to not run into huge numbers before reaching a
    // rescale event.
    return Math.exp(this._alpha * (age / 1000));
  }

  _priority(age: number): number {
    return this._weight(age) / this._random();
  }

  static random(): number {
    return Math.random();
  }

  _rescale(now: number = Date.now()) {
    // let self = this;
    const oldLandmark: ?number = this._landmark;
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
