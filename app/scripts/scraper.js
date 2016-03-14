/* global jQuery */
'use strict';

this.MFat = (function(exports, $) {
  var extractItem = function(menuitem) {
    try {
      var menuname = menuitem.name;
      var portion = parseInt(menuitem.itemsize.portion_size);
      var serving = menuitem.itemsize.serving_size;
      var kcal = menuitem.itemsize.nutrition.kcal;
      kcal = parseInt(kcal.substring(0, kcal.length - 4));
      return {
        name: menuname,
        portion: portion,
        serving: serving,
        calories: kcal
      };
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
}(this.MFat || {}, jQuery));
