document.addEventListener('DOMContentLoaded', function() {
  console.log('loaded');
  var api_key = '4ffee39f79e54e19b75756aded7cb3d3';
  var arrivals_base_url = 'http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx/';
  var test_station_id = '30062';
  $('#connect').click(function() {
    console.log('clicked');
    var request_url = arrivals_base_url + '?key=' + api_key;
    request_url += '&stpid=' + test_station_id;
    console.log(request_url);

  });

}, false);
