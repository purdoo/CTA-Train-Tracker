document.addEventListener('DOMContentLoaded', function() {
  console.log('loaded');
  initLineSelector();

  var api_key = '4ffee39f79e54e19b75756aded7cb3d3';
  var arrivals_base_url = 'http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx/';
  var test_station_id = '30062';
  $('#connect').click(function() {
    var request_url = arrivals_base_url + '?key=' + api_key;
    request_url += '&stpid=' + test_station_id;
    console.log(request_url);
    
    $.get(request_url, {
    }).done( function (xml) {
      var resultsHtml = '';
      $(xml).find('eta').each(function() {
        var train = $(this);
        var trainHtml = '';
        trainHtml += '<div class=result>' + train.find('prdt').text() + '</div>';
        trainHtml += '<hr>';
        console.log(train);
        resultsHtml += trainHtml;
      });
      $('#results').html(resultsHtml);
    });
  });

  $('#line-select').on('change', function() {
    console.log($(this).val());
    initStopSelector($(this).val());
  });

}, false);

function initLineSelector() {
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
    $('<option value="'+ lines[line] + '">'+ line + '</option>').appendTo('#line-select');
  }
}

function initStopSelector(lineId) {
  $('#stop-select').find('option').remove().end();
  var rawFile = new XMLHttpRequest();
  rawFile.open('GET', 'files/stops.csv', false);
  rawFile.onreadystatechange = function ()
  {
    if(rawFile.readyState === 4)
    {
      if(rawFile.status === 200 || rawFile.status == 0)
      {
        console.log(lineId);
        var allText = rawFile.responseText;
        var csvResults = CSVToArray(allText, ',')
        var stopIndex = processHeader(csvResults[0], lineId);
        var csvResults = csvResults.slice(1);
        console.log(stopIndex);
        console.log(csvResults);
        for(var x in csvResults) {
          if(csvResults.hasOwnProperty(x)) {
            if(csvResults[x][stopIndex] == 'TRUE') {
              $('<option value="'+ csvResults[x][0] + '">'+ csvResults[x][2] + '</option>').appendTo('#stop-select');
            }
          }
        }
      }
    }
  }
  rawFile.send(null);

}

function processHeader(header, lineId) {
  console.log(header);
  return header.indexOf(lineId);
}

function CSVToArray( strData, strDelimiter ) {
  // Check to see if the delimiter is defined. If not,
  // then default to comma.
  strDelimiter = (strDelimiter || ",");
  // Create a regular expression to parse the CSV values.
  var objPattern = new RegExp(
    (
      // Delimiters.
      "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
      // Quoted fields.
      "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
      // Standard fields.
      "([^\"\\" + strDelimiter + "\\r\\n]*))"
    ),
    "gi"
    );
  // Create an array to hold our data. Give the array
  // a default empty first row.
  var arrData = [[]];
  // Create an array to hold our individual pattern
  // matching groups.
  var arrMatches = null;
  // Keep looping over the regular expression matches
  // until we can no longer find a match.
  while (arrMatches = objPattern.exec( strData )){
      // Get the delimiter that was found.
      var strMatchedDelimiter = arrMatches[ 1 ];
      // Check to see if the given delimiter has a length
      // (is not the start of string) and if it matches
      // field delimiter. If id does not, then we know
      // that this delimiter is a row delimiter.
      if (
          strMatchedDelimiter.length &&
          (strMatchedDelimiter != strDelimiter)
          ){
          // Since we have reached a new row of data,
          // add an empty row to our data array.
          arrData.push( [] );
      }
      // Now that we have our delimiter out of the way,
      // let's check to see which kind of value we
      // captured (quoted or unquoted).
      if (arrMatches[ 2 ]){
          // We found a quoted value. When we capture
          // this value, unescape any double quotes.
          var strMatchedValue = arrMatches[ 2 ].replace(
              new RegExp( "\"\"", "g" ),
              "\""
              );
      } else {
          // We found a non-quoted value.
          var strMatchedValue = arrMatches[ 3 ];
      }
      // Now that we have our value string, let's add
      // it to the data array.
      arrData[ arrData.length - 1 ].push( strMatchedValue );
  }
  // Return the parsed data.
  return( arrData );
}
