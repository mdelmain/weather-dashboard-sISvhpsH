var APIKey = "9083443274c27542ddc7e8c2a820d282";
var countryCode = "840";

$(function () {
  formSubmitHandler();
});

function formSubmitHandler() {
  $(".btn").click(function (event) {
    event.preventDefault();

    var cityName = $("#city-name").get(0).value;
    getCoordinates(cityName);
    //$("#current-weather-city").text(cityName + "," );
  });
}

function getCoordinates(cityName) {
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "," + countryCode +"&limit=1&appid=" + APIKey;
    console.log(apiUrl);

    fetch (apiUrl)
    .then(function (response) {
        return response.json();
      })
    .then(function (data) {
        var lat = data[0].lat;
        var lon = data[0].lon;
        console.log({data});
        console.log(lat);
        console.log(lon);
        getCurrentWeather(lat, lon);
        var today = dayjs().format("MM/DD/YY")
        $("#current-weather-city").text(data[0].name + ", " + data[0].state + " (" + today +  ")");
    });
}

function getCurrentWeather(lat, lon) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;
    console.log("getcurrent", apiUrl);
   
    fetch (apiUrl)
    .then(function (response) {
        return response.json();
      })
    .then(function (data) {
        console.log(data);
        var temp  = data.main.temp;
        var wind = data.wind.speed;
        var humidity = data.main.humidity;
        var iconcode = data.weather[0].icon;
        var icon = "http://openweathermap.org/img/w/" + iconcode + ".png";
        console.log(icon);
        console.log(temp);
        console.log(wind);
        console.log(humidity);
        updateCurrentWeatherContainer (icon, temp, wind, humidity);
    });

}

function updateCurrentWeatherContainer (icon, temp, wind, humidity) {
    $("#icon").attr("src", icon);
    $("#temp").text("Temp: " + temp + "°F");
    $("#wind").text("Wind: " + wind + " MPH");
    $("#humidity").text("Humidity: " + humidity + " %");
}