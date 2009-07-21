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
    return !JsMockito.any(matchers, function(matcher, i) {
      return !matcher.matches(array[i]);
    });
  },

  mapToMatchers: function(array) {
    return JsMockito.map(array, function(matcher) {
      return JsHamcrest.isMatcher(matcher)? matcher :
        JsHamcrest.Matchers.equalTo(matcher);
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
  }
};
