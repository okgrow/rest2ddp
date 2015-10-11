// we'll throw this away, it's just some hardcoded stuff for debugging

if (Meteor.isClient) {
  
  /*
  
  // search results example
  var conn = DDP.connect("http://localhost:3000");
  duckDuckGoSearchResults = new Mongo.Collection("duckDuckGoSearchResults", {connection: conn});
  conn.subscribe("rest2ddp", "duckduckgo-meteor");
  Tracker.autorun(function () {console.log(duckDuckGoSearchResults.find({}, {sort: {_id: 1}}).fetch());});
  
  // weather example
  var conn = DDP.connect("http://localhost:3000");
  weatherResults = new Mongo.Collection("weatherForecasts", {connection: conn});
  conn.subscribe("rest2ddp", "weather");
  Tracker.autorun(function () {console.log(weatherResults.find({}, {sort: {_id: 1}}).fetch());});
  
  */
}
