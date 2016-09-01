document.addEventListener('DOMContentLoaded', function() {
  var api_key = '4ffee39f79e54e19b75756aded7cb3d3';
  // on page load behavior
  /*
  chrome.storage.sync.get(['savedRoutes'], function(data) {
    console.log('saved routes:');
    console.log(data['savedRoutes']);
    
  });*/
  //var storedRoutesHtml = 
  
  
  
  // onclick toggles for our different forms
  $('#search-form-button').on('click', function(event) {
    $('#search-form').toggle(true);
    $('#user-form').toggle(false);
  });
  $('#user-form-button').on('click', function(event) {
    $('#search-form').toggle(false);
    $('#user-form').toggle(true);
    console.log('loading save form');
    loadUserForm();
    $('#save-button').prop('disabled', false);
  });
  
  // runs every time the user preferences page is loaded/opened
  var loadUserForm = function() {
    $('#saved-results').html('');
    chrome.storage.sync.get(['savedRoutes'], function(data) {
      let savedRoutes = data['savedRoutes'];
      for(var s in savedRoutes) {
        var savedRouteHtml = '';
        savedRouteHtml += '<div class="saved-result">' + savedRoutes[s].stopName + ' (' + savedRoutes[s].lineName + ')</div>';
        $('#saved-results').append(savedRouteHtml);
      }
    }); 
  };

   // saving a station
  $('#save-button').click(function() {
    // check to see if stations select is populated
    if($('#line-select').val() != '-') {
      // disable the button
      $('#save-button').prop('disabled', true);

      // check to see what preferences the user already has saved
      chrome.storage.sync.get(['savedRoutes'], function(result) {
        console.log(result);
        var saved = result['savedRoutes'] ? result['savedRoutes'] : {};
        console.log(saved);
        var savedObject = {
          stopName : $('#stop-select option:selected').text(),
          lineName : $('#line-select option:selected').text()
        }
        let stopId = String($('#stop-select').val());
        saved[stopId] = savedObject;

        var jsonObj = {};
        jsonObj['savedRoutes'] = saved;
        chrome.storage.sync.set(jsonObj, function() {
          console.log('Settings saved');
        });
      });
    }
    
  });

  // clearing saved preferences
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
    chrome.storage.sync.get(['savedRoutes'], function(data) {
      let savedRoutes = data['savedRoutes'];
      console.log(savedRoutes);
    });
  });

}, false); // end domcontentloaded