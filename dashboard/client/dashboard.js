var activeConfig = function () {
  if(Meteor.userId()) {
    var x = Session.get("activeConfig");
    return x && ApiConfigs.findOne(x);
  } else {
    var sample = EXAMPLE_SEED[1];
    sample.name = "TorontoWeather";
    return sample;
  }
};

var variableNames = function () {
console.log('@@@', "variableNames"); // TODO remove this, for debugging only
  var config = activeConfig();
  var names = [];
  for (var key of Object.keys(config)) {
    console.log('@@@', config[key]); // TODO remove this, for debugging only
    var re = /\$\{([a-z\-]*)\}/g;
    
    var match;
    while ((match = re.exec(config[key]))) {
      console.log('@@@', match); // TODO remove this, for debugging only
      names.push(match[1]);
    }
  }
  console.log('@@@', "names", names); // TODO remove this, for debugging only
  return names;
};

Template.dashboard.helpers({
  ApiConfigs: function () {
    return ApiConfigs.find({}, {sort: {createdAt: 1}});
  },
  activeConfig: activeConfig,
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
    console.log('@@@', "url"); // TODO remove this, for debugging only
    return Meteor.absoluteUrl();
  },
  variableNames: variableNames,
  exampleVariables: function() {
    console.log('@@@', "exampleVariables"); // TODO remove this, for debugging only
    var variables = {};
    for (var key of variableNames()) {
      variables[key] = "TODO";
    }
    return JSON.stringify(variables);
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
