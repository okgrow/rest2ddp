Template.dashboard.helpers({
  ApiConfigs: function () {
    return ApiConfigs.find({}, {sort: {createdAt: 1}});
  },
  activeConfig: function () {
    var x = Session.get("activeConfig");
    return x && ApiConfigs.findOne(x);
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
	},
  url: function() {
    return Meteor.absoluteUrl();
  }
});

Template.dashboard.events({
  'click .add-btn': function () {
    Meteor.call("nameGenerator",function (error, result) {
      var x = ApiConfigs.insert({
        name: result,
        userId: Meteor.userId()
      });
      Session.set("activeConfig", x);
    });
  },
  'click .delete-btn': function (e,t) {
    var newConfig;
    var x = Session.get("activeConfig");
    ApiConfigs.remove(x);
    newConfig = ApiConfigs.findOne();
    if (newConfig) Session.set("activeConfig",newConfig._id);
    t.$(".delete-btn").blur();
  },
  'click .config-listing li': function () {
    Session.set("activeConfig", this._id);
  },
  'click .dash-help': function () {
    $('#help-modal').modal('toggle');
  },
  'click .connect-steps-btn': function () {
    $('#connect-steps').modal('toggle');
  }
});

Template.dashboard.rendered = function () {
  // call previewApiResult whenever activeConfig changes
  Tracker.autorun(() => {
    var x = Session.get("activeConfig");
    var cool = ApiConfigs.findOne(x);

    Meteor.call('previewApiResult', cool, function (err, result) {
      Session.set('output', result);
    });
  });
  Tracker.autorun(() => {
    // set first ApiConfig as current
    var apiConfig = ApiConfigs.findOne();
    var setFirst = apiConfig && apiConfig._id;
    Session.set("activeConfig", setFirst);
  });
};
