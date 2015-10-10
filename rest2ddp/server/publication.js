// hard-coded data structure that will eventually come from an API call
data = [
  {a: 1, id: 1},
  {b: 2, id: 2}
];

// hard-coded config that will eventually come from a collection
config = {
  collectionName: "testCollection" // the name of the collection that this api call's results will be published to
};

Meteor.publish("rest2ddp", function () {
  var self = this;
  var lastResult;
  
  Meteor.setInterval(() => {
    var result = JSON.parse(JSON.stringify(data));
    
    if (!lastResult) {
      // this is the first time, all are new
      for (var i = 0; i < result.length; i++) {
        console.log("@@@ Rule 0: added", i, result[i]);
        self.added(config.collectionName, i, result[i]);
      }
    } else {
      
    }
    
    lastResult = result;
    self.ready();
  }, 5000);
  
});
