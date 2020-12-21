// Variable for Date
var d = new Date();
var month = d.getMonth() + 1;
var day = d.getDate();
var year = d.getFullYear();
var today = month + "-" + day + "-" + year;

var searchButton = $("#search-button");
var searchInput = $("#search-input");
var cityName = "";
var pastSearches = JSON.parse(localStorage.getItem("City"));

function searchHistory() {
    var savedCities = $("#saved-cities");
      var trEl = $("<tr>");
      var thEl = $("<th>");
      console.log(localStorage.getItem("City"));
      thEl.text(cityName).attr("scope", "row");
      trEl.append(thEl);
      savedCities.append(trEl);
};

$(document).ready(function () {
  console.log(pastSearches);

  if (pastSearches !== null) {
    var pastSearches = JSON.parse(localStorage.getItem("City"));
    searchHistory();


    for (i = 0; i < pastSearches.length; i++) {
      var savedCities = $("#saved-cities");
      var trEl = $("<tr>");
      var thEl = $("<th>");
      console.log(localStorage.getItem("City"));
      thEl.text(pastSearches[i]).attr("scope", "row");
      trEl.append(thEl);
      savedCities.append(trEl);
    }
  };


  searchButton.on("click", function () {
    event.preventDefault();
    cityName = searchInput.val();
    pastSearches.push(cityName);
    var toRemove = $("#forecast-area");
    toRemove.empty();

    localStorage.setItem("City", JSON.stringify(pastSearches));

    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityName +
      "&units=imperial&appid=0d2df46fe7ac45114da1797fcf89227a";

    // AJAX call for current weather
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {

      var cityName = $("#current-city");
      var cityLatitude = response.coord.lat;
      var cityLongitude = response.coord.lon;
      var currentTemp = $("#current-temp");
      var currentHumidity = $("#current-humidity");
      var currentWind = $("#current-wind");
      var currentUV = $("#current-UV");
      var iconCode = response.weather[0].icon;
      var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";

      cityName.text(response.name + " " + today);
      currentTemp.text("Temperature: " + response.main.temp + "º");
      currentHumidity.text("Humidity: " + response.main.humidity + "%");
      currentWind.text("Wind Speed: " + response.wind.speed + " MPH");
      currentUV.text("WILL FIX THIS SHIT LATER");

      var cityIcon = $("<img>");
      cityIcon.attr("src", iconURL);
      cityName.append(cityIcon);

      var UVqueryURL =
        "http://api.openweathermap.org/data/2.5/uvi?lat=" +
        cityLatitude +
        "&lon=" +
        cityLongitude +
        "&appid=0d2df46fe7ac45114da1797fcf89227a";
      $.ajax({
        url: UVqueryURL,
        method: "GET",
      }).then(function (response) {
        currentUV.text("UV Index: " + response.value);
      });
    });

    // AJAX call for forecast weather
    var forecastQueryURL =
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      cityName +
      "&units=imperial&appid=0d2df46fe7ac45114da1797fcf89227a";

    $.ajax({
      url: forecastQueryURL,
      method: "GET",
    }).then(function (response) {
      for (i = 0; i < 5; i++) {
        var forecastArea = $("#forecast-area");
        var h3El = $("<h3>");
        var pEl = $("<p>");
        var forecastIcon = $("<img>");
        var iconCode = response.list[i * 8 + 5].weather[0].icon;
        var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
        h3El
          .text(month + "/" + (day + (i + 1)) + "/" + year)
          .addClass("col-2 img-thumbnail");
        forecastIcon.attr("src", iconURL).addClass("forecast-icon");
        h3El.append(forecastIcon);
        pEl
          .text(
            "Temp: " +
              response.list[i + 5].main.temp +
              "ºF\nHumidity :" +
              response.list[i + 5].main.humidity +
              "%"
          )
          .addClass("forecast")
          .attr("bubble");
        h3El.append(pEl);
        forecastArea.append(h3El);
      }
      searchHistory();

    });
  });
});
