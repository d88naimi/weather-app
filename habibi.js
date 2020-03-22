/*create a search form 
create test front end layout aside section buttons
get user input into a var
pass user var into a ajax call query param
store response var into data
create a test array of cities
create a div buttons-container holding buttons 
add class/styles to buttons
dynamically append new test search array buttons to div container 
*/
var cities = ["San Diego", "Denver", "Chicago", "Los Angeles"];
var APIKey = "0135436f9b0a2a527dda0e58086c09ef";

function displayCityInfo() {
  var selectedBut = $(this).attr("data-city");
  // Here we are building the URL we need to query the database
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?" +
    "q=" +
    selectedBut +
    "&appid=" +
    APIKey;

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    // Printing the entire object to console
    console.log(response);
    // currentWeatherResponse
    $("#today").empty();
    var tempF = (response.main.temp - 273.15) * 1.8 + 32;
    var cwr = {
      cityName: response.name,
      time: response.dt,
      icon: response.weather[0].icon,
      humidity: response.main.humidity,
      wind: response.wind.speed,
      lat: response.coord.lat,
      lon: response.coord.lon
    };

    var html = `
    <div class="border p-3 " > 
      <h1>${cwr.cityName}(${humanDateFormat(
      cwr.time
    )})</h1><img src="http://openweathermap.org/img/w/${
      cwr.icon
    }.png" alt="Weather Icon">
      <h3>${tempF.toFixed(2)}°F</h3>
      <h3>Humidity: ${cwr.humidity}%</h3>
      <h3>${cwr.wind} <i class="fa fa-spinner fa-spin"></i> Wind</h3>
      <p class="uv"></p>
    </div>
    `;

    $("#today").append(html);
    displayUVInfo(cwr.lat, cwr.lon);
    displayForecast(selectedBut, cwr.icon);
  });
}

function displayUVInfo(lat, lon) {
  // console.log(lat, lon);
  // Here we are building the URL we need to query the database
  var queryURL =
    "http://api.openweathermap.org/data/2.5/uvi?appid=" +
    APIKey +
    "&lat=" +
    lat +
    "&lon=" +
    lon;
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    // Printing the entire object to console
    // console.log(response.value);
    var bgColor;
    if (response.value < 3) {
      bgColor = "success";
    } else if (response.value < 7) {
      bgColor = "warning";
    } else {
      bgColor = "danger";
    }
    var index = `
    <button type="button" class="btn btn-${bgColor}"> UV Index : ${response.value}</button>

    `;
    $(".uv").append(index);
  });
}
displayUVInfo();

function displayForecast(city, icon) {
  console.log(city);
  $("#forecast").empty();

  var queryURL =
    "https://api.openweathermap.org/data/2.5/forecast?" +
    "q=" +
    city +
    "&appid=" +
    APIKey +
    "&units=imperial";

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    // Printing the entire object to console
    // console.log(response);
    const forecastDay = response.list;
    //each day loop will need and individual card create for 5 days
    const every_nth = (arr, nth) => arr.filter((e, i) => i % nth === nth - 1);
    const fiveDay = every_nth(forecastDay, 8);
    console.log(fiveDay);

    var home = `
        <div class="container-fluid p-4">
        <h1>5 Day Forecast: </h1>
          <div class="row forecastHome">
          </div>
        </div>
    `;
    $('#forecast').append(home);
    for (var i = 0; i < fiveDay.length; i++) {
      var forecastInfo = `
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h3 class="card-text">Date: ${humanDateFormat(fiveDay[i].dt)}</h3>
            <img src="http://openweathermap.org/img/w/${
              fiveDay[i].weather[0].icon
            }.png" alt="Weather Icon">
            <p class="card-text">Temp: ${fiveDay[i].main.temp}</p>
            <p class="card-text">Humidity: ${fiveDay[i].main.humidity} % </p>
            </div>
          </div>
        </div>
      `;
      $(".forecastHome").append(forecastInfo);
    }
  });
}
displayForecast();


function renderButtons() {
  $(".list-group").empty();

  $.each(cities, function(i, city) {
    // Then dynamicaly generating buttons for each movie in the array.
    // This code $("<button>") is all jQuery needs to create the start and end tag. (<button></button>)
    var butLi = $("<ul>");

    var buttonFly = $("<button>");
    // Adding a class
    buttonFly.addClass("city btn btn-primary mt-1");
    // Adding a data-attribute with a value of the movie at index i
    buttonFly.attr("data-city", city);
    // Providing the button's text with a value of the movie at index i
    buttonFly.text(city);
    // Adding the button to the HTML
    butLi.append(buttonFly);
    $(".list-group").prepend(butLi);
  });
}

$("#search-button").on("click", function(event) {
  // Preventing the button from trying to submit the form
  event.preventDefault();
  // Storing the artist name
  var inputCity = $("#search-value")
    .val()
    .trim();

  cities.push(inputCity);
  // Running the searchBandsInTown function(passing in the artist as an argument)
  renderButtons();
});

$(document).on("click", ".btn-primary", displayCityInfo);
renderButtons();

function humanDateFormat(unix) {
  const milliseconds = unix * 1000;
  const dateObject = new Date(milliseconds);
  return dateObject.toLocaleString(); //2019-12-9 10:30:15
}
