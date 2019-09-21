var app = angular.module("app", []);
var googleKey = config.google_key;
var weatherKey = config.weather_key;

app.value("noInput", "");

app.controller('appController', function($scope, WeatherService, GeolocationService, noInput) {
    $scope.number = noInput;
      GeolocationService.getLocation()
      .success(function(data){
          WeatherService.getWeather(data.location.lat, data.location.lng).then(function(response) {
              $scope.city = response.data.name;
              $scope.temp = response.data.main.temp;
              $scope.wind = response.data.wind.speed; 
              $scope.pressure = response.data.pressure;
              $scope.description = response.description;
              $scope.main = response.main;         
              $scope.visual = "http://openweathermap.org/img/w/" + response.data.weather[0].icon + ".png";   
              $scope.code = response.data.weather[0].description;
              $scope.hum = response.data.main.humidity;        
          });
      })
      .error(function(err){
        console.log(err);
      });
      
      $scope.square = function() {
          WeatherService.getWeatherByCity($scope.number).then(function(response) {
              $scope.city = response.data.name;
              $scope.temp = response.data.main.temp;
              $scope.wind = response.data.wind.speed;
              $scope.pressure = response.data.pressure;
              $scope.description = response.description;
              $scope.main = response.main; 
              $scope.visual = "http://openweathermap.org/img/w/" + response.data.weather[0].icon + ".png";   
             $scope.code = response.data.weather[0].description;
             $scope.hum = response.data.main.humidity;          
          });
      }
  });

app.service('GeolocationService', function($http){
    this.getLocation = function(){
        return $http.post('https://www.googleapis.com/geolocation/v1/geolocate?key=' + googleKey);
    }
});

app.factory('WeatherApiService', function($http) {
    var factory = {};


    factory.requestWeatherByCity = function(town){
        var URL = 'http://api.openweathermap.org/data/2.5/weather?';
  
        var request = {
            method: 'GET',
            url: URL,
            params: {
                q: town,
                mode: 'json',
                units: 'imperial',
                cnt: '7',
                appid: weatherKey
            }
        };
        return $http(request);
    }

    return factory;
});


app.service('WeatherService', function(WeatherApiService){
    this.getWeather = function(a, b) {
        return WeatherApiService.requestWeatherByLocation(a,b);        
    }
    this.getWeatherByCity = function(town){
        return WeatherApiService.requestWeatherByCity(town);
    }
});
