document.addEventListener('DOMContentLoaded', function() {
  console.log('saved-data.js loaded');
  $('#search-button').on('click', function(event) {
    $('#search-form').toggle(true);
    $('#saved-form').toggle(false);
    initLineSelector();
  });
  $('#saved-button').on('click', function(event) {
    $('#search-form').toggle(false);
    $('#saved-form').toggle(true);
    initLineSelector();
  });
}, false);