/*  */
// Based on http://en.wikipedia.org/wiki/Binary_Heap
// as well as http://eloquentjavascript.net/appendix2.html

export class BinaryHeap {

  constructor(options = {}) {
    this._elements = options.elements || [];
    this._score = options.score || BinaryHeap.score;
  }

  add(...args) {
    for (let i = 0; i < args.length; i++) {
      const element = args[i];

      this._elements.push(element);
      this._bubble(this._elements.length - 1);
    }
  }

  first() {
    return this._elements[0];
  }

  removeFirst() {
    const root = this._elements[0];
    const last = this._elements.pop();

    if (this._elements.length > 0) {
      this._elements[0] = last;
      this._sink(0);
    }

    return root;
  }

  clone() {
    return new BinaryHeap({
      elements: this.toArray(),
      score: this._score,
    });
  }

  toSortedArray() {
    const clone = this.clone();
    const array = [];

    let element = clone.removeFirst();
    while (element !== undefined) {
      array.push(element);
      element = clone.removeFirst();
    }
    return array;
  }

  toArray() {
    return [].concat(this._elements); // NOTE: Should use mapping instead?
  }

  size() {
    return this._elements.length;
  }

  _bubble(bubbleIndex) {
    const bubbleElement = this._elements[bubbleIndex];
    const bubbleScore = this._score(bubbleElement);
    let parentIndex;
    let parentElement;
    let parentScore;
    let _bubbleIndex = bubbleIndex;

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

  _sink(sinkIndex) {
    const sinkElement = this._elements[sinkIndex];
    const sinkScore = this._score(sinkElement);
    const { length } = this._elements;
    let childIndex;
    let childElement;
    let childScore;
    let _sinkIndex = sinkIndex;

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

  static _parentIndex(index) {
    return Math.floor((index - 1) / 2);
  }

  static _childIndexes(index) {
    return [
      (2 * index) + 1,
      (2 * index) + 2,
    ];
  }

  static score(element) {
    return element.valueOf();
  }
}
