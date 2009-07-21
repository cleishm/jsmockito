// vi:ts=2 sw=2 expandtab

/**
 * Create a mockable and stubbable anonymous function.
 *
 * Once created, the function can be invoked and will return undefined
 * for any interactions that do not match stub declarations.
 *
 * <pre>
 * var mockFunc = JsMockito.mockFunction();
 * JsMockito.when(mockFunc).call(anything(), 1, 5).thenReturn(6);
 * mockFunc(1, 5); // result is 6
 * JsMockito.verify(mockFunc)(1, greaterThan(2));
 * </pre>
 *
 * @return {function} an anonymous function
 */
JsMockito.mockFunction = function() {
  var stubMatchers = []
  var interactions = [];

  var mockFunc = function() {
    var args = [this];
    args.push.apply(args, arguments);
    interactions.push(args);

    var stubMatcher = JsMockito.find(stubMatchers, function(stubMatcher) {
      return JsMockito.matchArray(stubMatcher[0], args);
    });
    if (stubMatcher == undefined)
      return undefined;
    var stubs = stubMatcher[1];
    if (stubs.length == 0)
      return undefined;
    var stub = stubs[0];
    if (stubs.length > 1)
      stubs.shift();
    return stub.apply(this, arguments);
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
        this.then.apply(this, JsMockito.map(arguments, function(value) {
          return function() { return value };
        }));
      },
      thenThrow: function(exception) {
        this.then.apply(this, JsMockito.map(arguments, function(value) {
          return function() { throw value };
        }));
      }
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
    JsMockito.each(matchers.splice(1), function(matcher, i) {
      if (i > 0)
        description.append(', ');
      description.append('<');
      matcher.describeTo(description);
      description.append('>');
    });
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
};
