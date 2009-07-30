// vi:ts=2 sw=2 expandtab
Screw.Unit(function() {
  describe('JsMockito function mocking', function() {
    var mockFunc;
    before(function() {
      mockFunc = mockFunction();
    });

    describe("#invocation", function() {
      it("should return undefined", function() {
        assertThat(mockFunc(), sameAs(undefined));
      });

      it("should return undefined when given arguments", function() {
        assertThat(mockFunc(1, 'foo'), sameAs(undefined));
      });

      it("should return undefined multiple times", function() {
        assertThat(mockFunc(), sameAs(undefined));
        assertThat(mockFunc(), sameAs(undefined));
      });
    });

    describe("#verify", function() {
      describe("when never invoked", function() {
        it("should not verify that the mock function was invoked", function() {
          var exception;
          try { 
            verify(mockFunc)();
          } catch (err) {
            exception = err;
          }
          assertThat(exception, not(nil()), "Exception not raised");
          assertThat(exception, equalTo("Wanted but not invoked: func()"));
        });

/*
        it("should verify that the mock function was never invoked", function() {
          verify(mockFunc, never())();
        });

        it("should verify that mock function had zero interactions", function() {
          verifyZeroInteractions(mockFunc);
        });
*/
      });

      describe("when mock function invoked once with no arguments", function() { 
        var context;
        before(function() {
          context = this;
          mockFunc();
        });

        it("should verify mock function was invoked", function() {
          verify(mockFunc)();
        });

        it("should verify mock function was invoked with context", function() {
          verify(mockFunc).call(context);
        });

        it("should verify mock function was invoked with context matcher", function() {
          verify(mockFunc).call(sameAs(context));
        });

        it("should verify multiple times that mock function was invoked", function() {
          verify(mockFunc)();
          verify(mockFunc)();
          verify(mockFunc).call(context);
          verify(mockFunc).apply(context, []);
        });

        it("should not verify function was invoked with different context using call", function() {
          var exception;
          var testContext = {};
          try {
            verify(mockFunc).call(testContext);
          } catch (err) {
            exception = err;
          }
          assertThat(exception, not(nil()), "Exception not raised");
          assertThat(exception, equalTo(
            "Wanted but not invoked: func(), 'this' being equal to " + testContext));
        });

        it("should not verify function was invoked with different context using apply", function() {
          var exception;
          var testContext = {};
          try {
            verify(mockFunc).apply(testContext);
          } catch (err) {
            exception = err;
          }
          assertThat(exception, not(nil()), "Exception not raised");
          assertThat(exception, equalTo(
            "Wanted but not invoked: func(), 'this' being equal to " + testContext));
        });

        it("should not verify function was invoked with arguments", function() {
          var exception;
          try { 
            verify(mockFunc)('bar');
          } catch (err) {
            exception = err;
          }
          assertThat(exception, not(nil()), "Exception not raised");
          assertThat(exception, equalTo(
            "Wanted but not invoked: func(<equal to \"bar\">)"));
        });

        it("should not verify function was invoked with arguments using a matcher", function() {
          var exception;
          try { 
            verify(mockFunc)(lessThan(10));
          } catch (err) {
            exception = err;
          }
          assertThat(exception, not(nil()), "Exception not raised");
          assertThat(exception, equalTo(
            "Wanted but not invoked: func(<less than 10>)"));
        });

        it("should not verify function was invoked when additional arguments are undefined", function() {
          var exception;
          try { 
            verify(mockFunc)(undefined);
          } catch (err) {
            exception = err;
          }
          assertThat(exception, not(nil()), "Exception not raised");
          assertThat(exception, equalTo(
            "Wanted but not invoked: func(<equal to undefined>)"));
        });

        it("should not verify function was invoked when additional arguments are anything", function() {
          var exception;
          try { 
            verify(mockFunc)(anything());
          } catch (err) {
            exception = err;
          }
          assertThat(exception, not(nil()), "Exception not raised");
          assertThat(exception, equalTo(
            "Wanted but not invoked: func(<anything>)"));
        });

/*
        it("should not verify that the mock function was invoked more than once", function() {
          var exception;
          try { 
            verify(mockFunc, times(2))();
          } catch (err) {
            exception = err;
          }
          assertThat(exception, not(nil()), "Exception not raised");
          assertThat(exception, equalTo("Wanted but not invoked: func()"));
        });

        it("should verify that the mock function was never invoked with arguments", function() {
          verify(mockFunc, never())('summer', 69);
          verify(mockFunc, never())(lessThan(100));
          verify(mockFunc, never())(anything());
        });

        it("should not verify that the mock function had zero interactions", function() {
          var exception;
          try { 
            verifyZeroInteractions(mockFunc);
          } catch (err) {
            exception = err;
          }
          assertThat(exception, not(nil()), "Exception not raised");
          assertThat(exception, equalTo("Wanted but not invoked: func()"));
        });
*/
      });

/*
      describe("when mock function invoked twice with no arguments", function() { 
        var context;
        before(function() {
          context = this;
          mockFunc();
          mockFunc();
        });

        it("should not verify that the mock function was invoked more once", function() {
          var exception;
          try { 
            verify(mockFunc)();
          } catch (err) {
            exception = err;
          }
          assertThat(exception, not(nil()), "Exception not raised");
          assertThat(exception, equalTo("func() - invoked 2 times wanted 1 time"));
        });

        it("should verify that mock function was invoked twice", function() {
          verify(mockFunc, times(2))();
        });

        it("should not verify that the mock function was invoked more than twice", function() {
          var exception;
          try { 
            verify(mockFunc, times(3))();
          } catch (err) {
            exception = err;
          }
          assertThat(exception, not(nil()), "Exception not raised");
          assertThat(exception, equalTo("func() - invoked 2 times wanted 3 times"));
        });
      });
*/

      describe("when mock function invoked once with one argument", function() { 
        var context;
        before(function() {
          context = this;
          mockFunc.apply(context, ['foo']);
        });

        it("should verify mock function was invoked", function() {
          verify(mockFunc)();
        });

        it("should verify mock function was invoked with arg", function() {
          verify(mockFunc).apply(anything(), ['foo']);
          verify(mockFunc).call(context, 'foo');
          verify(mockFunc)(startsWith('f'));
        });

        it("should not verify function was invoked with different arg", function() {
          var exception;
          try { 
            verify(mockFunc).call(context, 'bar');
          } catch (err) {
            exception = err;
          }
          assertThat(exception, not(nil()), "Exception not raised");
          assertThat(exception, equalTo(
            "Wanted but not invoked: func(<equal to \"bar\">), 'this' being equal to " + context));
        });
      });

      describe("when mock function invoked once with multiple arguments", function() { 
        var context;
        var args = [1, 'test', {}];
        before(function() {
          context = this;
          mockFunc.apply(context, args);
        });

        it("should verify mock function was invoked", function() {
          verify(mockFunc)();
        });

        it("should verify mock function was invoked with all args the same", function() {
          verify(mockFunc).apply(context, args);
        });

        it("should verify mock function was invoked with all args matching matchers", function() {
          verify(mockFunc)(greaterThan(0), startsWith('te'), anything());
        });

        it("should verify mock function was invoked using less matchers than args", function() {
          verify(mockFunc)(anything());
          verify(mockFunc).call(anything(), args[0]);
          verify(mockFunc).apply(context, [ lessThan(2) ]);
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
    });

    describe("#when", function() {
      describe("when mock function is stubbed with no arguments", function() {
        describe("when no then clause applied", function() {
          before(function() {
            when(mockFunc)();
          });

          it("should return undefined", function() {
            assertThat(mockFunc(), sameAs(undefined));
          });
        });

        describe("when using 'then' and a function stub", function() {
          var stubContext;
          var stubArguments;
          before(function() {
            when(mockFunc)().then(function() {
              stubContext = this;
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

          it("should invoke stub function with the same default context", function() {
            var context = this;
            mockFunc();
            assertThat(stubContext, sameAs(context), "Context was not the same");
          });

          it("should invoke stub function with the same explicit context", function() {
            var context = {};
            mockFunc.call(context, 1, 'foo');
            assertThat(stubContext, sameAs(context), "Context was not the same");
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
            var thrownException;
            try {
              mockFunc();
            } catch (err) {
              thrownException = err;
            }
            assertThat(thrownException, not(nil()), "Exception not thrown");
            assertThat(thrownException, sameAs(exception));
          });
        });
      });

      describe("when mock function is stubbed with multiple arguments", function() {
        var stubInvoked = false;

        describe("when stubbing without context matcher", function() {
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
            assertThat(mockFunc('foo', 9), sameAs(undefined));
          });

          it("should return undefined if arguments do not match", function() {
            assertThat(mockFunc('foo', 11, 'bar'), sameAs(undefined));
          });
        });

        describe("when stubbing with context matcher via call", function() {
          var context = {};
          before(function() {
            when(mockFunc).call(context, 1).then(function() { stubInvoked = true; return 'stub result' });
          });

          it("should return result of stub function", function() {
            assertThat(mockFunc.call(context, 1, 2), equalTo('stub result'));
          });

          it("should invoke stub function when called", function() {
            mockFunc.apply(context, [1, 'fred']);
            assertThat(stubInvoked, truth());
          });
        });

        describe("when stubbing with context matcher via apply", function() {
          var context = {};
          before(function() {
            when(mockFunc).apply(context, [1]).then(function() { stubInvoked = true; return 'stub result' });
          });

          it("should return result of stub function", function() {
            assertThat(mockFunc.call(context, 1, 2), equalTo('stub result'));
          });

          it("should invoke stub function when called", function() {
            mockFunc.apply(context, [1, 'fred']);
            assertThat(stubInvoked, truth());
          });
        });
      });

      describe("when mock function is stubbed multiple times using chained stubber", function() {
        before(function() {
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
        before(function() {
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
        before(function() {
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
        before(function() {
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

    describe("when mock function is created with a default context", function() {
      var mockFunc;
      var defaultContext;
      before(function() {
        defaultContext = this;
        mockFunc = mockFunction(this);
      });

      describe("when stubbed without supplying context", function() {
        before(function() {
          when(mockFunc)(1, 2).thenReturn('hello');
        });

        it("should apply to invocations with same context different as default", function() {
          assertThat(mockFunc.call(defaultContext, 1, 2), equalTo('hello'));
        });

        it("should not apply to invocations with context different from default", function() {
          assertThat(mockFunc.call({}, 1, 2), sameAs(undefined));
        });
      });

      describe("when invocked without supplying context", function() {
        before(function() {
          mockFunc(1, 'hi');
        });

        it("should verify with no context", function() {
          verify(mockFunc)(1, 'hi');
        });

        it("should verify with default context", function() {
          verify(mockFunc).apply(defaultContext, [1, 'hi']);
        });

        it("should not verify with different context", function() {
          var testContext = {};
          var exception;
          try { 
            verify(mockFunc).call(testContext, 1, 'hi');
          } catch (err) {
            exception = err;
          }
          assertThat(exception, equalTo(
            "Wanted but not invoked: func(<equal to 1>, <equal to \"hi\">), 'this' being equal to " + testContext));
        });
      });
    });

    describe("when mock function is created with name and default context", function() {
      var mockFunc;
      var defaultContext;
      before(function() {
        defaultContext = this;
        mockFunc = mockFunction('myfunctor', this);
      });

      it("should use defined name in verification failures", function() {
        var exception;
        var testContext = {};
        try { 
          verify(mockFunc).call(testContext);
        } catch (err) {
          exception = err;
        }
        assertThat(exception, equalTo(
          "Wanted but not invoked: myfunctor(), 'this' being equal to " + testContext));
      });
    });
  });
});
