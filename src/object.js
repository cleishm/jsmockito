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
  var mockObject = createMockObject();
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
    mockObject[name] = mockFunc;
    stubBuilders[name] = mockFunc._jsMockitoStubBuilder;
    verifiers[name] = mockFunc._jsMockitoVerifier;
    mockFunctions.push(mockFunc);
  };

  for (var methodName in mockObject) {
    if (methodName != 'constructor')
      addMockMethod(methodName);
  }

  for (var typeName in JsMockito.nativeTypes) {
    if (mockObject instanceof JsMockito.nativeTypes[typeName].type) {
      JsMockito.each(JsMockito.nativeTypes[typeName].methods, function(method) {
        addMockMethod(method);
      });
    }
  }

  mockObject._jsMockitoStubBuilder = function() {
    return JsMockito.mapInto(new MockObject(), stubBuilders, function(method) {
      return method.call(this, contextMatcher);
    });
  };

  mockObject._jsMockitoVerifier = function(verifier) {
    return JsMockito.mapInto(new MockObject(), verifiers, function(method) {
      return method.call(this, verifier, contextMatcher);
    });
  };

  mockObject._jsMockitoMockFunctions = function() {
    return mockFunctions;
  };
  
  function getDescriptors(mockObject, descriptors) {
    for(var methodName in mockObject) {
      descriptors[methodName] = { enumerable: true, configurable: true, writable: true, value: null };
    }
    return descriptors;
  }
  
  function createMockObject() {
	
    if(Object.create) {
	  var objectToExtend = Obj.prototype ? Obj.prototype : Obj;
	  var descriptors = getDescriptors(objectToExtend, getDescriptorsAddedInConstructor());
      MockObject.prototype = Object.create(objectToExtend, descriptors);
     
      if(!MockObject.prototype.constructor) {
        MockObject.prototype.constructor = MockObject;
      }
    } else {
      MockObject.prototype = (typeof Obj === "function")? new Obj : Obj;
      MockObject.prototype.constructor = MockObject;
    }

    return new MockObject();
  };
  
  //object_spy_spec adds method in the constructor so we have to gather those.
  function getDescriptorsAddedInConstructor() {
    var descriptorsAddedInConstructor = {};
	
    try {
      var objectToMock = new Obj();
	
      for(methodName in objectToMock) {
        if(!Obj.prototype[methodName]) {
          descriptorsAddedInConstructor[methodName] = { enumerable: true, configurable: true, writable: true, value: null };
        }
      }
    } catch (e) {/*Constructors may throw an error if called with no arguments*/}
    
    return descriptorsAddedInConstructor;
  };

  return mockObject;
};
JsMockito._export.push('mock');
