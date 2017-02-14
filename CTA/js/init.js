document.addEventListener('DOMContentLoaded', function() {
  stop_data_url = 'https://data.cityofchicago.org/api/views/8pix-ypme/rows.xml?accessType=DOWNLOAD';
  chrome.storage.sync.set({'apiKey':'4ffee39f79e54e19b75756aded7cb3d3'}, function() {
    console.log('stored api key in chrome storage');
  });
}, false); // dom load

/* Hard-coded values for the line select */
function initLineSelector(target = 'line-select') {
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
    $('<option value="'+ lines[line] + '">'+ line + '</option>').appendTo('#' + target);
  }
}

/* Loads all stops and stores their information in a data structure */
function loadStops() {
  var stops = [];
  $.get(stop_data_url, {
    // wait for the callback
  }).done( function (xml) {
    $(xml).find('row').each(function(index, value) {

      // skip the first row
      if(index == 0) return;

      var stop = {};
      stop.stop_id = $(this).find('stop_id').text();
      stop.stop_name = $(this).find('stop_name').text();
      stop.station_name = $(this).find('station_name').text();
      stop.station_desc_name = $(this).find('station_descriptive_name').text();
      stop.map_id = $(this).find('map_id').text();
      stop.ada = $(this).find('ada').text();
      stop.red = $(this).find('red').text();
      stop.blue = $(this).find('blue').text();
      stop.g = $(this).find('g').text();
      stop.brn = $(this).find('brn').text();
      stop.p = $(this).find('p').text();
      stop.y = $(this).find('y').text();
      stop.pnk = $(this).find('pnk').text();
      stop.o = $(this).find('o').text();
      stops.push(stop);
    });
  });
  return stops;
}

/* Returns stops that belong to a specified line */
function getStopsByLine(lineId, stops) {
  lineStops = [];
  /* Faster than a forEach loop at the slight expense of readability */
  for (var i = 0; i < stops.length; i ++) {
    if(stops[i][lineId.toLowerCase()] == 'true') lineStops.push(stops[i]);
  }
  return lineStops;
}

/* Format a 24h time string (hh:mm:ss) to a 12h AM/PM string */
function formatTime(timeString) {
  var split = timeString.split(':');
  var hours = split[0];
  var minutes = split[1];
  var ap;
  if(hours >= 24) {
    ap = 'AM';
    formattedHours = hours - 24;
  }
  else if(hours >= 12) {
    ap = 'PM';
    formattedHours = hours - 12;
  }
  else {
    ap = 'AM';
    formattedHours = hours;
  }
  if(formattedHours == 0) {
    formattedHours = 12;
  }
  formattedMinutes = ('0' + minutes).substr(-2);
  return formattedHours + ':' + formattedMinutes + ' ' + ap;
}

function processHeader(header, lineId) {
  return header.indexOf(lineId);
}
