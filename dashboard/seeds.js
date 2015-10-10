Meteor.startup(() => {
  if (Meteor.users.find().count() === 0) {
    var userId = Accounts.createUser({
      email: 'foo@bar.com',
      password: 'password'
    });
    
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
    
  }
});
