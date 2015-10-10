ApiConfigs = new Mongo.Collection('apiConfigs');

ApiConfigs.attachSchema(new SimpleSchema({
  name: {
    type: String,
    optional: true
  },
  description: {
    type: String,
    optional: true
  },
  // name of collection that results should be published into
  collectionName: {
    type: String,
    optional: true
  },
  //JsonPath expression to locate the array within the API results
  jsonPath: {
    type: String,
    optional: true
  },
  restUrl: {
    type: String,
    optional: true
  },
  restAuth: {
    type: Object,
    blackbox: true,
    optional: true
  },
  userId: {
    type: String,
    regEx: /^[a-z0-9A-z .]{3,30}$/,
    index: true,
    autoform: {
      omit: true
    }
  },
  // Force value to be current date (on server) upon insert
  // and prevent updates thereafter.
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date;
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date};
      } else {
        this.unset();
      }
    },
    autoform: {
      omit: true
    }
  },
  // Force value to be current date (on server) upon update
  // and don't allow it to be set upon insert.
  updatedAt: {
    type: Date,
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    },
    denyInsert: true,
    autoform: {
      omit: true
    },
    optional: true
  }
}));