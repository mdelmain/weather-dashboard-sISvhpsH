var APIKey = "9083443274c27542ddc7e8c2a820d282";
var countryCode = "840";

$(function () {
  formSubmitHandler();
});

function formSubmitHandler() {
  $(".btn").click(function (event) {
    event.preventDefault();

    var cityName = $("#city-name").get(0).value;
    console.log(cityName);
  });
}
