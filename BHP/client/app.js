function getBathValue() {
  var uiBathrooms = document.getElementsByName("uiBathrooms");
  for(var i in uiBathrooms) {
    if(uiBathrooms[i].checked) {
        return parseInt(i)+1;
    }
  }
  return -1; // Invalid Value
}

function getBHKValue() {
  var uiBHK = document.getElementsByName("uiBHK");
  for(var i in uiBHK) {
    if(uiBHK[i].checked) {
        return parseInt(i)+1;
    }
  }
  return -1; // Invalid Value
}

function onClickedEstimatePrice() {
  console.log("Estimate price button clicked");
  var sqft = document.getElementById("uiSqft");
  var bhk = getBHKValue();
  var bathrooms = getBathValue();
  var location = document.getElementById("uiLocations");
  var estPrice = document.getElementById("uiEstimatedPrice");

  // Input validation
  if (!sqft.value || isNaN(parseFloat(sqft.value))) {
    alert("Please enter a valid square footage");
    return;
  }
  if (bhk === -1) {
    alert("Please select BHK");
    return;
  }
  if (bathrooms === -1) {
    alert("Please select number of bathrooms");
    return;
  }
  if (!location.value) {
    alert("Please select a location");
    return;
  }

  var url = "http://127.0.0.1:5000/predict_home_price"; //Use this if you are NOT using nginx which is first 7 tutorials
  //var url = "/api/predict_home_price"; // Use this if  you are using nginx. i.e tutorial 8 and onwards

  console.log("Sending request with data:", {
    total_sqft: parseFloat(sqft.value),
    bhk: bhk,
    bath: bathrooms,
    location: location.value
  });

  $.ajax({
      url: url,
      type: 'POST',
      contentType: 'application/json',
      crossDomain: true,
      xhrFields: {
          withCredentials: false
      },
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      data: JSON.stringify({
          total_sqft: parseFloat(sqft.value),
          bhk: bhk,
          bath: bathrooms,
          location: location.value
      }),
      success: function(data, status) {
          console.log("Response received:", data);
          console.log("Status:", status);
          if (data && data.estimated_price !== undefined) {
              showResult(data.estimated_price.toString());
          } else {
              showResult("Error: Unable to estimate price");
          }
      },
      error: function(response) {
          console.error("Error:", response);
          estPrice.innerHTML = "<h2>Error: Unable to estimate price</h2>";
      }
  });
}

function onPageLoad() {
  console.log("document loaded");
  var url = "http://127.0.0.1:5000/get_location_names"; // Use this if you are NOT using nginx which is first 7 tutorials
  //var url = "/api/get_location_names"; // Use this if  you are using nginx. i.e tutorial 8 and onwards
  // Added error handling and debugging logs
  $.get(url,function(data, status) {
      console.log("Response status:", status);
      console.log("Response data:", data);
      if(data) {
          var locations = data.locations;
          console.log("Locations array:", locations);
          var uiLocations = document.getElementById("uiLocations");
          $('#uiLocations').empty();
          // Added default option
          $('#uiLocations').append('<option value="" disabled="disabled" selected="selected">Choose a Location</option>');
          for(var i in locations) {
              var opt = new Option(locations[i]);
              $('#uiLocations').append(opt);
          }
      }
  }).fail(function(error) {
      console.error("Failed to fetch locations:", error);
  });
}

window.onload = onPageLoad;