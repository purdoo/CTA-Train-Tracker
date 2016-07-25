document.addEventListener('DOMContentLoaded', function() {
  console.log('loaded');
  initLineSelector();
  var api_key = '4ffee39f79e54e19b75756aded7cb3d3';
  var arrivals_base_url = 'http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx/';
  var test_station_id = '30062';
  $('#connect').click(function() {
    var request_url = arrivals_base_url + '?key=' + api_key;
    request_url += '&stpid=' + test_station_id;
    console.log(request_url);
    
    $.get(request_url, {
    }).done( function (xml) {
      var resultsHtml = '';
      $(xml).find('eta').each(function() {
        var train = $(this);
        var trainHtml = '';
        trainHtml += '<div class=result>' + train.find('prdt').text() + '</div>';
        trainHtml += '<hr>';
        console.log(train);
        resultsHtml += trainHtml;
      });
      $('#results').html(resultsHtml);
    });
  });

  $('#line-select').on('change', function() {
    console.log($(this).val());
  });

}, false);

function initLineSelector() {
  var lines = {
    "Select a Line":"-",
    "Red Line":"RED",
    "Blue Line":"BLUE",
    "Green Line":"G",
    "Brown Line":"BRN",
    "Purple Line (Non Express)":"P",
    "Yellow Line":"Y",
    "Pink Line (Non Express)":"Pnk",
    "Orange Line":"O"
  };
  for(var line in lines) {
    $('<option value="'+ lines[line] + '">'+ line + '</option>').appendTo('#line-select');
  }
}

