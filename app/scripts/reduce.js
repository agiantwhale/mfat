'use strict';

// REQUIRES:  collection must be sorted list of objects with
//            members control and response
//            options: {
//              "control": string,    // parameter to min (eg: calories)
//              "response": string,   // parameter to max (eg: portion)
//              "target": integer     // numeric value to optimize "control"
//            }
// EFFECTS:   returns the following object
//            {
//              "collection": array,  // array of selected objects
//              "target": integer     // total optimized numeric value
//            }
var MFat = (function(exports) {
  // Recursive implementation
  // Will kill your callstack
  var collection = [];
  var control = '';
  var response = '';
  var memoize = {};
  var store = [];
  var reduceCounts = function(target, counts) {
    var sortObject = {};
    sortObject[control] = target;
    var minCounts = _.sortedIndex(collection, sortObject, control);
    if(collection[minCounts][control] == target) minCounts++;
    return Math.min(minCounts, counts);
  };
  var hasher = function(a, b) {
    if(a < 0) return -1;
    b = reduceCounts(a, b);
    return a >= b ? a * a + a + b : a + b * b;
  };
  var reduce = function(target, counts) {
    console.log('Target: ' + target + ', Counts: ' + counts);
    if(counts == 0 || target < 0) {
      memoize[hasher(target, counts)] = {
        collection: [],
        accumulator: 0
      };
      return true;
    }

    if(!_.isUndefined(memoize[hasher(target, counts)])) {
      return true;
    }

    var prevResult = memoize[hasher(target, counts-1)];
    if(_.isUndefined(prevResult)) {
      store.push([target, counts-1]);
      return false;
    }

    var lastElement = collection[counts-1];
    var currResult = memoize[hasher(target - lastElement[control],
                                     counts)];
    if(_.isUndefined(currResult)) {
      store.push([target - lastElement[control], counts]);
      return false;
    }

    currResult = {
      collection: currResult.collection.slice(0),
      accumulator: currResult.accumulator
    };
    currResult.collection.push(lastElement);
    currResult.accumulator += lastElement[response];

    if(currResult.accumulator > prevResult.accumulator)
      memoize[hasher(target, counts)] = currResult;
    else
      memoize[hasher(target, counts)] = prevResult;

    return true;
  };

  exports.optimize = function(target) {
    var counts = reduceCounts(target, collection.length);
    store.push([target, counts]);

    while(store.length != 0) {
      if(reduce.apply(null, _.last(store))) {
        console.log('Store queue: ' + store.length);
        store = _.initial(store);
      }
    }

    return memoize[hasher(target, counts)];
  };
  exports.collection = function(co, ctrl, resp) {
    memoize = {};
    store = [];
    control = ctrl;
    response = resp;
    collection = _.sortBy(co, control);
  };

  return exports;
}(MFat || {}));
