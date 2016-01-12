Package.describe({
  name:    "okgrow:rest2ddp",
  version: "0.1.0",
  summary: "Convert REST APIs into DDP published to your app.",
  git:     "https://github.com/okgrow/rest2ddp/"
});

Npm.depends({
  "deep-diff": "0.3.2",
  "jsonpath": "0.2.0"
});

Package.onUse(function (api) {
  api.use(['ecmascript@0.1.6', 'es5-shim@4.1.14', 'check@1.1.0','http@1.1.1']);
  api.addFiles('publication.js', ['server']);
  api.addFiles('apiConfigLib.js', ['server']);
  api.export('REST2DDP');
});