// vi:ts=2 sw=2 expandtab

/**
 * Create a mockable and stubbable objects.
 *
 * A mock is created with the constructor for an object as an argument.  Once
 * created, the mock object will have all the same methods as the source object
 * which, when invoked, will return undefined by default.
 *
 * Stub declarations may then be made for these methods to have them return
 * useful values or perform actions when invoked.
 *
 * <pre>
 * MyObject = function() {
 *   this.add = function(a, b) { return a + b }
 * };
 *
 * var mockObj = JsMockito.mock(MyObject);
 * mockFunc(5, 4); // result is undefined
 *
 * JsMockito.when(mockFunc).add(1, 2).thenReturn(6);
 * mockFunc(1, 2); // result is 6
 *
 * JsMockito.verify(mockFunc)(1, greaterThan(2)); // ok
 * JsMockito.verify(mockFunc)(1, equalTo(2)); // ok
 * JsMockito.verify(mockFunc)(1, 4); // will throw an exception
 * </pre>
 *
 * @param Obj {function} the constructor for the object to be mocked
 * @return {object} a mock object
 */
JsMockito.mock = function(Obj) {
  var MockObject = function() { };
  MockObject.prototype = new Obj;
  MockObject.prototype.constructor = MockObject;

  var mockObject = new MockObject();
  var stubBuilders = {};
  var verifiers = {};
  
  var contextMatcher = JsHamcrest.Matchers.equalTo(mockObject);

  for (var name in mockObject) (function(name) {
    if (name == 'constructor')
      return;
    mockObject[name] = JsMockito.mockFunction('obj.' + name, mockObject);
    stubBuilders[name] = mockObject[name]._jsMockitoStubBuilder;
    verifiers[name] = mockObject[name]._jsMockitoVerifier;
  })(name);

  mockObject._jsMockitoStubBuilder = function() {
    var delegateArgs = [contextMatcher].concat(
      Array.prototype.slice.call(arguments, 1));

    var stubBuilderObject = new MockObject();
    for (var name in stubBuilders) {
      stubBuilderObject[name] = stubBuilders[name].apply(this, delegateArgs);
    }
    return stubBuilderObject;
  }

  mockObject._jsMockitoVerifier = function() {
    var delegateArgs = [contextMatcher].concat(
      Array.prototype.slice.call(arguments, 1));

    var verifierObject = new MockObject();
    for (var name in verifiers) {
      verifierObject[name] = verifiers[name].apply(this, delegateArgs);
    }
    return verifierObject;
  }

  return mockObject;
};
