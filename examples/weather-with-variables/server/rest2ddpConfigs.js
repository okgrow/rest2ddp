REST2DDP.configs.push({
  name: "yahoo-weather-forecasts",
  collectionName: "weatherWind",
  jsonPath: "$.query.results.channel.*",
  pollInterval: 10,
  restUrl:"https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20location%20in%20(${zipcodes})&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys"
});