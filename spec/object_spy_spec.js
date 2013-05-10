// vi:ts=2 sw=2 expandtab
Screw.Unit(function() {
  describe('JsMockito object spy', function() {
    var MyObject = function() {
      this.greeting = function() { return "hello" };
      this.farewell = function() { return "goodbye" };
    };

    var mockObj;
    var proxyMock;
    before(function() {
      mockObj = mock(MyObject);
      mockObj.property = "foo";
      proxyMock = spy(mockObj);
    });

    describe("when created", function() {
      it("should copy properties", function() {
        assertThat(proxyMock.property, equalTo(mockObj.property));
      });
    });

    describe("when method invoked", function() {
      before(function() {
        proxyMock.greeting(21);
      });

      it("should invoke method on proxied object", function() {
        verify(mockObj).greeting(21);
      });

      it("should invoke method on proxied object with delegate as scope", function() {
        verify(mockObj).greeting.call(mockObj, 21);
      });
    });

    describe("when method invoked with explicit scope", function() {
      var scope;
      before(function() {
        scope = {};
        proxyMock.greeting.call(scope, 'foo');
      });

      it("should invoke method on proxied object with explicit scope", function() {
        verify(mockObj).greeting.apply(scope, [ 'foo' ]);
      });
    });

    describe("when method stubbed", function() {
      before(function() {
        when(proxyMock).greeting('hello').thenReturn('world');
      });

      describe("when method invoked with arguments matching stub", function() {
        var result;
        before(function() {
          result = proxyMock.greeting('hello');
        });

        it("should return result of stub", function() {
          assertThat(result, equalTo('world'));
        });

        it("should not invoke the proxied object method", function() {
          verifyZeroInteractions(mockObj);
        });
      });

      describe("when method invoked with arguments not matching stub", function() {
        before(function() {
          proxyMock.greeting('foo');
        });

        it("should invoke the proxied function", function() {
          verify(mockObj).greeting('foo');
        });
      });

      describe("when different method is invoked", function() {
        before(function() {
          proxyMock.farewell('hello');
        });

        it("should invoke the proxied function", function() {
          verify(mockObj).farewell('hello');
        });
      });
    });

    describe("when spying on a constructor", function() {
      MyObject.prototype = {
        foo: function() { return "bar" }
      };

      var proxyConstructor;
      before(function() {
        ProxyObject = spy(MyObject);
      });

      it("should construct objects correctly", function() {
        var obj = new ProxyObject(1);
        obj.foo();
        verify(ProxyObject)(1);
      });
    });
  });
});
