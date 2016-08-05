document.addEventListener('DOMContentLoaded', function() {
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
        console.log('Settings saved');
      });
    });
    /*
    chrome.storage.sync.set({'value': theValue}, function() {
      // Notify that we saved.
      console.log('Settings saved');
    });*/
  });

}, false); // end domcontentloaded