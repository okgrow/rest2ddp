Package.describe({
  name: "npm-packages",
  version: "0.1.0",
});

Npm.depends({
  "deep-diff": "0.3.2",
});

Package.onUse(function(api) {
  // Meteor releases below this version are not supported
  api.versionsFrom("1.2.0.1");

  // The files of this package
  api.addFiles("requires.js", ["server"]);

  // The variables that become global for users of your package
  api.export("DeepDiff", ["server"]);
});
