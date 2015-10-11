// shared stuff between the preview method and the publication should go here

// nasty function that modifies the objects that are passed in 😐
replaceVarInConfig = function (config, variables) {
  if (variables) {
    for (var key of Object.keys(config)) {
      for (var varName of Object.keys(variables)) {
        if (typeof config[key] === 'string') {
          config[key] = config[key].replace("${" + varName + "}", variables[varName], 'g');
        }
      }
    }
  }
};
