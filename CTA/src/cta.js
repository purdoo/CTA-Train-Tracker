document.addEventListener('DOMContentLoaded', function() {
  var api_key = '4ffee39f79e54e19b75756aded7cb3d3';
  var arrivals_base_url = 'http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx/';

  initLineSelector();
  var stops = loadStops();

  $('#line-select').on('change', function() {
    var lineStops = getStopsByLine($(this).val(), stops);
    lineStops.sort(function(a,b) { return a.stop_name.localeCompare(b.stop_name)});
    // lineStops.sort(function(a,b) { return a.stop_id.localeCompare(b.stop_id)});
    renderStopSelect(lineStops);
  });

  function renderStopSelect(lineStops) {
    // Wipe out previous results
    $('#stop-select').find('option').remove().end();
    parentIds = [];
    lineStops.forEach(function(stop) {
      if(!parentIds.includes(stop.map_id)) {
        parentIds.push(stop.map_id);
        $('<option value="'+ stop.map_id + '">'+ stop.station_name + '</option>').appendTo('#stop-select');
      }
    });
  }

  /* 'submit' function */
  $('#get-arrivals').click(function() {
    var request_url = arrivals_base_url + '?key=' + api_key;
    //request_url += '&stpid=' + $('#stop-select').val(); // using stop id
    request_url += '&mapid=' + $('#stop-select').val(); // using parent stop id instead
    // build out the results header
    var resultHeader = 'Arrivals at ' + $('#stop-select option:selected').text();
    $.get(request_url, {
      // wait for the callback
    }).done( function (xml) {
      var resultsHtml = '<h4>' + resultHeader + '</h4><hr>';
      resultsHtml += renderArrivalResults(xml);
      $('#results').html(resultsHtml + '<br>');
      // $('#results').accordion();
    });
  });

  /* Toggle Result Divs */
  $(document).on('click', '.result-header', function () {
    var id = (this.id);
    var target = (this.id).replace('header','body');
    $('#' + target).slideToggle('fast');
  });
}, false); // dom load

function renderArrivalResults(xml) {
  resultsHtml = '';
  $(xml).find('eta').each(function() {
    var train = $(this);
    var trainHtml = '';
    // run (used for matching message headers and bodies)
    var run = train.find('rn').text();
    // train end station
    var destination = train.find('destNm').text();
    // time until train will get to station
    var timeOut = getTimeOut((train.find('arrT').text()).split(' ')[1]);
    // arrival time (formatted)
    var arrivalTime = formatTime((train.find('arrT').text()).split(' ')[1]);
    // stop detail
    var detail = train.find('stpDe').text();
    // route
    var route = train.find('rt').text();
    // various flags
    var isApproaching = train.find('isApp').text();
    var isSchedule = train.find('isSch').text();
    var isDelayed = train.find('isDly').text();
    var isFaulty = train.find('isFlt').text();
    // building result header
    if(isApproaching == '1') {
      timeOut = 'Due';
    }
    var headerText =  destination + ' - ' + timeOut;

    // trainHtml += '<div class="result ' + route + '">'
    trainHtml += '<h5 class="result-header ' + route + '" id="header-' + run + '">' + headerText + '</h5>';

    // building result body
    var descriptionHtml = '<div class="arrival-desc">' + detail + '</div>';
    var routeHtml = '<div class="route-text">' + route + ' Line</div>'; // not currently used
    var arrivalHtml = '<div class="arrival-time">Arriving at ' + arrivalTime + '</div>';
    var scheduledNote = '';
    if(isSchedule == 1) {
      scheduledNote = '<div class="notice">* Live Data Not Available, Using Scheduled Times</div>'
    }
    trainHtml += '<div class="result-body" id="body-' + run + '">' + descriptionHtml + arrivalHtml + scheduledNote + '</div>';
    trainHtml += '</div>';
    resultsHtml += trainHtml;
  });

  return resultsHtml;
}

function getTimeOut(arrivalTime) {
  var split = arrivalTime.split(':');
  var arrivalMinutes = (parseInt(split[0]) * 60) + parseInt(split[1]);
  var d = new Date();
  var currentMinutes = (d.getHours()) * 60 + d.getMinutes();
  var timeOutText = (arrivalMinutes - currentMinutes) + ' minute';
  if((arrivalMinutes - currentMinutes) > 1) {
    timeOutText += 's'
  }
  return timeOutText;
}
