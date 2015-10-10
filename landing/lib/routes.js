FlowRouter.route('/', {
  action: function() {
  	var currentUser = Meteor.users.findOne(Meteor.userId());
  	if(currentUser) {
  		BlazeLayout.render('dashboard');
  	} else {
  		BlazeLayout.render('landing');
  	}
  }
});