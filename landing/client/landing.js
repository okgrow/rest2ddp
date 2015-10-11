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
    var cool = EXAMPLE_SEED[1];
    cool.name = "TorontoWeather";

    Meteor.call('previewApiResult', cool, function (err, result) {
      Session.set('output', result);
    });
  });
};
