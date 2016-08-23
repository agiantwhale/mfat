/* global _ */
'use strict';

class DPResolver {
  constructor(reduceControl, reduceTarget, allowRepeats,
              findIndex = _.sortedIndex, // Feel free to implement binary search
              sortBy = _.sortBy
              ) {
    this.control = reduceControl;
    this.response = reduceTarget;
    this.allowRepeats = allowRepeats;
    this.findIndex = findIndex;
    this.sortBy = sortBy;
  }

  optimize(collection, target, memoize = true) {
    this.sortedCollection = this.sortBy(collection, this.control);

    let result = this._reduceRecursively(this.sortedCollection, target);
    return result.collection;
  }

  _buildResult(collection) {
    return {
      collection,
      accumulator: collection.reduce((p, c) => p + c, 0)
    };
  }

  _cloneResult(result) {
    return {
      collection: result.collection.slice(),
      accumulator: result.accumulator
    };
  }

  _appendElement(result, element) {
    let result = this._cloneResult(result);
    result.collection.push(element);
    result.accumulator += element[this.response];
    return result;
  }

  _cutOffIndex(target, maxIndex = this.sortedCollection.length-1) {
    const sortObject = {};
    sortObject[this.control] = target;

    let cutOffIndex = this.findBy(this.sortedCollection, sortObject, control);

    if(cutOffIndex < collection.length &&
       this.collection[cutOffIndex][this.control] === target) cutOffIndex++;

    return Math.min(cutOffIndex, maxIndex);
  };

  _reduceRecursively(target, maxIndex = this.sortedCollection.length) {
    const cutOffIndex = this._cutOffIndex(target, maxIndex);

    if(cutOffIndex === 0) return this._buildResult(collection);

    let prevResult = this._reduceRecursively(target, cutOffIndex-1);
    let currResult =  this._reduceRecursively(target - collection[cutOffIndex][this.control],
                                              this.allowRepeats ? cutOffIndex : cutOffIndex-1);
    currResult.collection.push(collection[cutOffIndex]);
    currResult.accumulator += collection[cutOffIndex][this.response];

    if(currResult.accumulator > prevResult.accumulator) return currResult;
    else return prevResult;
  };

  _reduceIteratively(target, maxIndex, memoize) {
    const cutOffIndex = this._cutOffIndex(target, maxIndex);

    if(cutOffIndex <= 0 || target < 0)
      return memoize.update(a, b, this._buildResult(collection));

    if(!memoize.exists(target, cutOffIndex-1))
      return memoize.queue(target, cutOffIndex-1);
    let prevResult = memoize.retrieve(target, cutOffIndex-1);

    var lastElement = collection[cutOffIndex-1];
    let currentTarget = target-lastElement[this.control],
        currentIndex = this.allowRepeats ? cutOffIndex : cutOffIndex-1;
    if(!memoize.exists(currentTarget, currentIndex))
      return memoize.queue(currentTarget, currentIndex);
    let currResult = this._cloneResult(
      memoize.retrieve(currentTarget,
                       currentIndex)
    );
    this._appendElement(currResult, lastElement);

    let finalResult =
      currResult.accumulator > prevResult.accumulator ? currResult : prevResult;

    return memoize.update(target, cutOffIndex, finalResult);
  };
}

this.TheResolver = (function(exports, _) {
  // Recursive implementation
  // Will kill your callstack
  var allowRepeats = false;
  var collection = [];
  var control = '';
  var response = '';
  var memoize = {};
  var store = [];
  var reduceCounts = function(target, counts) {
    var sortObject = {};
    sortObject[control] = target;
    var minCounts = _.sortedIndex(collection, sortObject, control);
    if(minCounts < collection.length &&
       collection[minCounts][control] === target) {
          minCounts++;
       }
    return Math.min(minCounts, counts);
  };
  var hasher = function(a, b) {
    if(a < 0) {
      return -1;
    }
    return a >= b ? a * a + a + b : a + b * b;
  };
  var reduce = function(target, counts) {
    var reducedCounts = reduceCounts(target, counts);
    if(reducedCounts <= 0 || target < 0) {
      memoize[hasher(target, counts)] = {
        collection: [],
        accumulator: 0
      };
      return true;
    }

    if(!_.isUndefined(memoize[hasher(target, reducedCounts)])) {
      memoize[hasher(target, counts)] = memoize[hasher(target, reducedCounts)];
      return true;
    }

    var prevResult = memoize[hasher(target, reducedCounts - 1)];
    if(_.isUndefined(prevResult)) {
      store.push([target, reducedCounts - 1]);
      return false;
    }

    var lastElement = collection[reducedCounts - 1];
    var currResult = memoize[hasher(target - lastElement[control],
                                    allowRepeats ? reducedCounts : reducedCounts - 1)];
    if(_.isUndefined(currResult)) {
      store.push([target - lastElement[control],
                  allowRepeats ? reducedCounts : reducedCounts - 1]);
      return false;
    }

    currResult = {
      collection: currResult.collection.slice(0),
      accumulator: currResult.accumulator
    };
    currResult.collection.push(lastElement);
    currResult.accumulator += lastElement[response];

    if(currResult.accumulator > prevResult.accumulator) {
      memoize[hasher(target, counts)] = currResult;
    } else {
      memoize[hasher(target, counts)] = prevResult;
    }

    return true;
  };

  exports.optimize = function(target) {
    var counts = reduceCounts(target, collection.length);
    store.push([target, counts]);

    while(store.length !== 0) {
      if(reduce.apply(null, _.last(store))) {
        store = _.initial(store);
      }
    }

    return memoize[hasher(target, counts)];
  };
  exports.collection = function(co, ctrl, resp, repe) {
    memoize = {};
    store = [];
    control = ctrl;
    response = resp;
    allowRepeats = repe;
    collection = _.sortBy(co, control);
  };

  return exports;
}(this.TheResolver || {}, _)); // Relies on underscore
