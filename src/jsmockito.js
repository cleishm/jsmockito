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
 * @fileOverview Provides the main namespace, along with core abstractions
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

  mockFunction: function() {
    var interactions = [];

    var mockFunc = function() {
      var args = Array.prototype.slice.call(arguments, 0);
      interactions.push([this].concat(args));
    };

    mockFunc._jsMockitoVerifier = matcherCaptureFunction(function(matchers) {
      for (var i = 0; i < interactions.length; i++) {
        if (JsMockito.matchArray(matchers, interactions[i])) {
          interactions.splice(i,1);
          return;
        }
      }
      var description = new JsHamcrest.Description();
      description.append('Wanted but not invoked: func(');
      for (var i = 1; i < matchers.length; i++) {
        if (i > 1)
          description.append(', ');
        description.append('<');
        matchers[i].describeTo(description);
        description.append('>');
      }
      description.append("), 'this' being ");
      matchers[0].describeTo(description);
      throw description.get();
    });

    return mockFunc;

    function matcherCaptureFunction(handler) {
      // generate a function with overridden 'call' and 'apply' methods
      // to capture 'this' as a matcher for these cases
      var captureFunction = function() {
        captureFunction.apply(JsHamcrest.Matchers.anything(), 
          Array.prototype.slice.call(arguments, 0));
      };
      captureFunction.call = function(scope) {
        captureFunction.apply(scope,
          Array.prototype.slice.call(arguments, 1));
      };
      captureFunction.apply = function(scope, args) {
        var matchers = JsMockito.mapToMatchers([scope].concat(args || []));
        handler(matchers);
      };
      return captureFunction;
    };
  },

  when: function(mock) {
    return mock._jsMockitoStubBuilder;
  },

  verify: function(mock) {
    return mock._jsMockitoVerifier;
  },

  matchArray: function(matchers, array) {
    for (var i = 0; i < matchers.length; i++) {
      if (!matchers[i].matches(array[i]))
        return false;
    }
    return true;
  },

  mapToMatchers: function(array) {
    var matchers = [];
    for (var i = 0; i < array.length; i++) {
      var matcher = array[i];
      if (!JsHamcrest.isMatcher(matcher))
        matcher = JsHamcrest.Matchers.equalTo(matcher);
      matchers.push(matcher);
    }
    return matchers;
  }
};
