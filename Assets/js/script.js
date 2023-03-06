var APIKey = "9083443274c27542ddc7e8c2a820d282";
var countryCode = "840";

$(function () {
  loadCityHistory();
  formSubmitHandler();
  removeStylingIfEmpty();
});

// Save city name from search and pass to getCoordinate function
function formSubmitHandler() {
  $(".btn").click(function (event) {
    event.preventDefault();

    var cityName = $("#city-name").get(0).value.trim();
    if (cityName === "") {
      return;
    }
    getCoordinates(cityName);
  });
}

function updateSearchHistory(cityHistory) {
  saveCityToHistory(cityHistory);
  loadCityHistory();
}


function saveCityToHistory(city) {
  // Get city list from local storage
  var cityHistory = JSON.parse(localStorage.getItem("cityhistory")) ?? [];

  // If city already in history list, then remove it 
  var cityIndex = cityHistory.indexOf(city);
  if (cityIndex !== -1) {
    cityHistory.splice(cityIndex, 1);
  }

  // Add last searched city to the top of the list
  cityHistory.unshift(city);

  // Remove any cities that go over city history limit
  if (cityHistory.length > 10) {
    cityHistory = cityHistory.slice(0, 10);
  }

  // Save to local storage
  localStorage.setItem("cityhistory", JSON.stringify(cityHistory));
}

function loadCityHistory() {
  // Get city list from local storage
  var cityHistory = JSON.parse(localStorage.getItem("cityhistory")) ?? [];

  // Remove all previous buttons in history
  $(".city-history").text("");

  // Loop over cities, create button with city and append to div with city-history class
  for (var i = 0; i < cityHistory.length; i++) {
    
    var newButton = $("<button type='button'></button>");
    newButton.addClass("btn btn-dark m-1");
    newButton.text(cityHistory[i]);
    
    newButton.click(function () {
      getCoordinates($(this).text());
    });

    $(".city-history").append(newButton);
  }
}

// Gets latitude and longitude using city name and country code. Updates city name and date for current city container that displays current weather 
function getCoordinates(cityName) {
  var apiUrl =
    "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "," + countryCode + "&limit=1&appid=" + APIKey;

  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var lat = data[0].lat;
      var lon = data[0].lon;
      getCurrentWeather(lat, lon);
      getFiveDayForecast(lat, lon);
      var today = dayjs().format("MM/DD/YY");
      console.log("today", today)
      var location = data[0].state ?? data[0].country;
      $("#current-weather-city").text(
        data[0].name + ", " + location + " (" + today + ")"
      );
      $("#current-city-container").addClass("border border-dark");
      var cityHistory = data[0].name;
      updateSearchHistory(cityHistory);
    });
}

// Saves temp, wind, humidity, and the icon for the current city weather
function getCurrentWeather(lat, lon) {
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + APIKey;

  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var temp = data.main.temp;
      var wind = data.wind.speed;
      var humidity = data.main.humidity;
      var iconcode = data.weather[0].icon;
      var icon = "http://openweathermap.org/img/w/" + iconcode + ".png";
      updateCurrentWeatherContainer(icon, temp, wind, humidity);
    });
}

// Updates temp, wind, humidity, and the icon for the current city container
function updateCurrentWeatherContainer(icon, temp, wind, humidity) {
  $("#icon").attr("src", icon);
  $("#temp").text("Temp: " + temp + "°F");
  $("#wind").text("Wind: " + wind + " MPH");
  $("#humidity").text("Humidity: " + humidity + " %");
}

// Saves five day forecast for the city using the latitude and longitude
function getFiveDayForecast(lat, lon) {
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + APIKey;

  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
     console.log(data);
      for (var i = 1; i <= 5; i++) {
        var dayForecast = getDayForecast(i, data);
        var date = dayjs.unix(dayForecast.dt).format("MM/DD/YY");
        console.log("date", date);
        var temp = dayForecast.main.temp;
        var wind = dayForecast.wind.speed;
        var humidity = dayForecast.main.humidity;
        var iconcode = dayForecast.weather[0].icon;
        var icon = "https://openweathermap.org/img/w/" + iconcode + ".png";
        updateForecastWeatherContainer(i, date, icon, temp, wind, humidity);
      }
    });
}

// Returns the weather data for each forecast day
function getDayForecast(days, data) {
  var targetDateObject = dayjs().hour(12).minute(0).second(0).millisecond(0).add(days, "day");
console.log('target', targetDateObject)
  for (var i = 0; i < data.list.length; i++) {
    var forecastDateObject = dayjs.unix(data.list[i].dt);
    
    if (forecastDateObject >= targetDateObject) {
      return data.list[i];
    }
  }
}

// Displays five day forecast for the city
function updateForecastWeatherContainer(id, date, icon, temp, wind, humidity) {
  $("#day" + id + " .day").text(date);
  $("#day" + id + " .icon").attr("src", icon);
  $("#day" + id + " .temp").text("Temp: " + temp + "°F");
  $("#day" + id + " .wind").text("Wind: " + wind + " MPH");
  $("#day" + id + " .humidity").text("Humidity: " + humidity + " %");
  $("#day1").addClass("text-white bg-dark");
  $("#day2").addClass("text-white bg-dark");
  $("#day3").addClass("text-white bg-dark");
  $("#day4").addClass("text-white bg-dark");
  $("#day5").addClass("text-white bg-dark");
}

// Removes styling if no city is selected
function removeStylingIfEmpty() {
  var currentWeatherCity = $("#current-weather-city");
  if (currentWeatherCity.is(":empty")) {
    $("#current-city-container").removeClass("border border-dark");
    $("#day1").removeClass("text-white bg-dark");
    $("#day2").removeClass("text-white bg-dark");
    $("#day3").removeClass("text-white bg-dark");
    $("#day4").removeClass("text-white bg-dark");
    $("#day5").removeClass("text-white bg-dark");
  }
}
