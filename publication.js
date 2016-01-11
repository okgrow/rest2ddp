Meteor.publish("REST2DDP", function (apiConfigName, options) {
  var self = this;
  check(apiConfigName, String);
  check(options, Match.Optional({
    variables: Match.Optional(Object),
    headers: Match.Optional(Object)
  }));

  // is there a better way to check dynamic named keys?
  if (options && options.variables) {
    for (let varName in options.variables) {
      check(options.variables[varName], Match.OneOf(String,Boolean,Number));
    }
  }
  if (options && options.headers) {
    for (let varName in options.headers) {
      check(options.headers[varName], String);
    }
  }

  console.log("REST2DDP - Starting publication", apiConfigName);

  var lastResults = new Map();

  var config = _.find(REST2DDP.configs,function(configObj){return configObj.name===apiConfigName});
  //var config = ApiConfigs.findOne({name: apiConfigName});
  // console.log('@@@ config', config);

  if (!config) {
    throw new Meteor.Error("config-not-found", "The config named " + apiConfigName + " was not found.");
  }

  // Merge headers defined on the client with headers defined on the server (config)
  if (options && options.headers && config.headers) {
    options.headers = _.defaults(options.headers, config.headers);
  } else if (config.headers) {
    options.headers = config.headers;
  }

  // Get rid of headers that are not defined for this config
  if (options && options.headers && config.headerKeys) {
    options.headers = _.pick(options.headers, config.headerKeys);
  }

  if (options && options.variables) {
    config = replaceVarInConfig(config, options.variables);
    // console.log('@@@ config after replace', config);
  }

  var pollInterval = config.pollInterval || 10;

  let poll = () => {

    console.log("REST2DDP - poll running for ",apiConfigName);

    var rawResult;
    try {
      rawResult = HTTP.call("GET", config.restUrl, {
        headers: (options && options.headers) || {}
      });
    } catch (e) {
      console.log(e);
      throw new Meteor.Error("HTTP-request-failed", "The HTTP request failed");
    }

    if (rawResult.statusCode !== 200) {
      throw new Meteor.Error("HTTP-error-code", "The HTTP request failed with status code: " + rawResult.statusCode);
    }

    var result;
    try {
      result = JsonPath.query(JSON.parse(rawResult.content), config.jsonPath);
    } catch (e) {
      console.log(e);
      throw new Meteor.Error("result-parse-error", "Couldn't parse the results");
    }

    // console.log('@@@', "result", result);

    var diff = DeepDiff.diff(lastResults.get(apiConfigName), result);

    var added = new Map();
    var removed = new Map();
    var changed = new Map();

    if (!lastResults.get(apiConfigName)) {
      // this is the first time, all are new
      for (var i = 0; i < result.length; i++) {
        // console.log("@@@ Rule 0: added", i, result[i]);
        self.added(config.collectionName, `${apiConfigName}-${i}`, result[i]);
      }
    } else if (!diff) {
      // console.log ("@@@ No difference");
    } else {
      // console.log('@@@ Diff', diff);

      // NOTE: We're not really taking advantage of the diff library right now,
      // there are two issues:
      //
      // 1. Unfortunately we can't tell yet that an object was inserted into the
      // array and the following items just shifted down, currently all items
      // after the inserted one will appear as changes.
      // We might as well be just walking the two arrays (result and lastResults)
      // and doing a changed event for each object that's different.
      //
      // 2. Changes should be just the (top-level) field that changed. Right now
      // we send the whole object (all fields). The diff library *can* tell us
      // exactly which fields changed but we're not using it.
      //
      // We'll fix those in a future iteration.

      for (var diffItem of diff) {
        if (diffItem.kind === "A" && diffItem.index && diffItem.path === undefined) {
          if (diffItem.item.kind === "D") {
            // console.log("@@@ Rule 1.1", "removed", diffItem.index);
            removed.set(diffItem.index, true);
          } else if (diffItem.item.kind === "N") {
            // console.log("@@@ Rule 1.2", "added", diffItem.index, result[diffItem.index]);
            added.set(diffItem.index, result[diffItem.index]);
          }
        } else if (diffItem.kind === "A" && diffItem.path) {
          // console.log('@@@ Rule 2', "changed", diffItem.path[0], result[diffItem.path[0]]);
          changed.set(diffItem.path[0], result[diffItem.path[0]]);
        } else if (diffItem.kind === "E") {
          // console.log('@@@ Rule 3', "changed", diffItem.path[0], result[diffItem.path[0]]);
          changed.set(diffItem.path[0], result[diffItem.path[0]]);
        } else if (diffItem.kind === "N" && diffItem.path) {
          // console.log('@@@ Rule 4', "changed", diffItem.path[0], result[diffItem.path[0]]);
          changed.set(diffItem.path[0], result[diffItem.path[0]]);
        } else if (diffItem.kind === "D" && diffItem.path) {
          // console.log('@@@ Rule 5', "changed", diffItem.path[0], result[diffItem.path[0]]);
          changed.set(diffItem.path[0], result[diffItem.path[0]]);
        } else {
          console.log('!!! Unhandled change', diffItem);
        }
      }
    }

    added.forEach((doc, id) => {
      //console.log("added", id, ":", doc);
      self.added(config.collectionName, `${apiConfigName}-${id}`, doc);
    });
    removed.forEach((doc, id) => {
      //console.log("removed", id, ":", doc);
      self.removed(config.collectionName, `${apiConfigName}-${id}`);
    });
    changed.forEach((doc, id) => {
      //console.log("changed", id, ":", doc);
      // This is really inefficient but for now we're not tracking changes by field
      // so to be sure that we unset any field that has been removed we
      // remove and re-add the object. 😰
      // Soon we'll diff the object with the old one and send the changes.
      self.removed(config.collectionName, `${apiConfigName}-${id}`);
      self.added(config.collectionName, `${apiConfigName}-${id}`, doc);
    });

    lastResults.set(apiConfigName, result);
    self.ready();
  };

  poll();

  var intervalHandle = Meteor.setInterval(poll, pollInterval * 1000);

  self.onStop(() => {
    console.log("REST2DDP - Stopping publication", apiConfigName);
    Meteor.clearInterval(intervalHandle);
  });
});
