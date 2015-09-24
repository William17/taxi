var Benchmark = require('benchmark');
var Taxi = require('../taxi.js');
var Bluebird = require('bluebird');

var bluebirdDefer = Bluebird.defer;

function taxiDefer() {
  var taxi = new Taxi();
  return {
    promise: taxi,
    resolve: taxi.fulfill,
    reject: taxi.reject
  };
}

function addOne(x) {
  return x + 1;
}

var suite = new Benchmark.Suite();
suite.add('Bluebird', {
  defer: true,
  fn: function(deferred) {
    var d = bluebirdDefer();
    d.promise.then(addOne).then(function(value){
      var y = bluebirdDefer();
      y.resolve(value+1);
      return y.promise;
    }).then(addOne).then(function() {
      deferred.resolve();
    });
    d.resolve(1);
  }
})
.add('Taxi', {
  defer: true,
  fn: function(deferred) {
    var d = taxiDefer();
    d.promise.then(addOne).then(function(value) {
      var y = taxiDefer();
      y.resolve(value+1);
      return y.promise;
    }).then(addOne).then(function() {
      deferred.resolve();
    });
    d.resolve(1);
  }
})
.on('complete', function() {
  this.forEach(function(s) {
    console.log(s.toString());
  });
})
.run();