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
  });

  if(collection.length == 0) {
    return {
      collection: [],
      accumulator: 0
    };
  }

  var prev_result =   optimize(collection.slice(0,collection.length-1),
                      {control: control, response: response, target: target});
  var last_element =  collection[collection.length-1];
  var curr_result =   optimize(collection,
                      {control: control, response: response,
                      target: target-last_element[control]});
  curr_result.collection.push(last_element);
  curr_result.accumulator += last_element[response];

  if(curr_result.accumulator > prev_result.accumulator) return curr_result;
  else return prev_result;
}
