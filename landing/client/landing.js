Template.landing.events({
	'click .github-signup': function(evt, temp) {
		evt.preventDefault();
		Meteor.loginWithGithub();
	}
});


Template.landing.rendered = function () {
  // call previewApiResult whenever activeConfig changes
  Tracker.autorun(() => {
    var x = Session.get("activeConfig");
    var options = {};
    options.variables = EXAMPLE_SEED[1];
    options.variables.name = "TorontoWeather";


    Meteor.call('previewApiResult', options, function (err, result) {
      Session.set('output', result);
    });
  });
};
