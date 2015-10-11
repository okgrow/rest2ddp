Accounts.onCreateUser(function(options, user) {
  console.log(user);
  EXAMPLE_SEED.forEach(function (seed) {
    var name = "example-" + Moniker.choose();
    ApiConfigs.insert({
      name: name,
      userId: user._id,
      collectionName: seed.collectionName,
      restUrl: seed.restUrl,
      jsonPath: seed.jsonPath,
      pollInterval: seed.pollInterval
    });
  });
  return user;
});