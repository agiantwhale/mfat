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
var dp = (function(dp) {
  // Recursive implementation
  // Will kill your callstack
  dp.optimize = function(collection, options) {
    var control = options.control;
    var response = options.response;
    var target = options.target;

    collection = collection.filter(function(a) {
      return a[control] <= target;
    });

    if(collection.length == 0) {
      return {
        collection: [],
        accumulator: 0
      };
    }

    var prev_result =   dp.optimize(collection.slice(0,collection.length-1),
                        {control: control, response: response, target: target});
    var last_element =  collection[collection.length-1];
    var curr_result =   dp.optimize(collection,
                        {control: control, response: response,
                        target: target-last_element[control]});
    curr_result.collection.push(last_element);
    curr_result.accumulator += last_element[response];

    if(curr_result.accumulator > prev_result.accumulator) return curr_result;
    else return prev_result;
  };

  // Binary search
  // Check if there is a browser implementation?
  dp.search = function(collection, options) {
    var control = options.control;
    var target = options.target;

    var low = 0, high = collection.length;

    if(target < collection[0][control]) return -1;

    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (collection[control] < target) low = mid + 1; else high = mid;
    }
    return low;
  };

  var retrieve = function(index, target, cache) {
    if(!cache[index] || !cache[index][target]) return null;
    return cache[index][target];
  };

  var set = function(index, target, value, cache) {
    cache[index] = cache[index] || {};
    cache[index][target] = value;
  };

  var iterate = function(collection, options, cache, queue) {
    var control = options.control;
    var response = options.response;
    var target = options.target;
    var index = Math.min(dp.search(collection, options), options.index);

    if(index === -1) {
      set(index, target, {
        collection: [],
        accumulator: 0
      }, cache);

      return true;
    }

    var prev_result = retrieve(index-1, target, cache);
    if(prev_result === null) {
      queue.push([index-1, target]); return false;
    }

    var last_element = collection[collection.length-1];
    var curr_result = retrieve(index, target-last_element[control], cache);
    if(curr_result === null) {
      queue.push([index, target-last_element[control]]); return false;
    }
    curr_result.collection.push(index);
    curr_result.accumulator += last_element[response];

    if(curr_result.accumulator > prev_result.accumulator)
      set(index, target, curr_result, cache);
    else
      set(index, target, prev_result, cache);

    return true;
  };

  // Iterative
  dp.reduce = function(collection, options) {
    // save the original target
    var target = options.target;

    // Sort the collection first.
    var control = options.control;
    collection = collection.sort(function(a,b) {
      return a[control] - b[control];
    });

    // Add last index to options
    options.index = collection.length-1;

    var cache = {};
    var queue = [];
    queue.push([options.index, options.target]);

    while(queue.length !== 0) {
      var last_params = queue[queue.length-1];
      options.index = last_params[0];
      options.target = last_params[1];
      if(iterate(collection, options, cache, queue)) queue.pop();
    }

    return retrieve(collection.index-1, target, cache);
  };

  return dp;
}(dp || {}));
