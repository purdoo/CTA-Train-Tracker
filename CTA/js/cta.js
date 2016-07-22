document.addEventListener('DOMContentLoaded', function() {
  console.log('loaded');
  var api_key = '4ffee39f79e54e19b75756aded7cb3d3';
  var arrivals_base_url = 'http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx/';
  var test_station_id = '30062';
  $('#connect').click(function() {
    var request_url = arrivals_base_url + '?key=' + api_key;
    request_url += '&stpid=' + test_station_id;
    console.log(request_url);
    
    $.get(request_url, {
    }).done( function (xml) {
      console.log(xml);
      $(xml).find('eta').each(function() {
        var train = $(this);
        console.log(train);
        console.log(train.find('prdt').text());
      });
    });
  });

}, false);

/*
function connect(url) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      // innerText does not let the attacker inject HTML elements.
      var response = xhr.responseXML;
      
    }
  }
  xhr.send();
}*/