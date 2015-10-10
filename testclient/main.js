// we'll throw this away, it's just some hardcoded stuff for debugging

if (Meteor.isClient) {
  duckDuckGoSearchResults = new Mongo.Collection("duckDuckGoSearchResults");
  Meteor.subscribe("rest2ddp", "duckduckgo-meteor");
  
  Tracker.autorun(function () {
    console.log(duckDuckGoSearchResults.find({}, {sort: {_id: 1}}).fetch());
  });
}
