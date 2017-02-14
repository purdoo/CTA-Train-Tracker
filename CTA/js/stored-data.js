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
        var savedRouteHtml = '';
        savedRouteHtml += '<div class="saved-result accord" id="saved-header-'+ s +'">' + savedRoutes[s].stopName + ' (' + savedRoutes[s].lineName + ')</div>';

        resultButtonHtml = '<button class="btn btn-primary result-button">Results</button>';
        removeButtonHtml = '<button class="btn btn-primary delete-button">Delete</button>';
        subscribeButtonHtml = '<button class="btn btn-primary subscribe-button">Subscribe</button>';
        panelOptions = '<div class="well"><div class="btn-group">' + resultButtonHtml + removeButtonHtml + subscribeButtonHtml + '</div></div>';

        savedRouteHtml += '<div class="saved-result-body" id="saved-body-'+ s +'" data-station-id="' + s + '">' + panelOptions + '</div>';
        $('#saved-results').append(savedRouteHtml);
      }
    });
  };
  // load sly widget for the train
  $(document).on('click', '.saved-result', function () {
    // close every tab to ensure the accordion effect
    for (c=0; c<$('.accord').length; c++){
      var bodyId = $('.accord')[c].id.replace('header','body');
      //console.log(bodyId);
      $("#" + bodyId).toggle(false);
    }
    var id = (this.id);
    var target = (this.id).replace('header','body');
    $('#' + target).slideToggle('fast');
  });

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
  $(document).on('click', '.result-button', function () {
    var stationId = $(this).parents().eq(2).attr('data-station-id');
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
  $(document).on('click', '.delete-button', function () {
    var stationId = $(this).parents().eq(2).attr('data-station-id')
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
