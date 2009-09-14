// vi:ts=2 sw=2 expandtab

/**
 * Create a mockable and stubbable objects.
 *
 * <p>A mock is created with the constructor for an object as an argument.
 * Once created, the mock object will have all the same methods as the source
 * object which, when invoked, will return undefined by default.</p>
 *
 * <p>Stub declarations may then be made for these methods to have them return
 * useful values or perform actions when invoked.</p>
 *
 * <pre>
 * MyObject = function() {
 *   this.add = function(a, b) { return a + b }
 * };
 *
 * var mockObj = JsMockito.mock(MyObject);
 * mockObj.add(5, 4); // result is undefined
 *
 * JsMockito.when(mockFunc).add(1, 2).thenReturn(6);
 * mockObj.add(1, 2); // result is 6
 *
 * JsMockito.verify(mockObj).add(1, greaterThan(2)); // ok
 * JsMockito.verify(mockObj).add(1, equalTo(2)); // ok
 * JsMockito.verify(mockObj).add(1, 4); // will throw an exception
 * </pre>
 *
 * @param Obj {function} the constructor for the object to be mocked
 * @return {object} a mock object
 */
JsMockito.mock = function(Obj) {
  var delegate = {};
  if (typeof Obj != "function") {
    delegate = Obj;
    Obj = function() { };
    Obj.prototype = delegate; 
    Obj.prototype.constructor = Obj;
  }
  var MockObject = function() { };
  MockObject.prototype = new Obj;
  MockObject.prototype.constructor = MockObject;

  var mockObject = new MockObject();
  var stubBuilders = {};
  var verifiers = {};
  
  var contextMatcher = JsHamcrest.Matchers.equalTo(mockObject);

  var addMockMethod = function(name) {
    var delegateMethod;
    if (delegate[name] != undefined) {
      delegateMethod = function() {
        var scope = (this == mockObject)? delegate : this;
        return delegate[name].apply(scope, arguments);
      };
    }
    mockObject[name] = JsMockito.mockFunction('obj.' + name, delegateMethod);
    stubBuilders[name] = mockObject[name]._jsMockitoStubBuilder;
    verifiers[name] = mockObject[name]._jsMockitoVerifier;
  };

  for (var methodName in mockObject) {
    if (methodName != 'constructor')
      addMockMethod(methodName);
  }

  for (var typeName in JsMockito.nativeTypes) {
    if (mockObject instanceof JsMockito.nativeTypes[typeName].type) {
      for (var i = 0; i < JsMockito.nativeTypes[typeName].methods.length; ++i) {
        addMockMethod(JsMockito.nativeTypes[typeName].methods[i]);
      }
    }
  }

  mockObject._jsMockitoStubBuilder = function() {
    var delegateArgs = [contextMatcher].concat(
      Array.prototype.slice.call(arguments, 1));

    var stubBuilderObject = new MockObject();
    for (var name in stubBuilders) {
      stubBuilderObject[name] = stubBuilders[name].apply(this, delegateArgs);
    }
    return stubBuilderObject;
  };

  mockObject._jsMockitoVerifier = function() {
    var delegateArgs = [contextMatcher].concat(
      Array.prototype.slice.call(arguments, 1));

    var verifierObject = new MockObject();
    for (var name in verifiers) {
      verifierObject[name] = verifiers[name].apply(this, delegateArgs);
    }
    return verifierObject;
  };

  mockObject._jsMockitoMockFunctions = function() {
    return JsMockito.map(mockObject, function(func) {
      return JsMockito.isMock(func)? func : null;
    });
  };

  return mockObject;
};
JsMockito._export.push('mock');
