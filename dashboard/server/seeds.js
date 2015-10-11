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
      jsonPath: "$.RelatedTopics.*"
    });
    
    ApiConfigs.insert({
      userId: userId,
      name: "duckduckgo-kittens",
      collectionName: "duckDuckGoSearchResults",
      restUrl: "http://api.duckduckgo.com/?q=kittens&format=json&pretty=1",
      jsonPath: "$.RelatedTopics.*"
    });

    ApiConfigs.insert({
      userId: userId,
      name: "duckduckgo-sharks",
      collectionName: "duckDuckGoSearchResults",
      restUrl: "http://api.duckduckgo.com/?q=sharks&format=json&pretty=1",
      jsonPath: "$.RelatedTopics.*"
    });

    ApiConfigs.insert({
      userId: userId,
      name: "duckduckgo-bill-murray",
      collectionName: "duckDuckGoSearchResults",
      restUrl: "http://api.duckduckgo.com/?q=billmurray&format=json&pretty=1",
      jsonPath: "$.RelatedTopics.*"
    });
  }
});
