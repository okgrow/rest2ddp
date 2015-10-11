Template.dashboard.helpers({
  ApiConfigs: function () {
    return ApiConfigs.find();
  },
  activeConfig: function () {
    var x = Session.get("activeConfig");
    return ApiConfigs.findOne(x);
  },
  isActive: function(id) {
    if (id === Session.get("activeConfig")) {
      return true;
    }
  }
});

Template.dashboard.events({
  'click .add-btn': function () {
    var x = ApiConfigs.insert({
      name: Random.id()
    });
    console.log(x);
    Session.set("activeConfig", x);
  },
  'click .config-listing li': function () {
    Session.set("activeConfig", this._id);
  }
});

Template.dashboard.rendered = function () {
  var x = ApiConfigs.findOne()._id;
  Session.set("activeConfig", x);
}