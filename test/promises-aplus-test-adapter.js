var Taxi = require('../taxi.js');
module.exports = {
  resolved: function(value) {
    var taxi = new Taxi();
    taxi.fulfill(value);
    return taxi;
  },
  rejected: function(reason) {
    var taxi = new Taxi();
    taxi.reject(reason);
    return taxi;
  },
  deferred: function() {
    var taxi = new Taxi();
    return {
      promise: taxi,
      resolve: taxi.fulfill,
      reject: taxi.reject
    };
  }
};
