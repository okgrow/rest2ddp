Stations = new Mongo.Collection("stations");

Template.stationsList.onCreated(function () {
  var self = this;

  self.autorun(function () {
    self.subscribe('REST2DDP', "noaa-stations", {headers:{'Content-Type':'application/json'}});
  });
});

Template.stationsList.helpers({
  stations: function () {
    return Stations.find({},{sort:{'name':1}});
  },
  coverage: function () {
    var percent = this.datacoverage * 100;
    return percent.toFixed(2) + "%"
  }
});