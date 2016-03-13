'use strict';

$(document).ready(function() {
  var diningMenu = null;

  var $meal = $('#meal').selectize({
    highlight: false,
    openOnFocus: true
  });
  var $location = $('#location').selectize({
    highlight: false,
    openOnFocus: true
  });
  var $goal = $('#goal').selectize({
    highlight: false,
    openOnFocus: true,
    onChange: function(value) {
      if(value === 'calories')
        $('#counterpart').html('portions');
      if(value === 'portion')
        $('#counterpart').html('calories');
    }
  });
  var $repeats = $('#repeats').selectize({
    highlight: false,
    openOnFocus: true
  });

  var portions = $('#portion').html();
  $('#portion').blur(function() {
    if(portions!==$(this).html()){
      portions = $(this).html().replace(/\D/g,'');
      if(portions === '') portions = '0';
      $(this).html(portions);
    }
  });

  $('#plan-btn').click(function() {
    var meal = $meal[0].selectize.getValue();
    var location = $location[0].selectize.getValue();
    var control = $goal[0].selectize.getValue();
    var response = control === 'calories' ? 'portion' : 'calories';
    var repeats = $repeats[0].selectize.getValue() == 'yes';

    MFat.scrap(location).then(function(menu) {
      MFat.collection(menu[meal], control, response, repeats);
      var result = MFat.optimize(parseInt(portions));
      console.log(result);
    }).fail(function() {
    });
  });
});
