/* @flow */
// Based on http://en.wikipedia.org/wiki/Binary_Heap
// as well as http://eloquentjavascript.net/appendix2.html

export default class BinaryHeap {
  _elements: Array<Object>;
  _score: Function;

  constructor(options: Object = {}) {
    this._elements = options.elements || [];
    this._score = options.score || BinaryHeap.score;
  }

  add(...args: Array<*>) {
    for (let i: number = 0; i < args.length; i++) {
      const element: Object = args[i];

      this._elements.push(element);
      this._bubble(this._elements.length - 1);
    }
  }

  first(): Object {
    return this._elements[0];
  }

  removeFirst(): Object {
    const root = this._elements[0];
    const last = this._elements.pop();

    if (this._elements.length > 0) {
      this._elements[0] = last;
      this._sink(0);
    }

    return root;
  }

  clone(): BinaryHeap {
    return new BinaryHeap({
      elements: this.toArray(),
      score: this._score,
    });
  }

  toSortedArray(): Array<Object> {
    const clone = this.clone();
    const array = [];

    let element = clone.removeFirst();
    while (element !== undefined) {
      array.push(element);
      element = clone.removeFirst();
    }
    return array;
  }

  toArray(): Array<Object> {
    return [].concat(this._elements);
  }

  size(): number {
    return this._elements.length;
  }

  _bubble(bubbleIndex: number) {
    const bubbleElement: Object = this._elements[bubbleIndex];
    const bubbleScore: number = this._score(bubbleElement);
    let parentIndex: number;
    let parentElement: Object;
    let parentScore: number;
    let _bubbleIndex: number = bubbleIndex;

    while (_bubbleIndex > 0) {
      parentIndex = BinaryHeap._parentIndex(_bubbleIndex);
      parentElement = this._elements[parentIndex];
      parentScore = this._score(parentElement);

      if (bubbleScore <= parentScore) {
        break;
      }

      this._elements[parentIndex] = bubbleElement;
      this._elements[_bubbleIndex] = parentElement;
      _bubbleIndex = parentIndex;
    }
  }

  _sink(sinkIndex: number) {
    const sinkElement: Object = this._elements[sinkIndex];
    const sinkScore: number = this._score(sinkElement);
    const { length } = this._elements;
    let childIndex: ?number;
    let childElement: Object;
    let childScore: ?number;
    let _sinkIndex: number = sinkIndex;

    while (true) {
      let swapIndex = null;
      let swapScore = null;
      let swapElement = null;
      const childIndexes = BinaryHeap._childIndexes(_sinkIndex);

      for (let i = 0; i < childIndexes.length; i++) {
        childIndex = childIndexes[i];

        if (childIndex >= length) {
          break;
        }

        childElement = this._elements[childIndex];
        childScore = this._score(childElement);

        if (childScore > sinkScore) {
          if (swapScore === null || swapScore < childScore) {
            swapIndex = childIndex;
            swapScore = childScore;
            swapElement = childElement;
          }
        }
      }

      if (swapIndex === null) {
        break;
      } else {
        this._elements[swapIndex] = sinkElement;
        this._elements[_sinkIndex] = swapElement || {};
        _sinkIndex = swapIndex;
      }
    }
  }

  static _parentIndex(index: number): number {
    return Math.floor((index - 1) / 2);
  }

  static _childIndexes(index: number): Array<number> {
    return [
      (2 * index) + 1,
      (2 * index) + 2,
    ];
  }

  static score(element: Object): number {
    return element.valueOf();
  }
}
