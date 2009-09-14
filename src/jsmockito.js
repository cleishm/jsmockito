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

  _export: ['isMock', 'when', 'verify', 'verifyZeroInteractions', 'spy'],

  /**
   * Test if a given variable is a mock
   * @return {boolean} true if the variable is a mock
   */
  isMock: function(maybeMock) {
    return typeof maybeMock._jsMockitoVerifier != 'undefined';
  },

  /**
   * Add a stub for a mock object method or mock function
   * @param mock A mock object or mock anonymous function
   * @return {object or function} A stub builder on which the method or
   * function to be stubbed can be invoked
   */
  when: function(mock) {
    return mock._jsMockitoStubBuilder(JsHamcrest.Matchers.anything());
  },

  /**
   * Verify that a mock object method or mock function was invoked
   * @param mock A mock object or mock anonymous function
   * @return {object or function} A verifier on which the method or function to
   *   be verified can be invoked
   */
  verify: function(mock, verifier) {
    return (verifier || JsMockito.Verifiers.once()).verify(mock);
  },

  /**
   * Verify that no mock object methods or the mock function was never invoked
   * @param mock A mock object or mock anonymous function
   */
  verifyZeroInteractions: function(mock) {
    JsMockito.Verifiers.zeroInteractions().verify(mock);
  },

  /**
   * Create a mock that proxies a real function or object.  All un-stubbed
   * invocations will be passed through to the real implementation, but can
   * still be verified.
   * @param {object or function} delegate A 'real' (concrete) object or
   * function that the mock will delegate unstubbed invocations to
   * @return {object or function} A mock object (as per mock) or mock function
   * (as per mockFunction)
   */
  spy: function(delegate) {
    return (typeof delegate == 'function')?
      JsMockito.mockFunction(delegate) : JsMockito.mock(delegate);
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
    if (array.length == undefined) {
      for (var key in array)
        callback(array[key], key);
    } else {
      for (var i = 0; i < array.length; i++)
        callback(array[i], i);
    }
  },

  map: function(array, callback) {
    var result = [];
    JsMockito.each(array, function(elem, key) {
      var val = callback(elem, key);
      if (val != null)
        result.push(val);
    });
    return result;
  },

  grep: function(array, callback) {
    var result = [];
    JsMockito.each(array, function(elem, key) {
      if (callback(elem, key))
        result.push(elem);
    });
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
    JsMockito.Verifiers[name] = function() { JsMockito.Verifier.apply(this, arguments) };
    JsMockito.Verifiers[name].prototype = new JsMockito.Verifier;
    JsMockito.Verifiers[name].prototype.constructor = JsMockito.Verifiers[name];
    JsMockito.extend(JsMockito.Verifiers[name].prototype, proto);
  }
};
