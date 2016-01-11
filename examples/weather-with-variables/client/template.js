WeatherWind = new Mongo.Collection("weatherWind");

Template.forecasts.onCreated(function () {
  var self = this;
  var zipcodes = [60606,82210];

  self.autorun(function () {
    self.subscribe('REST2DDP', "yahoo-weather-forecasts",{variables:{zipcodes:zipcodes.toString()}});
  });
});

Template.forecasts.helpers({
  weather: function () {
    return WeatherWind.find({},{sort:{'location.city':1}});
  }
});