// you can get a NOAA token at https://www.ncdc.noaa.gov/cdo-web/token
var apiToken = process.env.NOAA_API_TOKEN;

REST2DDP.configs.push({
  name: "noaa-stations",
  collectionName: "stations",
  jsonPath: "$.results.*",
  pollInterval: 60,
  restUrl:"http://www.ncdc.noaa.gov/cdo-web/api/v2/stations",
  headerKeys: ['token', 'Content-Type'],
  headers: {
    token:apiToken
  }
});