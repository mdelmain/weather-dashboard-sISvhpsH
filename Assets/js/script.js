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
        getFiveDayForecast(lat, lon);
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

function getFiveDayForecast(lat, lon) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;

    fetch (apiUrl)
    .then(function (response) {
        return response.json();
      })
    .then(function (data) {
        console.log("test")
        console.log({label:"test", data});
        console.log("test", data.list[3].dt);
        //var date =  dayjs.unix(data.list[3].dt).format("MM/DD/YY")
        //console.log("date", date);
        
        //console.log("today", currentDateObject);
        for (var i = 1; i <=5;  i++) {
            var dayForecast = getDayForecast(i, data);
            var date = dayjs.unix(dayForecast.dt).format("MM/DD/YY");
            var temp  = dayForecast.main.temp;
            var wind = dayForecast.wind.speed;
            var humidity = dayForecast.main.humidity;
            var iconcode = dayForecast.weather[0].icon;
            var icon = "http://openweathermap.org/img/w/" + iconcode + ".png";
            updateForecastWeatherContainer (i, date, icon, temp, wind, humidity);
        }
   
       
    });
}

function getDayForecast(days, data) {
    var targetDateObject = dayjs().utc().hour(12).minute(0).second(0).millisecond(0).add(days, "day");
    for (var i = 0; i < data.list.length; i++){
        var forecastDateObject =  dayjs.unix(data.list[i].dt);
        //console.log("forecastdate",  forecastDateObject);
        if (forecastDateObject >= targetDateObject){
            return data.list[i];
        }
    }
}

function updateForecastWeatherContainer (id, date, icon, temp, wind, humidity) {
    $("#day"+id+ " .day").text(date);
    $("#day"+id+ " .icon").attr("src", icon);
    $("#day"+id+ " .temp").text("Temp: " + temp + "°F");
    $("#day"+id+ " .wind").text("Wind: " + wind + " MPH");
    $("#day"+id+ " .humidity").text("Humidity: " + humidity + " %");
}