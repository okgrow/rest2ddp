// we'll throw this away, it's just some hardcoded stuff for debugging

if (Meteor.isClient) {
  testCollection = new Mongo.Collection("test");
  Meteor.subscribe("rest2ddp", "test");
  
  Tracker.autorun(function () {
    console.log(testCollection.find({}, {sort: {_id: 1}}).fetch())
  })
}
