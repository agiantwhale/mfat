/* global jQuery, _ */
'use strict';

this.MFat = (function(exports, $, _) {
  var shortCodes = {
    'b1': {
      name: 'vitamin B1',
      unit: 'mg'
    },
    'b12': {
      name: 'vitamin B12',
      unit: 'mcg'
    },
    'b2': {
      name: 'vitamin B2',
      unit: 'mg'
    },
    'b6': {
      name: 'vitamin B6',
      unit: 'mg'
    },
    'ca': {
      name: 'calcium',
      unit: 'mg'
    },
    'cho': {
      name: 'carbohydrate',
      unit: 'gm'
    },
    'chol': {
      name: 'cholesterol',
      unit: 'mg'
    },
    'fat': {
      name: 'fat',
      unit: 'gm'
    },
    'fatrn': {
      name: 'trans fat',
      unit: 'gm'
    },
    'fe': {
      name: 'iron',
      unit: 'gm'
    },
    // 'fol': {
    //   name: 'unknown',
    //   unit: 'mcg'
    // },
    'kcal': {
      name: 'calories',
      unit: 'kcal'
    },
    'mg': {
      name: 'magnesium',
      unit: 'mg'
    },
    'na': {
      name: 'sodium',
      unit: 'mg'
    },
    // 'nia': {
    //   name: 'unknown',
    //   unit: 'mg'
    // },
    'pro': {
      name: 'protein',
      unit: 'gm'
    },
    'sfa': {
      name: 'saturated fat',
      unit: 'gm'
    },
    'sugar': {
      name: 'sugar',
      unit: 'gm'
    },
    'tdfb': {
      name: 'dietary fiber',
      unit: 'gm'
    },
    'vitc': {
      name: 'vitamin C',
      unit: 'mg'
    },
    'vite': {
      name: 'vitamin E',
      unit: 'mg'
    },
    'vtaiu': {
      name: 'vitamin A',
      unit: 'iu'
    },
    'zn': {
      name: 'zinc',
      unit: 'mg'
    }
  };
  var shortCodeKeys = _.map(shortCodes, function(obj, key) {return key; });
  exports.shortCodes = shortCodes;

  var extractItem = function(menuitem) {
    try {
      var menuname = menuitem.name;
      var portion = parseInt(menuitem.itemsize.portion_size);
      var serving = menuitem.itemsize.serving_size;
      var extracted = {
        name: menuname,
        portion: portion,
        serving: serving
      };

      for(var i in shortCodeKeys) {
        var key = shortCodeKeys[i];
        var val = parseInt(menuitem.itemsize.nutrition[key]);
        if(!_.isNumber(val) || _.isNaN(val)) {
          return null;
        }
        extracted[key] = parseInt(menuitem.itemsize.nutrition[key]);
      }

      return extracted;
    } catch(e) {console.log(e); }

    return null;
  };

  // Don't try to understand...
  var sanitize = function(data) {
    var menus = {};

    for(var i in data.menu.meal) {
      var meal = data.menu.meal[i];
      var name = meal.name; // BREAKFAST/LUNCH/DINNER
      var items = [];

      for(var j in meal.course) {
        var course = meal.course[j];
        var menuitem = null;
        var extracted = null;
        if($.isArray(course.menuitem)) {
          for(var k in course.menuitem) {
            menuitem = course.menuitem[k];
            extracted = extractItem(menuitem);
            if(extracted) {
              items.push(extracted);
            }
          }
        } else if($.isPlainObject(course.menuitem)){
          menuitem = course.menuitem;
          extracted = extractItem(menuitem);
          if(extracted) {
            items.push(extracted);
          }
        }
      }

      menus[name] = items;
    }

    // Remove non-existant menus
    for(var l in menus) {
      if(menus[l].length === 0) {
        delete menus[l];
      }
    }

    return menus;
  };

  exports.scrap = function(location) {
    var deferred = new $.Deferred();

    var yqlUrl = 'https://query.yahooapis.com/v1/public/yql';
    var url = 'http://api.studentlife.umich.edu/menu/xml2print.php' +
                '?controller=print' +
                '&view=json' +
                '&location=' + encodeURI(location);
    $.ajax({
      url: yqlUrl,
      data: {
        'q': 'SELECT * FROM json WHERE url="' + url + '"',
        'format': 'json',
        'jsonCompat': 'new'
      },
      dataType: 'jsonp',
      success: function(data) {
        data = data.query.results.json;
        var menus = sanitize(data);
        deferred.resolve(menus);
      },
      error: function() {
        // handle error here.
        deferred.reject();
      }
    });

    return deferred.promise();
  };

  return exports;
}(this.MFat || {}, jQuery, _));
