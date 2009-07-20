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
