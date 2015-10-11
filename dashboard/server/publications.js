Meteor.publish("myConfigs", function () {
  return ApiConfigs.find({userId: this.userId});
});