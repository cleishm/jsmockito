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
          assertThat(function() { verify(mockFunc)() }, throwsMessage("Wanted but not invoked: func()"));
        });

        it("should verify that the mock function was never invoked", function() {
          verify(mockFunc, never())();
          verify(mockFunc, never()).call(this);
        });

        it("should verify that mock function had zero interactions", function() {
          verifyZeroInteractions(mockFunc);
        });
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
          var testContext = {};
          assertThat(function() {
            verify(mockFunc).call(testContext);
          }, throwsMessage("Wanted but not invoked: func(), 'this' being equal to " + testContext));
        });

        it("should not verify function was invoked with different context using apply", function() {
          var testContext = {};
          assertThat(function() {
            verify(mockFunc).apply(testContext);
          }, throwsMessage("Wanted but not invoked: func(), 'this' being equal to " + testContext));
        });

        it("should not verify function was invoked with arguments", function() {
          assertThat(function() {
            verify(mockFunc)('bar');
          }, throwsMessage("Wanted but not invoked: func(<equal to \"bar\">)"));
        });

        it("should not verify function was invoked with arguments using a matcher", function() {
          assertThat(function() {
            verify(mockFunc)(lessThan(10));
          }, throwsMessage("Wanted but not invoked: func(<less than 10>)"));
        });

        it("should not verify function was invoked when additional arguments are undefined", function() {
          assertThat(function() {
            verify(mockFunc)(undefined);
          }, throwsMessage("Wanted but not invoked: func(<equal to undefined>)"));
        });

        it("should not verify function was invoked when additional arguments are anything", function() {
          assertThat(function() {
            verify(mockFunc)(anything());
          }, throwsMessage("Wanted but not invoked: func(<anything>)"));
        });

        it("should not verify that the mock function was invoked more than once", function() {
          assertThat(function() {
            verify(mockFunc, times(2))();
          }, throwsMessage("Wanted 2 invocations but got 1: func()"));
        });

        it("should verify that the mock function was never invoked with arguments", function() {
          verify(mockFunc, never())('summer', 69);
          verify(mockFunc, never())(lessThan(100));
          verify(mockFunc, never())(anything());
        });

        it("should not verify that the mock function had zero interactions", function() {
          assertThat(function() {
            verifyZeroInteractions(mockFunc);
          }, throwsMessage("Never wanted but invoked: func()"));
        });

        it("should not verify that the mock function has no more interactions", function() {
          assertThat(function() {
            verifyNoMoreInteractions(mockFunc);
          }, throwsMessage("No interactions wanted, but 1 remains: func()"));
        });

        describe("when verified", function() {
          before(function() {
            verify(mockFunc)();
          });

          it("should verify that mock function had no more interactions", function() {
            verifyNoMoreInteractions(mockFunc);
          });
        });
      });

      describe("when mock function invoked twice with no arguments", function() { 
        var context;
        before(function() {
          context = this;
          mockFunc();
          mockFunc();
        });

        it("should not verify that the mock function was invoked once", function() {
          assertThat(function() {
            verify(mockFunc)();
          }, throwsMessage("Wanted 1 invocation but got 2: func()"));
        });

        it("should verify that mock function was invoked twice", function() {
          verify(mockFunc, times(2))();
        });

        it("should not verify that the mock function was invoked more than twice", function() {
          assertThat(function() {
            verify(mockFunc, times(3))();
          }, throwsMessage("Wanted 3 invocations but got 2: func()"));
        });
      });

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
          assertThat(function() {
            verify(mockFunc).call(context, 'bar');
          }, throwsMessage("Wanted but not invoked: func(<equal to \"bar\">), 'this' being equal to " + context));
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
          assertThat(function() {
            verify(mockFunc)(args[0], 'boo', {}, anything());
          }, throwsMessage(
            "Wanted but not invoked: func(<equal to 1>, <equal to \"boo\">, <equal to " + args[2] + ">, <anything>)")
          );
        });

        it("should not verify function was invoked with args not matching matchers", function() {
          assertThat(function() {
            verify(mockFunc)(args[0], 'boo', {});
          }, throwsMessage(
            "Wanted but not invoked: func(<equal to 1>, <equal to \"boo\">, <equal to " + args[2] + ">)")
          );
        });
      });

      describe("when mock function invoked twice with different arguments", function() {
        before(function() {
          mockFunc('foo');
          mockFunc('bar');
        });

        describe("when only first interaction verified", function() {
          before(function() {
            verify(mockFunc)('foo');
          });

          it("should not verify that mock function had no more interactions", function() {
            assertThat(function() {
              verifyNoMoreInteractions(mockFunc);
            }, throwsMessage("No interactions wanted, but 1 remains: func()"));
          });
        });

        describe("when only second interaction verified", function() {
          before(function() {
            verify(mockFunc)('bar');
          });

          it("should not verify that mock function had no more interactions", function() {
            assertThat(function() {
              verifyNoMoreInteractions(mockFunc);
            }, throwsMessage("No interactions wanted, but 1 remains: func()"));
          });
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

      describe("when mock function is stubbed multiple times using chained stubber from then", function() {
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

      describe("when mock function is stubbed multiple times using chained stubber from thenReturn", function() {
        before(function() {
          when(mockFunc)('foo').thenReturn('value result').then(function() { return 'func result' });
        });

        it("should return results of first stub first", function() {
          assertThat(mockFunc('foo'), equalTo('value result'));
        });

        it("should return results of second stub second", function() {
          mockFunc('foo');
          assertThat(mockFunc('foo'), equalTo('func result'));
        });

        it("should return results of last stub for subsequent invocations", function() {
          mockFunc('foo');
          mockFunc('foo');
          assertThat(mockFunc('foo'), equalTo('func result'));
          assertThat(mockFunc('foo'), equalTo('func result'));
        });
      });

      describe("when mock function is stubbed multiple times using chained stubber from thenThrow", function() {
        before(function() {
          when(mockFunc)('foo').thenThrow('ex result').thenReturn('value result');
        });

        it("should return results of first stub first", function() {
          var exception;
          try { mockFunc('foo') } catch (ex) { exception = ex };
          assertThat(exception, equalTo('ex result'));
        });

        it("should return results of second stub second", function() {
          try { mockFunc('foo') } catch (ex) { }
          assertThat(mockFunc('foo'), equalTo('value result'));
        });

        it("should return results of last stub for subsequent invocations", function() {
          try { mockFunc('foo') } catch (ex) { }
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

      describe("when mock function is stubbed again", function() {
        before(function() {
          when(mockFunc)('foo', anything()).thenReturn('result 1');
          when(mockFunc)('foo', 'bar').thenReturn('result 2');
        });

        describe("when either stub match", function() {
          it("should return the result of the last stub", function() {
            assertThat(mockFunc('foo', 'bar'), equalTo('result 2'));
          });
        });

        describe("when second stub does not match", function() {
          it("should return the result of the first stub", function() {
            assertThat(mockFunc('foo', 'foo'), equalTo('result 1'));
          });
        });
      });
    });

    describe("when mock function is created with name", function() {
      var mockFunc;
      before(function() {
        mockFunc = mockFunction('myfunctor');
      });

      it("should use defined name in verification failures", function() {
        assertThat(function() { verify(mockFunc)() }, throwsMessage("Wanted but not invoked: myfunctor()"));
      });
    });
  });
});
