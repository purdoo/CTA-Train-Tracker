document.addEventListener('DOMContentLoaded', function() {
  console.log('saved-data.js loaded');
  $('#search-button').on('click', function(event) {
    $('#search-form').toggle(true);
    $('#saved-form').toggle(false);
    initLineSelector('line-select-save');
  });
  $('#saved-button').on('click', function(event) {
    $('#search-form').toggle(false);
    $('#saved-form').toggle(true);
    initLineSelector('line-select-save');
  });

  var parentMapping = [];
  $('#line-select-save').on('change', function() {
    mapping = initStopSelector($(this).val());
  });

  /* Parses a csv file to populate the stop selector based on the active option in the line selector */
  function initStopSelector(lineId) {
    $('#stop-select-save').find('option').remove().end();
    var rawFile = new XMLHttpRequest();
    rawFile.open('GET', 'files/stops.csv', false);
    rawFile.onreadystatechange = function () {
      if(rawFile.readyState === 4) {
        if(rawFile.status === 200 || rawFile.status == 0) {
          console.log(lineId);
          var allText = rawFile.responseText;
          var csvResults = CSVToArray(allText, ',')
          var stopIndex = processHeader(csvResults[0], lineId);
          var csvResults = csvResults.slice(1);
          for(var x in csvResults) {
            if(csvResults.hasOwnProperty(x)) {
              if(csvResults[x][stopIndex] == 'TRUE') {
                var mapId = csvResults[x][5];
                if(mapId in parentMapping) {
                  parentMapping[mapId].push(csvResults[x][0]);
                  $('<option value="'+ mapId + '">'+ csvResults[x][3] + '</option>').appendTo('#stop-select-save');
                }
                else {
                  parentMapping[mapId] = [csvResults[x][0]];
                }
              }
            }
          }
        }
      }
    } // end asynch function
    rawFile.send(null);
  }

}, false); // end domcontentloaded