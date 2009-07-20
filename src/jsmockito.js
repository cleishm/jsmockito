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
    var stubMatchers = []
    var interactions = [];

    var mockFunc = function() {
      var args = [this];
      args.push.apply(args, arguments);
      interactions.push(args);

      for (var i = 0; i < stubMatchers.length; i++) {
        if (JsMockito.matchArray(stubMatchers[i][0], args)) {
          var stubs = stubMatchers[i][1];
          var stub = stubs[0];
          if (stubs.length > 1)
            stubs.shift();
          return stub.apply(this, arguments);
        }
      }
      return undefined;
    };

    mockFunc._jsMockitoStubBuilder = matcherCaptureFunction(function(matchers) {
      var stubMatch = [matchers, []];
      stubMatchers.push(stubMatch);
      return {
        then: function() {
          stubMatch[1].push.apply(stubMatch[1], arguments);
          return this;
        },
        thenReturn: function() {
          var funcs = [];
          var args = arguments;
          for (var i = 0; i < args.length; i++) (function() {
            var value = args[i];
            funcs.push(function() { return value });
          })();
          this.then.apply(this, funcs);
        },
        thenThrow: function(exception) { this.then(function() { throw exception }) }
      };
    });

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
        return captureFunction.apply(JsHamcrest.Matchers.anything(), 
          Array.prototype.slice.call(arguments, 0));
      };
      captureFunction.call = function(scope) {
        return captureFunction.apply(scope,
          Array.prototype.slice.call(arguments, 1));
      };
      captureFunction.apply = function(scope, args) {
        var matchers = JsMockito.mapToMatchers([scope].concat(args || []));
        return handler(matchers);
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
    if (matchers.length > array.length)
      return false;
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
