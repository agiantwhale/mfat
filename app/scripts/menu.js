'use strict';

class Menu {
  constructor(name, portion, calories) {
    this.name = name;
    this.portion = portion;
    this.calories = calories;
  }
}

class MenuResource {
  constructor(location) {
    this.location = location;
    this.menus = {};
  }

  retrieve() {}
}

class MichiganResource extends MenuResource {
  retrieve() {
    var resource = this;
    var yql_url = 'https://query.yahooapis.com/v1/public/yql';
    var url = 'http://api.studentlife.umich.edu/menu/xml2print.php'+
                '?controller=print'+
                '&view=json'+
                '&location='+encodeURI(resource.location);
    var request = $.ajax({
      url: yql_url,
      data: {
        'q': 'SELECT * FROM json WHERE url="'+url+'"',
        'format': 'json',
        'jsonCompat': 'new',
      },
      dataType: 'jsonp',
      success: function(data) {
        data = data.query.results.json;
        for(var i in data['menu']['meal']) {
          var meal = data['menu']['meal'][i];
          var name = meal.name; // BREAKFAST/LUNCH/DINNER
          var items = [];

          for(var j in meal.course) {
            var course = meal.course[j];
            if($.isArray(course.menuitem)) {
              for(var k in course.menuitem) {
                var menuitem = course.menuitem[k];
                try {
                  var menuname = menuitem.name;
                  menuname = menuname.substring(0, menuname.length-1);
                  var portion = parseInt(menuitem.itemsize.portion_size);
                  var kcal = menuitem.itemsize.nutrition.kcal;
                  kcal = parseInt(kcal.substring(0, kcal.length-4));
                  items.push(new Menu(
                    menuname,
                    portion,
                    kcal
                  ));
                } catch(e) {}
              }
            } else if($.isPlainObject(course.menuitem)){
              var menuitem = course.menuitem;
              try {
                var menuname = menuitem.name;
                menuname = menuname.substring(0, menuname.length-1);
                var portion = parseInt(menuitem.itemsize.portion_size);
                var kcal = menuitem.itemsize.nutrition.kcal;
                kcal = parseInt(kcal.substring(0, kcal.length-4));
                items.push(new Menu(
                  menuname,
                  portion,
                  kcal
                ));
              } catch(e) {}
            }
          }

          resource.menus[name] = items;
        }

        // Remove non-existant menus
        for(var i in resource.menus) {
          if(resource.menus[i].length == 0) {
            delete resource.menus[i];
          }
        }
      }
    });

    return request;
  }
}
