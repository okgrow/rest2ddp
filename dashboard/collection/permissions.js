var ownsDocument = function(userId, doc) {
  return doc && userId && doc.userId === userId;
};

ApiConfigs.allow({
  insert: ownsDocument,
  update: ownsDocument,
  remove: ownsDocument
});
