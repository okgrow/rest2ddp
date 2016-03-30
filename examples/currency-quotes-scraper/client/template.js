Currency = new Mongo.Collection('currency');

Template.currencyQuotes.onCreated(function () {
  var self = this;
  self.autorun(function () {
    self.subscribe('REST2DDP', "currency");
  });
});

Template.currencyQuotes.helpers({
  currencies: function () {
    return Currency.find({},{sort:{'id':1}});
  }
});