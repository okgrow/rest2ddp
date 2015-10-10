RESTDDP.allow({
  // TODO: permissions need to be locked down once we have accounts
  insert: function () {
    return true;
  },
  update: function () {
    return true;
  },
  remove: function () {
    return true;
  }
});