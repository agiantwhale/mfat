/* global MFat, $, _, swal */
'use strict';

$(document).ready(function() {
  var goalOptions = _.map(MFat.shortCodes, function(obj, key) {
    return {
      text: obj.name,
      value: key
    };
  });
  goalOptions.push({
    text: 'serving',
    value: 'portion'
  });
  var counterpartOptions = _.map(MFat.shortCodes, function(obj, key) {
    return {
      text: '(' + obj.unit + ') ' + obj.name,
      value: key
    };
  });
  counterpartOptions.push({
    text: '(g) serving',
    value: 'portion'
  });

  var $meal = $('#meal').selectize({
    highlight: false,
    openOnFocus: true
  });
  $meal[0].selectize.setValue('LUNCH');

  var $location = $('#location').selectize({
    highlight: false,
    openOnFocus: true
  });

  var $goal = $('#goal').selectize({
    highlight: false,
    openOnFocus: true,
    options: goalOptions,
    items: ['portion']
  });
  var $counterpart = $('#counterpart').selectize({
    highlight: false,
    openOnFocus: true,
    options: counterpartOptions,
    items: ['kcal']
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
    var control = $counterpart[0].selectize.getValue();
    var repeats = $repeats[0].selectize.getValue() === 'yes';

    if(response === control) {
      swal({
        title: 'Oops..',
        text: 'You have to select two different nutritions!',
        type: 'warning',
        confirmButtonText: 'Alright...'
      });
      return;
    }

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

      if(control === 'portion') {
        $('#control-hd').html('Serving');
      } else {
        var controlText = MFat.shortCodes[control].name;
        $('#control-hd').html(controlText[0].toUpperCase() + _.rest(controlText).join(''));
      }
      if(response === 'portion') {
        $('#response-hd').html('Serving');
      } else {
        var responseText = MFat.shortCodes[response].name;
        $('#response-hd').html(responseText[0].toUpperCase() + _.rest(responseText).join(''));
      }

      var totalControl = _.reduce(result.collection, function(memo, menuItem){ return memo + menuItem[control]; }, 0);
      var totalResponse = _.reduce(result.collection, function(memo, menuItem){ return memo + menuItem[response]; }, 0);

      var buildColumn = function(item, key) {
        if(key !== 'portion') {
          return '<td>' + item[key] + ' ' + MFat.shortCodes[key].unit + '</td>';
        } else {
          return '<td>' + item.serving + ' (' + item.portion + ' g)</td>';
        }
      };

      var html = '';
      _.each(result.collection, function(menuItem) {
        html += '<tr>';
        html += '<td>' + menuItem.name + '</td>';
        html += buildColumn(menuItem, control);
        html += buildColumn(menuItem, response);
      });

      var buildTotalColumn = function(value, key) {
        if(key === 'portion') {
          return '<td>' + value + ' g</td>';
        } else {
          return '<td>' + value + ' ' +
                  MFat.shortCodes[key].unit
                  + '</td>';
        }
      };

      html += '<tr>';
      html += '<td>Total</td>';
      html += buildTotalColumn(totalControl, control);
      html += buildTotalColumn(totalResponse, response);
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
