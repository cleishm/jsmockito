// vi:ts=2 sw=2 expandtab
Screw.Unit(function() {
  describe('JsMockito function mocking', function() {
    describe("when mock function invoked once with no arguments", function() { 
      var mockFunc;
      var scope;
      var result;
      before(function() {
        mockFunc = mockFunction();
        scope = this;
        result = mockFunc();
      });

      it("should return undefined", function() {
        assertThat(result, equalTo(undefined));
      });

      it("should verify mock function was invoked", function() {
        verify(mockFunc)();
      });

      it("should verify mock function was invoked with scope", function() {
        verify(mockFunc).call(scope);
      });

      it("should verify mock function was invoked with scope matcher", function() {
        verify(mockFunc).call(equalTo(scope));
      });

      it("should not verify function was invoked with different scope using call", function() {
        var exception;
        var testScope = {};
        try {
          verify(mockFunc).call(testScope);
        } catch (err) {
          exception = err;
        }
        assertThat(exception, not(nil()), "Exception not raised");
        assertThat(exception, equalTo(
          "Wanted but not invoked: func(), 'this' being equal to " + testScope));
      });

      it("should not verify function was invoked with different scope using apply", function() {
        var exception;
        var testScope = {};
        try {
          verify(mockFunc).apply(testScope);
        } catch (err) {
          exception = err;
        }
        assertThat(exception, not(nil()), "Exception not raised");
        assertThat(exception, equalTo(
          "Wanted but not invoked: func(), 'this' being equal to " + testScope));
      });

      it("should verify that mock function was not invoked twice", function() {
        verify(mockFunc)();
        var exception;
        try { 
          verify(mockFunc)();
        } catch (err) {
          exception = err;
        }
        assertThat(exception, not(nil()), "Exception not raised");
        assertThat(exception, equalTo(
          "Wanted but not invoked: func()"));
      });
    });

    describe("when mock function invoked twice with no arguments", function() { 
      var mockFunc;
      var scope;
      var results = [];
      before(function() {
        mockFunc = mockFunction();
        scope = this;
        results.push(mockFunc());
        results.push(mockFunc());
      });

      it("should return undefined each time", function() {
        assertThat(results, equalTo([undefined, undefined]));
      });

      it("should verify twice that mock function was invoked", function() {
        verify(mockFunc)();
        verify(mockFunc).call(scope);
      });
    });

    describe("when mock function invoked once with one argument", function() { 
      var mockFunc;
      var scope;
      var args = ['foo'];
      var result;
      before(function() {
        mockFunc = mockFunction();
        scope = this;
        result = mockFunc.apply(scope, args);
      });

      it("should return undefined", function() {
        assertThat(result, equalTo(undefined));
      });

      it("should verify mock function was invoked", function() {
        verify(mockFunc)();
      });

      it("should verify mock function was invoked with arg", function() {
        verify(mockFunc).apply(anything(), args);
      });

      it("should not verify function was invoked with different arg", function() {
        var exception;
        try { 
          verify(mockFunc).call(scope, 'bar');
        } catch (err) {
          exception = err;
        }
        assertThat(exception, not(nil()), "Exception not raised");
        assertThat(exception, equalTo(
          "Wanted but not invoked: func(<equal to \"bar\">), 'this' being equal to " + scope));
      });
    });

    describe("when mock function invoked once with multiple arguments", function() { 
      var mockFunc;
      var scope;
      var args = [1, 'test', {}];
      before(function() {
        mockFunc = mockFunction();
        scope = this;
        mockFunc.apply(scope, args);
      });

      it("should verify mock function was invoked", function() {
        verify(mockFunc)();
      });

      it("should verify mock function was invoked with all args the same", function() {
        verify(mockFunc).apply(scope, args);
      });

      it("should verify mock function was invoked with all args matching matchers", function() {
        verify(mockFunc)(anything(), anything(), anything());
      });

      it("should verify mock function was invoked using less matchers than args", function() {
        verify(mockFunc).call(anything(), args[0]);
      });

      it("should not verify function was invoked using more matchers than args", function() {
        var exception;
        try { 
          verify(mockFunc)(args[0], 'boo', {}, anything());
        } catch (err) {
          exception = err;
        }
        assertThat(exception, not(nil()), "Exception not raised");
        assertThat(exception, equalTo(
          "Wanted but not invoked: func(<equal to 1>, <equal to \"boo\">, <equal to " + args[2] + ">, <anything>)"));
      });

      it("should not verify function was invoked with args not matching matchers", function() {
        var exception;
        try { 
          verify(mockFunc)(args[0], 'boo', {});
        } catch (err) {
          exception = err;
        }
        assertThat(exception, not(nil()), "Exception not raised");
        assertThat(exception, equalTo(
          "Wanted but not invoked: func(<equal to 1>, <equal to \"boo\">, <equal to " + args[2] + ">)"));
      });
    });

    describe("when mock function is created with name", function() {
      var mockFunc;
      before(function() {
        mockFunc = mockFunction('myfunctor');
      });

      it("should use defined name in verification failures", function() {
        var exception;
        try { 
          verify(mockFunc)();
        } catch (err) {
          exception = err;
        }
        assertThat(exception, equalTo("Wanted but not invoked: myfunctor()"));
      });
    });

    describe("when mock function is created with a default scope", function() {
      var mockFunc;
      var defaultScope;
      before(function() {
        defaultScope = this;
        mockFunc = mockFunction(this);
      });

      describe("when stubbed without supplying scope", function() {
        before(function() {
          when(mockFunc)(1, 2).thenReturn('hello');
        });

        it("should apply to invocations with same scope different as default", function() {
          assertThat(mockFunc.call(defaultScope, 1, 2), equalTo('hello'));
        });

        it("should not apply to invocations with scope different from default", function() {
          assertThat(mockFunc.call({}, 1, 2), equalTo(undefined));
        });
      });

      describe("when invocked without supplying scope", function() {
        before(function() {
          mockFunc(1, 'hi');
        });

        it("should verify with no scope", function() {
          verify(mockFunc)(1, 'hi');
        });

        it("should verify with default scope", function() {
          verify(mockFunc).apply(defaultScope, [1, 'hi']);
        });

        it("should not verify with different scope", function() {
          var testScope = {};
          var exception;
          try { 
            verify(mockFunc).call(testScope, 1, 'hi');
          } catch (err) {
            exception = err;
          }
          assertThat(exception, equalTo(
            "Wanted but not invoked: func(<equal to 1>, <equal to \"hi\">), 'this' being equal to " + testScope));
        });
      });
    });

    describe("when mock function is created with name and default scope", function() {
      var mockFunc;
      var defaultScope;
      before(function() {
        defaultScope = this;
        mockFunc = mockFunction('myfunctor', this);
      });

      it("should use defined name in verification failures", function() {
        var exception;
        var testScope = {};
        try { 
          verify(mockFunc).call(testScope);
        } catch (err) {
          exception = err;
        }
        assertThat(exception, equalTo(
          "Wanted but not invoked: myfunctor(), 'this' being equal to " + testScope));
      });
    });

    describe("when mock function is stubbed with no arguments", function() {
      var mockFunc;
      before(function() {
        mockFunc = mockFunction();
      });

      describe("when no then clause applied", function() {
        before(function() {
          when(mockFunc)();
        });

        it("should return undefined", function() {
          assertThat(mockFunc(), equalTo(undefined));
        });
      });

      describe("when using 'then' and a function stub", function() {
        var stubScope;
        var stubArguments;
        before(function() {
          when(mockFunc)().then(function() {
            stubScope = this;
            stubArguments = arguments;
            return 'stub result';
          });
        });

        it("should return result of stub function", function() {
          assertThat(mockFunc(), equalTo('stub result'));
        });

        it("should invoke stub function when called", function() {
          mockFunc();
          assertThat(stubArguments, not(nil()));
        });

        it("should invoke stub function with the same scope", function() {
          var scope = this;
          mockFunc();
          assertThat(stubScope, equalTo(scope), "Scope was not the same");
        });

        it("should invoke stub function with the same arguments", function() {
          mockFunc('hello', undefined, 5);
          assertThat(stubArguments, equalTo(['hello', undefined, 5]));
        });
      });

      describe("when using 'thenReturn'", function() {
        before(function() {
          when(mockFunc)().thenReturn(42);
        });

        it("should return result of stub function", function() {
          assertThat(mockFunc(), equalTo(42));
        });
      });

      describe("when using 'thenThrow'", function() {
        var exception = {msg: 'test exception'};
        before(function() {
          when(mockFunc)().thenThrow(exception);
        });

        it("should return result of stub function", function() {
          var exception;
          try {
            mockFunc();
          } catch (err) {
            exception = err;
          }
          assertThat(exception, not(nil()), "Exception not thrown");
          assertThat(exception, equalTo(exception));
        });
      });
    });

    describe("when mock function is stubbed with multiple arguments", function() {
      var mockFunc;
      var stubInvoked = false;
      before(function() {
        mockFunc = mockFunction();
      });

      describe("when stubbing without scope matcher", function() {
        before(function() {
          when(mockFunc)('foo', lessThan(10), anything()).then(function() { stubInvoked = true; return 'stub result' });
        });

        it("should return result of stub function", function() {
          assertThat(mockFunc('foo', 9, {}), equalTo('stub result'));
        });

        it("should invoke stub function when called", function() {
          mockFunc.call({}, 'foo', 5, 'bar');
          assertThat(stubInvoked, truth());
        });

        it("should invoke stub even if additional arguments are present", function() {
          assertThat(mockFunc.apply({}, ['foo', 9, {}, 'something else']), equalTo('stub result'));
        });

        it("should return undefined if insufficent arguments compared to stub", function() {
          assertThat(mockFunc('foo', 9), equalTo(undefined));
        });

        it("should return undefined if arguments do not match", function() {
          assertThat(mockFunc('foo', 11, 'bar'), equalTo(undefined));
        });
      });

      describe("when stubbing with scope matcher via call", function() {
        var scope = {};
        before(function() {
          when(mockFunc).call(scope, 1).then(function() { stubInvoked = true; return 'stub result' });
        });

        it("should return result of stub function", function() {
          assertThat(mockFunc.call(scope, 1, 2), equalTo('stub result'));
        });

        it("should invoke stub function when called", function() {
          mockFunc.apply(scope, [1, 'fred']);
          assertThat(stubInvoked, truth());
        });
      });

      describe("when stubbing with scope matcher via apply", function() {
        var scope = {};
        before(function() {
          mockFunc = mockFunction();
          when(mockFunc).apply(scope, [1]).then(function() { stubInvoked = true; return 'stub result' });
        });

        it("should return result of stub function", function() {
          assertThat(mockFunc.call(scope, 1, 2), equalTo('stub result'));
        });

        it("should invoke stub function when called", function() {
          mockFunc.apply(scope, [1, 'fred']);
          assertThat(stubInvoked, truth());
        });
      });
    });

    describe("when mock function is stubbed multiple times using chained stubber", function() {
      var mockFunc;
      before(function() {
        mockFunc = mockFunction();
        when(mockFunc)('foo').then(function() { return 'func result' }).thenReturn('value result');
      });

      it("should return results of first stub first", function() {
        assertThat(mockFunc('foo'), equalTo('func result'));
      });

      it("should return results of second stub second", function() {
        mockFunc('foo');
        assertThat(mockFunc('foo'), equalTo('value result'));
      });

      it("should return results of last stub for subsequent invocations", function() {
        mockFunc('foo');
        mockFunc('foo');
        assertThat(mockFunc('foo'), equalTo('value result'));
        assertThat(mockFunc('foo'), equalTo('value result'));
      });
    });

    describe("when mock function is stubbed using multiple arguments to 'then' stubber", function() {
      var mockFunc;
      before(function() {
        mockFunc = mockFunction();
        when(mockFunc)('foo').then(
          function() { return 'func result 1' },
          function() { return 'func result 2' },
          function() { return 'func result 3' }
        );
      });

      it("should return results of first stub first", function() {
        assertThat(mockFunc('foo'), equalTo('func result 1'));
      });

      it("should return results of second stub second", function() {
        mockFunc('foo');
        assertThat(mockFunc('foo'), equalTo('func result 2'));
      });

      it("should return results of last stub for subsequent invocations", function() {
        mockFunc('foo');
        mockFunc('foo');
        assertThat(mockFunc('foo'), equalTo('func result 3'));
        assertThat(mockFunc('foo'), equalTo('func result 3'));
      });
    });

    describe("when mock function is stubbed using multiple arguments to 'thenReturn' stubber", function() {
      var mockFunc;
      before(function() {
        mockFunc = mockFunction();
        when(mockFunc)('foo').thenReturn('func result 1', 'func result 2', 'func result 3');
      });

      it("should return results of first stub first", function() {
        assertThat(mockFunc('foo'), equalTo('func result 1'));
      });

      it("should return results of second stub second", function() {
        mockFunc('foo');
        assertThat(mockFunc('foo'), equalTo('func result 2'));
      });

      it("should return results of last stub for subsequent invocations", function() {
        mockFunc('foo');
        mockFunc('foo');
        assertThat(mockFunc('foo'), equalTo('func result 3'));
        assertThat(mockFunc('foo'), equalTo('func result 3'));
      });
    });

    describe("when mock function is stubbed using multiple arguments to 'thenThrow' stubber", function() {
      var mockFunc;
      before(function() {
        mockFunc = mockFunction();
        when(mockFunc)('foo').thenThrow('ex 1', 'ex 2', 'ex 3');
      });

      it("should throw first exception first", function() {
        var exception;
        try { mockFunc('foo') } catch (ex) { exception = ex };
        assertThat(exception, equalTo('ex 1'));
      });

      it("should return results of second stub second", function() {
        try { mockFunc('foo') } catch (ex) { };
        var exception;
        try { mockFunc('foo') } catch (ex) { exception = ex };
        assertThat(exception, equalTo('ex 2'));
      });

      it("should return results of last stub for subsequent invocations", function() {
        try { mockFunc('foo') } catch (ex) { };
        try { mockFunc('foo') } catch (ex) { };
        var exception;
        try { mockFunc('foo') } catch (ex) { exception = ex };
        assertThat(exception, equalTo('ex 3'));
        try { mockFunc('foo') } catch (ex) { exception = ex };
        assertThat(exception, equalTo('ex 3'));
      });
    });
  });
});
