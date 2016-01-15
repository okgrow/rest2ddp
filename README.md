# REST2DDP Meteor Atmosphere Package

Convert REST APIs into DDP publications for your client side to reactively consume.

Add it to your project `meteor add okgrow:rest2ddp`.

## Examples

- Scrapping websites with yahoo tools ([code](https://github.com/okgrow/rest2ddp/tree/master/examples/currency-quotes-scrapper))
- Passing parameters to get windchills ([code](https://github.com/okgrow/rest2ddp/tree/master/examples/weather-with-variables))
- Passing tokens in header to get gov data ([code](https://github.com/okgrow/rest2ddp/tree/master/examples/weather-stations-with-header))

## 1. Collection (Client and/or Server)

REST2DDP requires a Meteor collection to interact with. Typically this is called on the client but can be on the server or both as well.
 
```javascript
BaseballPlayers = new Mongo.Collection('baseballPlayers');
```
 
## 2. Config Objects (Server)

`REST2DDP.configs` is a global array of objects which hold configuration settings for each publication. Since this object could hold private keys it is recommended to only have these configs on the server-side.

| Setting        | Type   | Required | Description |
| ---            | ---    | ---      | ---         |
|**name**        | string | true     | Name of the publication to subscribe to. |
|**collection**  | string | true     | Specify which collection to send data. |
|**restUrl**     | string | true     | The URL of the REST call. Dynamic parameters are held by a dollar sign blocks, `${varName}`. |
|**jsonPath**    | string | true     | Tell REST2DDP where to find the array in the API response. The path must always be an array and end with a wildcard (*). Check out the [jsonpath](https://www.npmjs.com/package/jsonpath) docs. |
|**pollInterval**| number | false    | Sets the interval in seconds of pinging the API. Defaults to 10 seconds. |
|**headerKeys**  | array  | false    | An array of strings. Specifies which keys are allowed in the header of a call. Good idea to set since clients can modify the header. |
|**headers**     | object | false    | Pass an object of default key values passed with every call. Client can override key values. Values must be a string. |


```javascript
// -----------------
// BASIC EXAMPLE
// -----------------
REST2DDP.configs.push({
  name: 'basic-baseball-player-stats',
  collectionName: 'baseballPlayers',
  restUrl:'http://dev.mlb.com/api/teamStats&team=cubs',
  jsonPath: '$.results.players.*'
});

// -----------------
// ADVANCE EXAMPLE
// -----------------
var apiToken = process.env.MLB_API_TOKEN;

REST2DDP.configs.push({
  name: 'adv-baseball-player-stats',
  collectionName: 'baseballPlayers',
  restUrl:'http://dev.mlb.com/api/teamStats&team=${teamName}',
  jsonPath: '$.results.players.*',
  pollInterval: 30,
  headerKeys: ['token', 'Content-Type'],
  headers: {
    token:apiToken,
    'Content-Type': 'application/json'
  }
});
```
 
## 3. Subscribing (Client or Server)

On the client you will subscribe to REST2DDP like you would any other publication and pass it parameters. The name of the publication you are subscribing to will always be `'REST2DDP'`.

| Argument | Type   | Required | Description |
| ---      | ---    | ---      | ---         |
| 1        | string | true     | Name of the publication you are subscribing to will always be `'REST2DDP'`. |
| 2        | string | true     | Name of configuration to call. |
| 3        | object | false    | Takes upto two optional keys which are objects, `variables: {object}` and `headers: {object}`. |


```javascript
Template.playersList.onCreated(function () {
  var self = this;
  
  // -----------------
  // BASIC EXAMPLE
  // -----------------
  self.autorun(function () {
    self.subscribe('REST2DDP', 'basic-baseball-player-stats');
  });
  
  // -----------------
  // ADVANCE EXAMPLE
  // -----------------
  self.autorun(function () {
    self.subscribe('REST2DDP', 'adv-baseball-player-stats', {
      variables: {
        teamName: 'cubs'
      },
      headers: {}
    });
  });
});
```

## How to help/future features

- Support XML
- Support single document returns

## Contributing

Issues and Pull Requests are always welcome. Please read our [contribution guidelines](https://github.com/okgrow/guides/blob/master/contributing.md).
