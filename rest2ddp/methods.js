Meteor.methods({
  previewApiResult: function (config, variables) {
    // TODO check() and other error handling
    
    if (!this.isSimulation && config && config.restUrl && config.jsonPath) {
      var rawResult;
      var result;
      var error;
      
      replaceVarInConfig(config, variables);
      
      try {
        rawResult = HTTP.get(config.restUrl, {
          headers: {"User-Agent": "Meteor/1.0"}
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
