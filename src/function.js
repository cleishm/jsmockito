// vi:ts=2 sw=2 expandtab

/**
 * Create a mockable and stubbable anonymous function.
 *
 * <p>Once created, the function can be invoked and will return undefined for
 * any interactions that do not match stub declarations.</p>
 *
 * <pre>
 * var mockFunc = JsMockito.mockFunction();
 * JsMockito.when(mockFunc).call(anything(), 1, 5).thenReturn(6);
 * mockFunc(1, 5); // result is 6
 * JsMockito.verify(mockFunc)(1, greaterThan(2));
 * </pre>
 *
 * @param funcName {string} The name of the mock function to use in messages
 *   (defaults to 'func')
 * @param delegate {function} The function to delegate unstubbed calls to
 *   (optional)
 * @return {function} an anonymous function
 */
JsMockito.mockFunction = function(funcName, delegate) {
  if (typeof funcName == 'function') {
    delegate = funcName;
    funcName = undefined;
  }
  funcName = funcName || 'func';
  delegate = delegate || function() { };

  var stubMatchers = []
  var interactions = [];

  var mockFunc = function() {
    var args = [this];
    args.push.apply(args, arguments);
    interactions.push({args: args});

    var stubMatcher = JsMockito.find(stubMatchers, function(stubMatcher) {
      return JsMockito.matchArray(stubMatcher[0], args);
    });
    if (stubMatcher == undefined)
      return delegate.apply(this, arguments);
    var stubs = stubMatcher[1];
    if (stubs.length == 0)
      return undefined;
    var stub = stubs[0];
    if (stubs.length > 1)
      stubs.shift();
    return stub.apply(this, arguments);
  };

  mockFunc.prototype = delegate.prototype;

  JsMockito.defineProperty(mockFunc, '_jsMockitoStubBuilder', {
    enumerable: false,
    value: function(contextMatcher) {
      var contextMatcher = contextMatcher || JsHamcrest.Matchers.anything();
      return matcherCaptureFunction(contextMatcher, function(matchers) {
        var stubMatch = [matchers, []];
        stubMatchers.unshift(stubMatch);
        return {
          then: function() {
            stubMatch[1].push.apply(stubMatch[1], arguments);
            return this;
          },
          thenReturn: function() {
            return this.then.apply(this,JsMockito.map(arguments, function(value) {
              return function() { return value };
            }));
          },
          thenThrow: function(exception) {
            return this.then.apply(this,JsMockito.map(arguments, function(value) {
              return function() { throw value };
            }));
          }
        };
      });
    }
  });

  JsMockito.defineProperty(mockFunc, '_jsMockitoVerifier', {
    enumerable: false,
    value: function(verifier, contextMatcher) {
      var contextMatcher = contextMatcher || JsHamcrest.Matchers.anything();
      return matcherCaptureFunction(contextMatcher, function(matchers) {
        return verifier(funcName, interactions, matchers, matchers[0] != contextMatcher);
      });
    }
  });

  JsMockito.defineProperty(mockFunc, '_jsMockitoMockFunctions', {
    enumerable: false,
    value: function() {
      return [ mockFunc ];
    }
  });

  return mockFunc;

  function matcherCaptureFunction(contextMatcher, handler) {
    return JsMockito.contextCaptureFunction(contextMatcher,
      function(context, args) {
        var matchers = JsMockito.mapToMatchers([context].concat(args || []));
        return handler(matchers);
      }
    );
  };
};
JsMockito._export.push('mockFunction');
