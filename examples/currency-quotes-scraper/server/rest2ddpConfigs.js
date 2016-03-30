REST2DDP.configs.push({
  name: "currency",
  collectionName: "currency",
  jsonPath: "$.query.results.tr.*",
  pollInterval: 10,
  restUrl:"https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'http%3A%2F%2Fwww.investing.com%2Fquotes%2Fstreaming-forex-rates-%25E2%2580%2593-majors'%20and%20xpath%3D'%2F%2Ftable%5B%40id%3D%22cr1%22%5D%2Ftbody%2Ftr'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback="
});