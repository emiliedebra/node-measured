/* @flow */
// Based on http://en.wikipedia.org/wiki/Binary_Heap
// as well as http://eloquentjavascript.net/appendix2.html

// NOTE: this is a Binary Heap of numbers - might not be right
export default class BinaryHeap {
  _options: Object;
  _elements: Array<Object>;
  _score: number;

  constructor(options: Object) {
    this._options = options || {};

    this._elements = options.elements || [];
    this._score = options.score || this._score;
  }

  add(args: Object) {
    let i: number;
    let element: Object; // check type here
    for (i = 0; i < args.length; i++) {
      element = args[i];

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
    const array = [];
    const clone = this.clone();
    let element;

    while (true) {
      element = clone.removeFirst();
      if (element === undefined) {
        break;
      }
      array.push(element);
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
    const bubbleScore: Object = BinaryHeap._score(bubbleElement);
    let parentIndex: number;
    let parentElement: Object;
    let parentScore: Object;
    let _bubbleIndex: number = bubbleIndex;

    while (bubbleIndex > 0) {
      parentIndex = BinaryHeap._parentIndex(bubbleIndex);
      parentElement = this._elements[parentIndex];
      parentScore = BinaryHeap._score(parentElement);

      if (bubbleScore <= parentScore) {
        break;
      }

      this._elements[parentIndex] = bubbleElement;
      this._elements[bubbleIndex] = parentElement;
      _bubbleIndex = parentIndex;
    }
  }

  _sink(sinkIndex: number) {
    const sinkElement: Object = this._elements[sinkIndex];
    const sinkScore: Object = BinaryHeap._score(sinkElement);
    const { length } = this._elements;
    let swapIndex: number;
    let swapScore: Object;
    let swapElement: Object;
    let childIndexes: Array<number>;
    let i: number;
    let childIndex: number;
    let childElement: Object;
    let childScore: Object;
    let _sinkIndex: number = sinkIndex;

    while (true) {
      swapIndex = -1;
      swapScore = {};
      swapElement = {};
      childIndexes = BinaryHeap._childIndexes(sinkIndex);

      for (i = 0; i < childIndexes.length; i++) {
        childIndex = childIndexes[i];

        if (childIndex >= length) {
          break;
        }

        childElement = this._elements[childIndex];
        childScore = BinaryHeap._score(childElement);

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
      }

      this._elements[swapIndex] = sinkElement;
      this._elements[sinkIndex] = swapElement;
      _sinkIndex = swapIndex;
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

  static _score(element: Object): Object {
    return element.valueOf();
  }
}
