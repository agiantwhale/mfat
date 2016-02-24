'use strict';

// REQUIRES:  collection must be list of objects with members control and response
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
function optimize(collection, options) {
  var control = options.control;
  var response = options.response;
  var target = options.target;

  collection = collection.filter(function(a) {
    return a[control] <= target;
  }).sort(function(a, b) {
    return a[control] > b[control];
  });

  if(target <= 0 || collection.length == 0) {
    return {
      collection: [],
      accumulator: 0
    };
  }

  var last_element = collection[collection.length-1];
  var last_dont_include = optimize(collection.splice(0,collection.length-1),
                                   options);
  var last_include = optimize(collection,
                              {
                                control: control,
                                response: response,
                                target: target-last_element[control]
                              });
  last_include.collection.push(last_element);
  last_include.accumulator += last_element[response];

  if(last_include.target >= last_dont_include.target) return last_include;
  else return last_dont_include;
}
