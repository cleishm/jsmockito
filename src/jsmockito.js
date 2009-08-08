/* vi:ts=2 sw=2 expandtab
 *
 * JsMockito v@VERSION
 * http://github.com/chrisleishman/jsmockito
 *
 * Mockito port to JavaScript
 *
 * Copyright (c) 2009 Chris Leishman
 * Licensed under the BSD license
 */

/**
 * Main namespace.
 * @namespace
 */
JsMockito = {
  /**
   * Library version,
   */
  version: '@VERSION',

  /**
   * Add a stub for a mock object method or anonymous function
   * @param mock A mock object or mock anonymous function
   * @return {object or function} A stub builder on which the method or
   * function to be stubbed can be invoked
   */
  when: function(mock) {
    return mock._jsMockitoStubBuilder(JsHamcrest.Matchers.anything());
  },

  /**
   * Verify that a mock object method or anonymous function was invoked
   * @param mock A mock object or mock anonymous function
   * @return {object or function} A verifier on which the method or function to
   *   be verified can be invoked
   */
  verify: function(mock, verifier) {
    return (verifier || JsMockito.verifiers.once()).verify(mock);
  },

  contextCaptureFunction: function(defaultContext, handler) {
    // generate a function with overridden 'call' and 'apply' methods
    // and apply a default context when these are not used to supply
    // one explictly.
    var captureFunction = function() {
      return captureFunction.apply(defaultContext,
        Array.prototype.slice.call(arguments, 0));
    };
    captureFunction.call = function(context) {
      return captureFunction.apply(context,
        Array.prototype.slice.call(arguments, 1));
    };
    captureFunction.apply = function(context, args) {
      return handler.apply(this, [ context, args||[] ]);
    };
    return captureFunction;
  },

  matchArray: function(matchers, array) {
    if (matchers.length > array.length)
      return false;
    return !JsMockito.any(matchers, function(matcher, i) {
      return !matcher.matches(array[i]);
    });
  },

  toMatcher: function(obj) {
    return JsHamcrest.isMatcher(obj)? obj :
      JsHamcrest.Matchers.equalTo(obj);
  },

  mapToMatchers: function(array) {
    return JsMockito.map(array, function(obj) {
      return JsMockito.toMatcher(obj);
    });
  },

  each: function(array, callback) {
    for (var i = 0; i < array.length; i++)
      callback(array[i], i);
  },

  map: function(array, callback) {
    var result = [];
    for (var i = 0; i < array.length; i++)
      result.push(callback(array[i], i));
    return result;
  },

  find: function(array, callback) {
    for (var i = 0; i < array.length; i++)
      if (callback(array[i], i))
        return array[i];
    return undefined;
  },

  any: function(array, callback) {
    return (this.find(array, callback) != undefined);
  },

  extend: function(dstObject, srcObject) {
    for (var prop in srcObject) {
      dstObject[prop] = srcObject[prop];
    }
    return dstObject;
  },

  verifier: function(name, proto) {
    JsMockito.verifiers[name] = function() {};
    JsMockito.verifiers[name].prototype = new JsMockito.Verifier;
    JsMockito.verifiers[name].prototype.constructor = JsMockito.verifiers[name];
    JsMockito.extend(JsMockito.verifiers[name].prototype, proto);
  }
};
