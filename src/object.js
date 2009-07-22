// vi:ts=2 sw=2 expandtab

/**
 * Create a mockable and stubbable objects.
 *
 * <pre>
 * </pre>
 *
 * @return {function} an mock object
 */
JsMockito.mock = function(Obj) {
  var MockObject = function() { };
  MockObject.prototype = new Obj;
  MockObject.prototype.constructor = MockObject;

  var mockObject = new MockObject();
  mockObject._jsMockitoVerifier = {};

  for (var name in mockObject) (function(name) {
    if (name == 'constructor')
      return;
    mockObject[name] = JsMockito.mockFunction('obj.' + name, mockObject);
    mockObject._jsMockitoVerifier[name] = mockObject[name]._jsMockitoVerifier;
  })(name);

  return mockObject;
};
