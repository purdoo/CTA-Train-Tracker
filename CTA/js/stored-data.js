document.addEventListener('DOMContentLoaded', function() {
  // on page load behavior
  chrome.storage.sync.get(['savedRoutes'], function(storedRoutes) {
    for(s in storedRoutes) {
      console.log(storedRoutes[s]);
    }
  });
  //var storedRoutesHtml = 
  
 
  
  // onclick toggles for our different forms
  $('#search-form-button').on('click', function(event) {
    $('#search-form').toggle(true);
    $('#user-form').toggle(false);
  });
  $('#save-form-button').on('click', function(event) {
    $('#search-form').toggle(false);
    $('#user-form').toggle(true);
  });
  
   // onclick for saving a station
  $('#save-button').click(function() {
    // check to see if stations select is populated

    // disable the button
    $('#save-button').prop('disabled', true);
    console.log('save button clicked');
    console.log($('#stop-select').val());

    // check to see what preferences the user already has saved
    chrome.storage.sync.get(['savedRoutes'], function(result) {
      console.log(result);
      var array = result['savedRoutes'] ? result['savedRoutes'] : [];
      array.unshift($('#stop-select').val());

      var jsonObj = {};
      jsonObj['savedRoutes'] = array;
      chrome.storage.sync.set(jsonObj, function() {
        //console.log('Settings saved');
      });
    });
    
  });

}, false); // end domcontentloaded