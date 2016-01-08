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
    var re = /\$\{([\w\-]*)\}/g;
    
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
  options: function(){
    var options = {
      variables: {},
      headers : {}
    };
    var headersKeys = ApiConfigs.findOne(activeConfigId.get()).headers;

    for (var key of variableNames()) {
      options.variables[key] = "TODO";
    }
    
    if(headersKeys){
      for (var key of headersKeys) {
        options.headers[key] = "TODO";
      }
    }

    return JSON.stringify(options);
  },
  hasVariables: function() {
    return variableNames.length === 0;
  },
  toArray: function (object) {
    return object && _.pairs(object);
  },
  requestFail: function () {
    return Session.get("requestFail");
  },
  headerValue: function () {
    return Template.instance().headerValues.get(this);
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
  },
  'click #addHeaderButton': function (event, template) {
    var headerName = template.find('#newHeaderName').value;
    var headerValue = template.find('#newHeaderValue').value;
    headers =  ApiConfigs.findOne(activeConfigId.get()).headers;

    if(_.contains(headers, headerName)) {
      alert("Duplicate header"); //TODO: Replace with a reactive error
    }
    else {
      template.find('#newHeaderName').value = "";
      template.find('#newHeaderValue').value = "";

      ApiConfigs.update(activeConfigId.get(), {$push: { headers: headerName }});
      template.headerValues.set(headerName, headerValue);
    }
  },
  'click #removeHeaderButton': function (event, template) {
    ApiConfigs.update(activeConfigId.get(), {$pull: {headers: event.target.getAttribute('data-label')}} );
  },
  'change .headersName': function (event) {
    // TODO update header in DB and in headerValus:
    var index = event.target.dataset.index;
    var setter = {};
    setter[`headers.${index}`] = event.target.value;
    ApiConfigs.update(activeConfigId.get(), {$set: setter});
  },
  'keyup .headersValue': function (event, template) {
    template.headerValues.set(event.target.getAttribute('data-label'), event.target.value);
  }
});

Template.dashboard.onCreated(function () {
  this.headerValues = new ReactiveDict();
});

Template.dashboard.onRendered(function () {
  // call previewApiResult whenever activeConfig changes
  Tracker.autorun(() => {
    var x = activeConfigId.get();
    var config = ApiConfigs.findOne(x);

    var re = /\$\{([a-z\-]*)\}/g;

    var options = {
      variables: Session.get('variableInputs'),
      headers: this.headerValues.all()
    };

    Meteor.call('previewApiResult', config, options, function (err, result) {
      if (err || (result && !result.statusCode)) {
        console.log("error: ", err, result);
        Session.set("requestFail", true);
      } else {
        Session.set("requestFail", false);
      }
      Session.set('output', result);
    });
  });
  Tracker.autorun(() => {
    // set first ApiConfig as current
    var apiConfig = ApiConfigs.findOne();
    var setFirst = apiConfig && apiConfig._id;
    activeConfigId.set(setFirst);
  });
});
