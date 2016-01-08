Meteor.methods({
  previewApiResult: function (config, options) {
    // TODO check() and other error handling
    if (!this.isSimulation && config && config.restUrl && config.jsonPath) {
      var rawResult;
      var result;
      var error;

      if(options.variables){ 
        replaceVarInConfig(config, options.variables);
      }
      
      // Only use headers frum current config
      var headers = _.pick(options.headers, config.headers);

      try {
        rawResult = HTTP.call("GET", config.restUrl, {
           headers: headers
        });

      } catch (e) {
        console.log(e);
        error = e;
      }

      if (!error && rawResult.statusCode && rawResult.statusCode == 200) {
        try {
          result = JsonPath.query(JSON.parse(rawResult.content), config.jsonPath);
        } catch (e) {
          error = e;
        }
      }

      return rawResult ? {
        statusCode: rawResult.statusCode,
        headers: rawResult.headers,
        content: rawResult.content,
        result: result,
        error: error
      } : {
        error: error
      };
    }
  }
});
