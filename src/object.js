// vi:ts=2 sw=2 expandtab

/**
 * Create a mockable and stubbable objects.
 *
 * <p>A mock is created with the constructor for an object, or a prototype
 * object, as an argument.  Once created, the mock object will have all the
 * same methods as the source object which, when invoked, will return undefined
 * by default.</p>
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
 * Alternatively, using a prototype:
 *
 * <pre>
 * myPrototype = {
 *   add: function(a, b) { return a + b }
 * };
 *
 * var mockObj = JsMockito.mock(myPrototype);
 * mockObj.add(5, 4); // result is undefined
 * </pre>
 *
 * @param Obj {function} the constructor for the object to be mocked
 * @return {object} a mock object
 */
JsMockito.mock = function(Obj, delegate) {
  delegate = delegate || {};

  var MockObject = function() { };
  try {
    MockObject.prototype = (typeof Obj === "function")? new Obj : Obj;
  } catch (e) {
    throw new Error("mocked constructor threw an exception (consider mocking an object instead of a constructor)");
  }
  MockObject.prototype.constructor = MockObject;

  var mockObject = new MockObject();
  var stubBuilders = {};
  var verifiers = {};
  var mockFunctions = [];

  var contextMatcher = JsHamcrest.Matchers.sameAs(mockObject);

  var addMockMethod = function(name) {
    var delegateMethod;
    if (delegate[name] != undefined) {
      delegateMethod = function() {
        var context = (this == mockObject)? delegate : this;
        return delegate[name].apply(context, arguments);
      };
    }
    var mockFunc = JsMockito.mockFunction('obj.' + name, delegateMethod);
    var desc = JsMockito.propertyDescriptor(mockObject, name);
    var enumerable = desc? desc.enumerable : true;

    JsMockito.defineProperty(mockObject, name, {
      enumerable: enumerable,
      writable: true,
      configurable: true,
      value: mockFunc
    });
    stubBuilders[name] = {
      enumerable: enumerable,
      value: mockFunc._jsMockitoStubBuilder
    };
    verifiers[name] = {
      enumerable: enumerable,
      value: mockFunc._jsMockitoVerifier
    };
    mockFunctions.push(mockFunc);
  };

  JsMockito.each(JsMockito.propertyNames(mockObject), function(name) {
    if (name != 'constructor' && typeof mockObject[name] === 'function')
      addMockMethod(name);
  });

  for (var typeName in JsMockito.nativeTypes) {
    if (mockObject instanceof JsMockito.nativeTypes[typeName].type) {
      JsMockito.each(JsMockito.nativeTypes[typeName].methods, function(method) {
        addMockMethod(method);
      });
    }
  }

  JsMockito.defineProperty(mockObject, '_jsMockitoStubBuilder', {
    enumerable: false,
    value: function() {
      var stubBuilderObj = new MockObject();
      JsMockito.eachObject(stubBuilders, function(desc, name) {
        JsMockito.overwriteProperty(stubBuilderObj, name, {
          enumerable: desc.enumerable,
          value: desc.value.call(this, contextMatcher)
        });
      });
      return stubBuilderObj;
    }
  });

  JsMockito.defineProperty(mockObject, '_jsMockitoVerifier', {
    enumerable: false,
    value: function(verifier) {
      var verifierObj = new MockObject();
      JsMockito.eachObject(verifiers, function(desc, name) {
        JsMockito.overwriteProperty(verifierObj, name, {
          enumerable: desc.enumerable,
          value: desc.value.call(this, verifier, contextMatcher)
        });
      });
      return verifierObj;
    }
  });

  JsMockito.defineProperty(mockObject, '_jsMockitoMockFunctions', {
    enumerable: false,
    value: function() {
      return mockFunctions;
    }
  });

  return mockObject;
};
JsMockito._export.push('mock');
