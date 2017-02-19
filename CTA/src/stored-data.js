document.addEventListener('DOMContentLoaded', function() {
  var api_key = '4ffee39f79e54e19b75756aded7cb3d3';
  var arrivals_base_url = 'http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx/';

  // onclick toggles for our different forms
  $('#search-form-button').on('click', function(event) {
    $('#search-form').toggle(true);
    $('#user-form').toggle(false);
    $('#search-form-button').addClass('active');
    $('#user-form-button').removeClass('active');
  });
  $('#user-form-button').on('click', function(event) {
    $('#search-form').toggle(false);
    $('#user-form').toggle(true);
    loadUserForm();
    $('#save-button').prop('disabled', false);
    $('#user-form-button').addClass('active');
    $('#search-form-button').removeClass('active');
  });

  // runs every time the user preferences page is loaded/opened
  var loadUserForm = function() {
    $('#saved-results').html('');
    chrome.storage.sync.get(['savedRoutes'], function(data) {
      let savedRoutes = data['savedRoutes'];
      for(var s in savedRoutes) {
        var iconHtml = '<span class="pull-right clickable"><i class="glyphicon glyphicon-remove"></i></span>';
        var savedRouteHtml = '<div><button class="btn btn-default saved-result form-control" data-station-id="' + s + '">' + savedRoutes[s].stopName + ' (' + savedRoutes[s].lineName + ') ' + iconHtml + '</button></div>';
        $('#saved-results').append(savedRouteHtml);
      }
    });
  };

   // saving a station
  $('#save-button').click(function() {
    // check to see if stations select is populated
    if($('#line-select').val() != '-') {
      // disable the button
      // $('#save-button').prop('disabled', true);
      // check to see what preferences the user already has saved
      chrome.storage.sync.get(['savedRoutes'], function(result) {
        var saved = result['savedRoutes'] ? result['savedRoutes'] : {};
        var savedObject = {
          stopName : $('#stop-select option:selected').text(),
          lineName : $('#line-select option:selected').text()
        }
        let stopId = String($('#stop-select').val());
        saved[stopId] = savedObject;

        chrome.storage.sync.set({'savedRoutes':saved}, function() {
          console.log('Settings saved');
        });
      });
    }
  });

  /* Checking live results for a saved station */
  $(document).on('click', '.saved-result', function () {
    // var stationId = $(this).parents().eq(2).attr('data-station-id');
    var stationId = $(this).attr('data-station-id');
    console.log(stationId);
    $('#search-form').toggle(true);
    $('#user-form').toggle(false);
    $('#search-form-button').addClass('active');
    $('#user-form-button').removeClass('active');
    var request_url = arrivals_base_url + '?key=' + api_key;
    request_url += '&mapid=' + stationId;
    // var resultHeader = 'Arrivals at ' + $('#stop-select option:selected').text();
    $.get(request_url, {
    }).done( function (xml) {
      // var resultsHtml = '<h4>' + resultHeader + '</h4><hr>';
      var resultsHtml = '<br>';
      resultsHtml += renderArrivalResults(xml);
      $('#results').html(resultsHtml + '<br>');
    });
  });


  /* Delete an Individual Station */
  $(document).on('click', 'span.clickable', function (e) {
    var stationId = $(this).parents().eq(0).attr('data-station-id');
    chrome.storage.sync.get(['savedRoutes'], function(data) {
      var newRoutes = data['savedRoutes'];
      delete newRoutes[stationId];
      chrome.storage.sync.set({'savedRoutes':newRoutes}, function() {
        loadUserForm();
      });
    });
  });

  /* Subscribe to an Individual Station */
  $(document).on('click', '.subscribe-button', function () {
    console.log($(this).parents().eq(2).attr('data-station-id'));
  });


  /* clearing saved preferences */
  $('#clear-stations').click(function() {
    // careful with this
    var jsonObj = {};
    jsonObj['savedRoutes'] = {};
    chrome.storage.sync.set(jsonObj, function() {
      console.log('Settings Cleared');
      loadUserForm();
    });
  });

  // clearing saved preferences (dev)
  $('#check-stations').click(function() {
    chrome.storage.sync.get(['savedRoutes','apiKey'], function(data) {
      console.log(data);
    });
  });

}, false); // end domcontentloaded
