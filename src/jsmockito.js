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
    mockFunc._jsMockitoVerifier = function() {
      mockFunc._jsMockitoVerifier.apply(JsHamcrest.Matchers.anything(), 
        Array.prototype.slice.call(arguments, 0));
    };
    mockFunc._jsMockitoVerifier.call = function(matcher) {
      mockFunc._jsMockitoVerifier.apply(matcher,
        Array.prototype.slice.call(arguments, 1));
    };
    mockFunc._jsMockitoVerifier.apply = function(matcher, args) {
      args = [matcher].concat(args || []);
      var matchers = [];
      for (var i = 0; i < args.length; i++) {
        var matcher = args[i];
        if (!JsHamcrest.isMatcher(matcher))
          matcher = JsHamcrest.Matchers.equalTo(matcher);
        matchers.push(matcher);
      }

      for (var i = 0; i < interactions.length; i++) {
        for (var j = 0; j < matchers.length; j++) {
          if (!matchers[j].matches(interactions[i][j]))
            break;
        }
        if (j == matchers.length)
          break;
      }
      if (i != interactions.length) {
        interactions.splice(i,1);
        return;
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
    };
    return mockFunc;
  },

  verify: function(mock) {
    return mock._jsMockitoVerifier;
  }
};
