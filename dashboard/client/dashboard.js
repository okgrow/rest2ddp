var activeConfigId = new ReactiveVar('');

var activeConfig = function () {
  if(Meteor.userId()) {
    var x = activeConfigId.get();
    return x && ApiConfigs.findOne(x);
  } else {
    var sample = EXAMPLE_SEED[1];
    sample.name = "TorontoWeather";
    return sample;
  }
};

var variableNames = function () {
  var config = activeConfig();
  var names = [];
  for (var key of Object.keys(config)) {
    var re = /\$\{([a-z\-]*)\}/g;
    
    var match;
    while ((match = re.exec(config[key]))) {
      names.push(match[1]);
    }
  }
  return names;
};

Template.dashboard.helpers({
  ApiConfigs: function () {
    return ApiConfigs.find({}, {sort: {createdAt: 1}});
  },
  activeConfig: activeConfig,
  isActive: function(id) {
    if (id === activeConfigId.get()) {
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
  },
  variableNames: variableNames,
  exampleVariables: function() {
    var variables = {};
    for (var key of variableNames()) {
      variables[key] = "TODO";
    }
    return JSON.stringify(variables);
  },
  hasVariables: function() {
    return variableNames.length === 0;
  },
  toArray: function (object) {
    return object && _.pairs(object);
  }
});

Template.dashboard.events({
  'click .add-btn': function () {
    var sample = EXAMPLE_SEED[1];

    Meteor.call("nameGenerator",function (error, result) {
      sample.name = result + "-DEMO";
      sample.userId = Meteor.userId();
      var x = ApiConfigs.insert(sample);
      activeConfigId.set(x);
    });
  },
  'click .delete-btn': function (e,t) {
    var newConfig;
    var x = activeConfigId.get();
    ApiConfigs.remove(x);
    newConfig = ApiConfigs.findOne();
    if (newConfig) activeConfigId.set(newConfig._id);
    t.$(".delete-btn").blur();
  },
  'click .config-listing li': function () {
    activeConfigId.set(this._id);
  },
  'click .dash-help': function () {
    $('#help-modal').modal('toggle');
  },
  'click .connect-steps-btn': function () {
    $('#connect-steps').modal('toggle');
  },
  'keyup .variable': function() {
    var inputVars = {};
    $('.variable').each(function(i) {
      var value = $(this).val();
      var key = $(this).data('label');
      inputVars[key] = value;
    });
    Session.set('variableInputs', inputVars);
  }
});

Template.dashboard.rendered = function () {
  // call previewApiResult whenever activeConfig changes
  Tracker.autorun(() => {
    var x = activeConfigId.get();
    var config = ApiConfigs.findOne(x);
    var re = /\$\{([a-z\-]*)\}/g;
    var variableInputs = Session.get('variableInputs');

    Meteor.call('previewApiResult', config, variableInputs, function (err, result) {
      Session.set('output', result);
    });
  });
  Tracker.autorun(() => {
    // set first ApiConfig as current
    var apiConfig = ApiConfigs.findOne();
    var setFirst = apiConfig && apiConfig._id;
    activeConfigId.set(setFirst);
  });
};
