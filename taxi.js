(function() {
  'use strict';

  // async calling a function
  // `setImmediate` or `function(fn) { setTimeout(fn, 0) }` in browser
  // `process.nextTick` in node
  var asyncCall = process.nextTick;

  // 2.3
  // The Promise Resolution Procedure
  // [[Resolve]](promise, x)
  function resolve(promise, x) {
    // 2.3.1
    // If promise and x refer to the same object,
    // reject promise with a TypeError as the reason.
    if (promise === x) {
      return promise.reject(new TypeError('The promise and its value refer to the same object'));
    }
    // 2.3.3
    // if x is an object or function
    if (x && (typeof x === 'function' || typeof x === 'object')) {
      // 2.3.3.3
      // If both resolvePromise and rejectPromise are called,
      // or multiple calls to the same argument are made,
      // the first call takes precedence,
      // and any further calls are ignored.
      var called = false,
        then;

      try {
        // 2.3.3.1
        // Let then be x.then.
        then = x.then;

        if (typeof then === 'function') {
          // 2.3.3.3
          // If then is a function,
          // call it with x as this,
          // first argument resolvePromise,
          // and second argument rejectPromise,
          then.call(x, function(y) {
            // 2.3.3.3.1
            // If/when resolvePromise is called with a value y,
            // run [[Resolve]](promise, y).
            if (!called) {
              called = true;
              resolve(promise, y);
            }
          }, function(r) {
            // 2.3.3.3.2
            // If/when rejectPromise is called with a reason r,
            // reject promise with r.
            if (!called) {
              called = true;
              promise.reject(r);
            }
          });
        }else {
          // 2.3.3.4
          // If then is not a function,
          // fulfill promise with x.
          promise.fulfill(x);
        }
      }catch (e) {
        // 2.3.3.2
        // If retrieving the property x.then results in a thrown exception e,
        // reject promise with e as the reason.
        if (!called) {
          called = true;
          promise.reject(e);
        }
      }
    }else {
      // 2.3.4
      // If x is not an object or function,
      // fulfill promise with x.
      promise.fulfill(x);
    }
  }

  function Taxi() {
    // 0 pending, 1 fulfilled, 2 rejected
    var _state = 0,
      _value,
      _onFulfills = [],
      _onRejects = [];
    this.done = function(onFulfilled, onRejected) {
      if (_state === 0) {
        _onFulfills.push(onFulfilled);
        _onRejects.push(onRejected);
      }else {
        asyncCall(function() {
          if (_state === 1) {
            if (typeof onFulfilled === 'function') {
              onFulfilled(_value);
            }
          }else if (typeof onRejected === 'function') {
            onRejected(_value);
          }
        });
      }
    };

    function _complete(state, value){
      if (!_state) {
        _state = state;
        _value = value;
        asyncCall(function() {
          var handlers = state == 1 ? _onFulfills : _onRejects;
          handlers.forEach(function(fn) {
            if (typeof fn === 'function') {
              fn(value);
            }
          });
          _onFulfills = null;
          _onRejects = null;
        });
      }
    }

    this.fulfill = function(value) {
      _complete(1, value);
    };
    this.reject = function(value) {
      _complete(2, value);
    };
  }

  Taxi.prototype = {
    constructor: Taxi,
    catch: function(onRejected) {
      this.then(null, onRejected);
    },
    then: function(onFulfilled, onRejected) {
      // 2.2.7
      // then must return a promise
      var taxi = new Taxi();

      // 2.2.2
      // If onFulfilled is a function:
      // 2.2.2.1
      // it must be called after promise is fulfilled,
      // with promise’s value as its first argument.
      // 2.2.3
      // If onRejected is a function,
      // 2.2.3.1
      // it must be called after promise is rejected,
      // with promise’s reason as its first argument.
      this.done(function(x) {
        if (typeof onFulfilled === 'function') {
          try {
            // 2.2.7.1
            // If either onFulfilled or onRejected returns a value x,
            // run the Promise Resolution Procedure [[Resolve]](promise2, x).
            resolve(taxi, onFulfilled(x));
          }catch (e) {
            // 2.2.7.2
            // If either onFulfilled or onRejected throws an exception e,
            // promise2 must be rejected with e as the reason.
            taxi.reject(e);
          }
        }else {
          // 2.2.1.1
          // If onFulfilled is not a function, it must be ignored.
          // 2.2.7.3
          // If onFulfilled is not a function and promise1 is fulfilled, 
          // promise2 must be fulfilled with the same value as promise1.
          taxi.fulfill(x);
        }
      }, function(x) {
        if (typeof onRejected === 'function') {
          try {
            // 2.2.7.1
            // If either onFulfilled or onRejected returns a value x,
            // run the Promise Resolution Procedure [[Resolve]](promise2, x).
            resolve(taxi, onRejected(x));
          }catch (e) {
            // 2.2.7.2
            // If either onFulfilled or onRejected throws an exception e,
            // promise2 must be rejected with e as the reason.
            taxi.reject(e);
          }
        }else {
          // 2.2.1.2
          // If onRejected is not a function, it must be ignored.
          // 2.2.7.4
          // If onRejected is not a function and promise1 is rejected, 
          // promise2 must be rejected with the same reason as promise1.
          taxi.reject(x);
        }
      });
      return taxi;
    }
  };
  module.exports = Taxi;
}());
