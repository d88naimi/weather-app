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
var cities = ["San Diego", "Denver", "chicago", "los angeles"];

function displayCityInfo() {
  var selectedBut = $(this).attr("data-city");
  
  var APIKey = "0135436f9b0a2a527dda0e58086c09ef";
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
    var currentWeatherResponse ={
      cityName: response.name,
    }
  });
}

function renderButtons() {
  $(".list-group").empty();
  $.each(cities, function(i, city) {
    // Then dynamicaly generating buttons for each movie in the array.
    // This code $("<button>") is all jQuery needs to create the start and end tag. (<button></button>)
    var butLi = $("<li>");

    var buttonFly = $("<button>");
    // Adding a class
    buttonFly.addClass("city btn btn-primary mt-1");
    // Adding a data-attribute with a value of the movie at index i
    buttonFly.attr("data-city", city);
    // Providing the button's text with a value of the movie at index i
    buttonFly.text(city);
    // Adding the button to the HTML
    butLi.append(buttonFly);
    $(".list-group").append(butLi);
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