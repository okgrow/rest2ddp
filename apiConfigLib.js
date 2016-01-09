// shared stuff between the preview method and the publication should go here
DeepDiff = Npm.require('deep-diff');
JsonPath = Npm.require('jsonpath');

REST2DDP = {
  configs: []
};

// nasty function that modifies the objects that are passed in
replaceVarInConfig = function (config, variables) {
  if (variables) {
    let replacedConfig = {};
    for (var key of Object.keys(config)) {
      replacedConfig[key] = config[key];
      for (var varName of Object.keys(variables)) {
        if (key === 'restUrl') {
          replacedConfig[key]=replacedConfig[key].replace("${" + varName + "}", variables[varName]);
        }
      }
    }
    return replacedConfig;
  } else {
    return config;
  }
};
