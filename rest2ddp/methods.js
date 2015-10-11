Meteor.methods({
  previewApiResult: function (config) {
    console.log("previewApiResult called"); // TODO remove this, for debugging only
    if (!this.isSimulation) {
      var rawResult = HTTP.get(config.restUrl);
      var result;
      var error;

      if (rawResult.statusCode == 200) {
        try {
          result = JsonPath.query(JSON.parse(rawResult.content), config.jsonPath);
        } catch (e) {
          error = e;
        }
      }

      return {
        statusCode: rawResult.statusCode,
        headers: rawResult.headers,
        content: rawResult.content,
        result: result,
        error: error
      };
    }
  }
});
