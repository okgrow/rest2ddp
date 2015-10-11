Meteor.methods({
  previewApiResult: function (config) {
    if (!this.isSimulation && config && config.restUrl && config.jsonPath) {
      var rawResult;
      var result;
      var error;
      try {
        rawResult = HTTP.get(config.restUrl);
      } catch (e) {
        console.log(e);
        error = e;
      }

      if (rawResult.statusCode && rawResult.statusCode == 200) {
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
