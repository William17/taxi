<a href="https://promisesaplus.com/">
    <img src="https://promisesaplus.com/assets/logo-small.png" alt="Promises/A+ logo"
         title="Promises/A+ 1.0 compliant" align="right" />
</a>
[![Build Status](https://travis-ci.org/William17/taxi.png?branch=master)](http://travis-ci.org/William17/taxi)
[![Coverage Status](https://coveralls.io/repos/William17/taxi/badge.svg?branch=master&service=github)](https://coveralls.io/github/William17/taxi?branch=master)
#Taxi  
A tiny example Promises/A+ implementation.  
No any other features.  
Simple and annotated with the spec content.  
Just for learning.  

#API  
- [new Taxi()](#new-promise)  
  - [.then([Function fulfilledHandler] [, Function rejectedHandler ])](#promise-then)  
  - [.done([Function fulfilledHandler] [, Function rejectedHandler ])](#promise-done)  
  - [.catch(Function handler)](#promise-catch)  
  - [.fulfill(dynamic result)](#promise-fulfill)  
  - [.reject(dynamic reason)](#promise-reject)  

#Test  
`npm run promises-aplus-test`  

#License  
MIT:http://william17.mit-license.org
