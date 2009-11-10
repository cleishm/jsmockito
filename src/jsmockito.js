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
 *
 * <h2>Contents</h2>
 *
 * <ol>
 *  <li><a href="#1">Let's verify some behaviour!</a></li>
 *  <li><a href="#2">How about some stubbing?</a></li>
 *  <li><a href="#3">Matching Arguments</a></li>
 *  <li><a href="#4">Matching the context ('this')</a></li>
 *  <li><a href="#5">Verifying exact number of invocations / at least once /
 *  never</a></li>
 *  <li><a href="#6">Making sure invocations never happened on a mock</a></li>
 * </ol>
 *
 * <p>In the following examples object mocking is done with Array and String as
 * these are well understood, although you probably wouldn't mock these in
 * normal test development.</p>
 *
 * <h2><a name="1">1. Let's verify some behaviour!</a></h2>
 *
 * <p>For an object:</p>
 * <pre>
 * //mock creation
 * var mockedArray = mock(Array);
 *
 * //using mock object
 * mockedArray.push("one");
 * mockedArray.reverse();
 *
 * //verification
 * verify(mockedArray).push("one");
 * verify(mockedArray).reverse();
 * </pre>
 *
 * <p>For a function:</p>
 * <pre>
 * //mock creation
 * var mockedFunc = mockFunction();
 *
 * //using mock function
 * mockedFunc('hello world');
 * mockedFunc.call(this, 'foobar');
 * mockedFunc.apply(this, [ 'barfoo' ]);
 *
 * //verification
 * verify(mockedFunc)('hello world');
 * verify(mockedFunc)('foobar');
 * verify(mockedFunc)('barfoo');
 * </pre>
 *
 * <p>Once created a mock will remember all interactions.  Then you selectively
 * verify whatever interactions you are interested in.</p>
 *
 * <h2><a name="2">2. How about some stubbing?</a></h2>
 *
 * <p>For an object:</p>
 * <pre>
 * var mockedString = mock(String);
 *
 * //stubbing
 * when(mockedString).charAt(0).thenReturn('f');
 * when(mockedString).charAt(1).thenThrow('An exception');
 *
 * //following alerts "f"
 * alert(mockedString.charAt(0));
 *
 * //following throws exception 'An exception'
 * mockedString.charAt(1);
 *
 * //following alerts "undefined" as charAt(999) was not stubbed
 * alert(typeof (mockedString.charAt(999)));
 *
 * //can also verify a stubbed invocation, although this is usually redundant
 * verify(mockedString).charAt(0);
 * </pre>
 *
 * <p>For a function:</p>
 * <pre>
 * var mockedFunc = mockFunction();
 *
 * //stubbing
 * when(mockedFunc)(0).thenReturn('f');
 * when(mockedFunc)(1).thenThrow('An exception');
 *
 * //following alerts "f"
 * alert(mockedFunc(0));
 *
 * //following throws exception 'An exception'
 * mockedFunc(1);
 *
 * //following alerts "undefined" as charAt(999) was not stubbed
 * alert(typeof (mockedFunc(999)));
 *
 * //can also verify a stubbed invocation, although this is usually redundant
 * verify(mockedFunc)(0);
 * </pre>
 *
 * <h2><a name="3">3. Matching Arguments</a></h2>
 *
 * <p>JsMockito verifiers arguments using 
 * <a href="http://jshamcrest.destaquenet.com/">JsHamcrest</a> matchers.  If
 * the argument provided during verification/stubbing is not a JsHamcrest
 * matcher, then 'equalTo(arg)' is used instead.</p>
 *
 * <pre>
 * var mockedString = mock(String);
 * var mockedFunc = mockFunction();
 *
 * //stubbing using JsHamcrest
 * when(mockedString).charAt(lessThan(10)).thenReturn('f');
 * when(mockedFunc)(containsString('world')).thenReturn('foobar');
 *
 * //following alerts "f"
 * alert(mockedString.charAt(5));
 *
 * //following alerts "foobar"
 * alert(mockedFunc('hello world'));
 *
 * //you can also use matchers in verification
 * verify(mockedString).charAt(greaterThan(4));
 * verify(mockedFunc)(equalTo('hello world'));
 * </pre>
 */
JsMockito = {
  /**
   * Library version,
   */
  version: '@VERSION',

  _export: ['isMock', 'when', 'verify', 'verifyZeroInteractions', 'spy'],

  /**
   * Test if a given variable is a mock
   *
   * @return {boolean} true if the variable is a mock
   */
  isMock: function(maybeMock) {
    return typeof maybeMock._jsMockitoVerifier != 'undefined';
  },

  /**
   * Add a stub for a mock object method or mock function
   *
   * @param mock A mock object or mock anonymous function
   * @return {object or function} A stub builder on which the method or
   * function to be stubbed can be invoked
   */
  when: function(mock) {
    return mock._jsMockitoStubBuilder();
  },

  /**
   * Verify that a mock object method or mock function was invoked
   *
   * @param mock A mock object or mock anonymous function
   * @return {object or function} A verifier on which the method or function to
   *   be verified can be invoked
   */
  verify: function(mock, verifier) {
    return (verifier || JsMockito.Verifiers.once()).verify(mock);
  },

  /**
   * Verify that no mock object methods or the mock function was never invoked
   *
   * @param mock A mock object or mock anonymous function
   */
  verifyZeroInteractions: function(mock) {
    JsMockito.Verifiers.zeroInteractions().verify(mock);
  },

  /**
   * Create a mock that proxies a real function or object.  All un-stubbed
   * invocations will be passed through to the real implementation, but can
   * still be verified.
   *
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
