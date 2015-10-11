Template.dashboard.helpers({
  ApiConfigs: function () {
    return ApiConfigs.find({}, {sort: {createdAt: 1}});
  },
  activeConfig: function () {
    var x = Session.get("activeConfig");
    return ApiConfigs.findOne(x);
  },
  isActive: function(id) {
    if (id === Session.get("activeConfig")) {
      return true;
    }
  },
	output: function() {
		return Session.get('output');
	},
	stringify: function(str) {
		return JSON.stringify(str, null, 2);
	}
});

Template.dashboard.events({
  'click .add-btn': function () {
    var x = ApiConfigs.insert({
      name: Random.id(),
      userId: Meteor.userId()
    });
    console.log(x);
    Session.set("activeConfig", x);
  },
  'click .delete-btn': function (e,t) {
    var x = Session.get("activeConfig");
    Session.set("activeConfig",ApiConfigs.findOne()._id);
    t.$(".delete-btn").blur();
    return ApiConfigs.remove(x);
  },
  'click .config-listing li': function () {
    Session.set("activeConfig", this._id);
  },
  'click .dash-help': function () {
    $('#help-modal').modal('toggle')
  }
});

Template.dashboard.rendered = function () {
  // set first ApiConfig as current
  var apiConfig = ApiConfigs.findOne();
  var x = apiConfig && apiConfig._id;
  Session.set("activeConfig", x);
  
  // call previewApiResult whenever activeConfig changes
  Tracker.autorun(() => {
    var x = Session.get("activeConfig");
    var cool = ApiConfigs.findOne(x);

    Meteor.call('previewApiResult', cool, function (err, result) {
      Session.set('output', result);
    });
  });


  window.onresize = function(event) {
    if (window.innerHeight <= 825) {
      $("#dashboard").height(window.innerHeight - 95);
    }
  };
  if (window.innerHeight <= 825) {
    $("#dashboard").height(window.innerHeight - 95);
  }
};
