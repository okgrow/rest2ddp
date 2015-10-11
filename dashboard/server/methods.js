Meteor.methods({
  nameGenerator: function () {
    var user = Meteor.users.findOne(this.userId).services.github;
    var name = user.username + "-" + Moniker.choose();
    return name;
  }
});