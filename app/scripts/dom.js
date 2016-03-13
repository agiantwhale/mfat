'use strict';

$(document).ready(function() {
  var options = {
    highlight: false,
    openOnFocus: true
  };
  $('#meal').selectize(options);
  $('#location').selectize(options);
  $('#goal').selectize(options);
});
