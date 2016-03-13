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
    var goal = $goal[0].selectize.getValue();

    MFat.scrap(location).then(function(menu) {
      MFat.collection(menu[meal], 'portion', 'calories')
      var result = MFat.optimize(parseInt(portions));
      console.log(result);
    });
  });
});
