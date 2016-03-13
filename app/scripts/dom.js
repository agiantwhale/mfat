/* global MFat, $, _, swal */
'use strict';

$(document).ready(function() {
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
      if(value === 'calories') {
        $('#counterpart').html('portions');
      }
      if(value === 'portion') {
        $('#counterpart').html('calories');
      }
    }
  });
  var $repeats = $('#repeats').selectize({
    highlight: false,
    openOnFocus: true
  });

  var portions = $('#portion').html();
  $('#portion').blur(function() {
    if(portions !== $(this).html()){
      portions = $(this).html().replace(/\D/g, '');
      if(portions === '') {
        portions = '0';
      }
      $(this).html(portions);
    }
  });

  $('#return-btn').click(function() {
    $('#query').removeClass('hidden');
    $('#table').addClass('hidden');
  });

  $('#plan-btn').click(function() {
    swal({
      title: 'One second...',
      text: 'Loading latest dining hall menu...',
      type: 'info',
      allowEscapeKey: false,
      showConfirmButton: false
    });
    var meal = $meal[0].selectize.getValue();
    var location = $location[0].selectize.getValue();
    var response = $goal[0].selectize.getValue();
    var control = response === 'calories' ? 'portion' : 'calories';
    var repeats = $repeats[0].selectize.getValue() === 'yes';

    MFat.scrap(location).then(function(menu) {
      if(!_.isArray(menu[meal])) {
        swal({
          title: 'Oops..',
          text: 'Seems like ' + location + ' isn\'t serving ' + meal.toLowerCase() + ' today!',
          type: 'error',
          confirmButtonText: 'Alright...'
        });
        return;
      }

      MFat.collection(menu[meal], control, response, repeats);
      var result = MFat.optimize(parseInt(portions));

      var totalCalories = _.reduce(result.collection, function(memo, menuItem){ return memo + menuItem.calories; }, 0);
      var totalPortions = _.reduce(result.collection, function(memo, menuItem){ return memo + menuItem.portion; }, 0);

      var html = '';
      _.each(result.collection, function(menuItem) {
        html += '<tr>';
        html += '<td>' + menuItem.name + '</td>';
        html += '<td>' + menuItem.calories + '</td>';
        html += '<td>' + menuItem.portion + '</td>';
        html += '</tr>';
      });

      html += '<tr>';
      html += '<td>Total</td>';
      html += '<td>' + totalCalories + '</td>';
      html += '<td>' + totalPortions + '</td>';
      html += '</tr>';

      $('#table-body').html(html);

      $('#query').addClass('hidden');
      $('#table').removeClass('hidden');

      swal.close();
    }).fail(function() {
      swal({
        title: 'Oops..',
        text: 'There was an error retrieving the latest menu information. Give Jae a message!',
        type: 'error',
        confirmButtonText: 'Alright...'
      });
    });
  });
});
