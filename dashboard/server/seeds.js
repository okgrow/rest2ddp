Meteor.startup(() => {
  if (Meteor.users.find().count() === 0) {
    var userId = Accounts.createUser({
      email: 'foo@bar.com',
      password: 'password'
    });
  }
  if (ApiConfigs.find().count() === 0) {
    ApiConfigs.insert({
      userId: userId,
      name: "duckduckgo-meteor",
      collectionName: "duckDuckGoSearchResults",
      restUrl: "http://api.duckduckgo.com/?q=meteor&format=json&pretty=1",
      jsonPath: "$.RelatedTopics.*",
      pollInterval: 5
    });
    
    ApiConfigs.insert({
      userId: userId,
      name: "duckduckgo-kittens",
      collectionName: "duckDuckGoSearchResults",
      restUrl: "http://api.duckduckgo.com/?q=kittens&format=json&pretty=1",
      jsonPath: "$.RelatedTopics.*",
      pollInterval: 5
    });
    
    ApiConfigs.insert({
      userId: userId,
      name: "duckduckgo-sharks",
      collectionName: "duckDuckGoSearchResults",
      restUrl: "http://api.duckduckgo.com/?q=sharks&format=json&pretty=1",
      jsonPath: "$.RelatedTopics.*",
      pollInterval: 5
    });

    ApiConfigs.insert({
      userId: userId,
      name: "duckduckgo-bill-murray",
      collectionName: "duckDuckGoSearchResults",
      restUrl: "http://api.duckduckgo.com/?q=billmurray&format=json&pretty=1",
      jsonPath: "$.RelatedTopics.*",
      pollInterval: 5
    });
        
    ApiConfigs.insert({
      userId: userId,
      name: "weather",
      collectionName: "weatherForecasts",
      restUrl: "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22Toronto%2C%20CA%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys",
      jsonPath: "$.query.results.channel.item.forecast.*",
      pollInterval: 5
    });

  }
});
