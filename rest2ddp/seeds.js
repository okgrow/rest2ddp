EXAMPLE_SEED = [
  {
    collectionName: "duckDuckGoSearchMeteor",
    restUrl: "http://api.duckduckgo.com/?q=meteor&format=json&pretty=1",
    jsonPath: "$.RelatedTopics.*",
    pollInterval: 5
  },
  {
    collectionName: "weatherForecasts",
    restUrl: "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22Toronto%2C%20CA%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys",
    jsonPath: "$.query.results.channel.item.forecast.*",
    pollInterval: 5
  },
  {
    collectionName: "SimpleREST",
    restUrl: "http://httpbin.org/get",
    jsonPath: "$",
    pollInterval: 100
  }
];
