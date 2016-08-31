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
  });
  
  var loadUserForm = function() { 
    chrome.storage.sync.get(['savedRoutes'], function(data) {
      let savedRoutes = data['savedRoutes'];
      for(var s in savedRoutes) {
        console.log(savedRoutes[s]);
        $.ajax({
          url: 'http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx/' + '?key=' + api_key + '&mapid=' + savedRoutes[s],
          success: function (result) {
          },
          async: false
        });
      }
    }); 
  };

   // saving a station
  $('#save-button').click(function() {
    // check to see if stations select is populated

    // disable the button
    $('#save-button').prop('disabled', true);
    console.log('save button clicked');
    console.log($('#stop-select').val());

    // check to see what preferences the user already has saved
    chrome.storage.sync.get(['savedRoutes'], function(result) {
      console.log(result);
      var saved = result['savedRoutes'] ? result['savedRoutes'] : {};
      saved[$('#stop-select').val()]['stopName'] = $('#stop-select option:selected').text();
      saved[$('#stop-select').val()]['lineName'] = $('#line-select option:selected').text();
      //var array = result['savedRoutes'] ? result['savedRoutes'] : [];
      //array.unshift($('#stop-select').val());

      var jsonObj = {};
      jsonObj['savedRoutes'] = array;
      chrome.storage.sync.set(jsonObj, function() {
        console.log('Settings saved');
      });
    });
  });

  // clearing saved preferences
  $('#clear-stations').click(function() {
    // careful with this
    var jsonObj = {};
    jsonObj['savedRoutes'] = [];
    chrome.storage.sync.set(jsonObj, function() {
      console.log('Settings Cleared');
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