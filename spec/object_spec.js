// vi:ts=2 sw=2 expandtab
Screw.Unit(function() {
  describe('JsMockito object mocking', function() {

    describe("when mock object created", function() {
      var mockObj;
      before(function() {
        mockObj = mock(MyObject);
      });

      it("should be an instance of the same class", function() {
        assertThat(mockObj, instanceOf(MyObject));
      });

      it("should provide an instance of the same class when stubbing", function() {
        var stubBuilder = when(mockObj);
        assertThat(stubBuilder, instanceOf(MyObject));
      });

      it("should provide an instance of the same class when verifing", function() {
        var verifier = verify(mockObj);
        assertThat(verifier, instanceOf(MyObject));
      });

      it("should verify that mock object had zero interactions", function() {
        verifyZeroInteractions(mockObj);
      });
    });

    describe("when mocked constructor throws an exception", function() {
      it("should return a helpful error message", function() {
        assertThat(function() {
          var FailingObject = function() { throw "bad" };
          mock(FailingObject)
        }, throwsMessage(
          "mocked constructor threw an exception (consider mocking an object instead of a constructor)")
        );
      });
    });

    describe("when an unwritable mock object created", function() {
      var mockUnwritableObj;
      before(function() {
        mockUnwritableObj = mock(MyUnwritableObject);
      });

      it("should be an instance of the same class", function() {
        assertThat(mockUnwritableObj, instanceOf(MyUnwritableObject));
      });

      it("should provide an instance of the same class when stubbing", function() {
        var stubBuilder = when(mockUnwritableObj);
        assertThat(stubBuilder, instanceOf(MyUnwritableObject));
      });

      it("should provide an instance of the same class when verifing", function() {
        var verifier = verify(mockUnwritableObj);
        assertThat(verifier, instanceOf(MyUnwritableObject));
      });

      it("should verify that mock object had zero interactions", function() {
        verifyZeroInteractions(mockUnwritableObj);
      });
    });

    describe("when mock method invoked once with no arguments", function() {
      var mockObj;
      var result;
      before(function() {
        mockObj = mock(MyObject);
        result = mockObj.greeting();
      });

      it("should return undefined", function() {
        assertThat(result, sameAs(undefined));
      });

      it("should verify method was invoked", function() {
        verify(mockObj).greeting();
      });

      it("should verify method was invoked with context", function() {
        verify(mockObj).greeting.call(mockObj);
      });

      it("should verify method was invocked using context matcher", function() {
        verify(mockObj).greeting.apply(anything(), []);
      });

      it("should not verify method was invoked with different context", function() {
        var testContext = {};
        assertThat(function() {
          verify(mockObj).greeting.call(testContext);
        }, throwsMessage(
          "Wanted but not invoked: obj.greeting(), 'this' being equal to " + testContext)
        );
      });

      it("should verify that method was not invoked twice", function() {
        assertThat(function() {
          verify(mockObj, times(2)).greeting();
        }, throwsMessage("Wanted 2 invocations but got 1: obj.greeting()"));
      });

      it("should not verify that the mock object had zero interactions", function() {
        assertThat(function() {
          verifyZeroInteractions(mockObj);
        }, throwsMessage("Never wanted but invoked: obj.greeting()"));
      });

      it("should not verify that the mock object had no more interactions", function() {
        assertThat(function() {
          verifyNoMoreInteractions(mockObj);
        }, throwsMessage("No interactions wanted, but 1 remains: obj.greeting()"));
      });

      describe("when verified", function() {
        before(function() {
          verify(mockObj).greeting();
        });

        it("should verify that mock object had no more interactions", function() {
          verifyNoMoreInteractions(mockObj);
        });
      });
    });

    describe("when mock method on a mock of an unwritable object invoked once with no arguments", function() {
      var mockUnwritableObj;
      var result;
      before(function() {
        mockUnwritableObj = mock(MyUnwritableObject);
        result = mockUnwritableObj.greeting();
      });

      it("should return undefined", function() {
        assertThat(result, sameAs(undefined));
      });

      it("should verify method was invoked", function() {
        verify(mockUnwritableObj).greeting();
      });

      it("should verify method was invoked with context", function() {
        verify(mockUnwritableObj).greeting.call(mockUnwritableObj);
      });

      it("should verify method was invocked using context matcher", function() {
        verify(mockUnwritableObj).greeting.apply(anything(), []);
      });

      it("should not verify method was invoked with different context", function() {
        var testContext = {};
        assertThat(function() {
          verify(mockUnwritableObj).greeting.call(testContext);
        }, throwsMessage(
          "Wanted but not invoked: obj.greeting(), 'this' being equal to " + testContext)
        );
      });

      it("should verify that method was not invoked twice", function() {
        assertThat(function() {
          verify(mockUnwritableObj, times(2)).greeting();
        }, throwsMessage("Wanted 2 invocations but got 1: obj.greeting()"));
      });

      it("should not verify that the mock object had zero interactions", function() {
        assertThat(function() {
          verifyZeroInteractions(mockUnwritableObj);
        }, throwsMessage("Never wanted but invoked: obj.greeting()"));
      });

      it("should not verify that the mock object had no more interactions", function() {
        assertThat(function() {
          verifyNoMoreInteractions(mockUnwritableObj);
        }, throwsMessage("No interactions wanted, but 1 remains: obj.greeting()"));
      });

      describe("when verified", function() {
        before(function() {
          verify(mockUnwritableObj).greeting();
        });

        it("should verify that mock object had no more interactions", function() {
          verifyNoMoreInteractions(mockUnwritableObj);
        });
      });
    });

    describe("when mock method invocked with multiple arguments", function() {
      var mockObj;
      before(function() {
        mockObj = mock(MyObject);
        mockObj.farewell('hunter', 'thompson', 67);
      });

      it("should verify the method was invoked", function() {
        verify(mockObj).farewell();
      });

      it("should verify the method was invoked with some arguments", function() {
        verify(mockObj).farewell('hunter', 'thompson');
      });

      it("should verify the method was invoked with all arguments", function() {
        verify(mockObj).farewell('hunter', 'thompson', 67);
      });

      it("should verify the method was invoked using matchers", function() {
        verify(mockObj).farewell('hunter', 'thompson', lessThan(100));
      });

      it("should not verify the method was invoked if looking for additional arguments", function() {
        assertThat(function() {
          verify(mockObj).farewell('hunter', 'thompson', 67, 'batcountry');
        }, throwsMessage(
          "Wanted but not invoked: obj.farewell(<equal to \"hunter\">, <equal to \"thompson\">, <equal to 67>, <equal to \"batcountry\">)")
        );
      });

      it("should not verify the method was invoked if different arguments", function() {
        assertThat(function() {
          verify(mockObj).farewell('hunter', 'thompson', 68);
        }, throwsMessage(
          "Wanted but not invoked: obj.farewell(<equal to \"hunter\">, <equal to \"thompson\">, <equal to 68>)")
        );
      });
    });

    describe("when mock method invocked with different context", function() {
      var mockObj;
      var testContext = {};
      before(function() {
        mockObj = mock(MyObject);
        mockObj.greeting.call(testContext);
      });

      it("should not verify that the method was invoked without explicit context", function() {
        assertThat(function() {
          verify(mockObj).greeting();
        }, throwsMessage("Wanted but not invoked: obj.greeting()"));
      });

      it("should verify method was invoked with explicit context", function() {
        verify(mockObj).greeting.apply(testContext, []);
      });
    });

    describe("when stubbing methods", function() {
      var mockObj;
      before(function() {
        mockObj = mock(MyObject);
      });

      var stubContext;
      var stubArguments;
      function stubFunction() {
        stubContext = this;
        stubArguments = arguments;
        return 'stub result';
      }

      after(function() {
        stubContext = undefined;
        stubArguments = undefined;
      });

      describe("when method is stubbed with no arguments", function() {
        describe("when no clause applied", function() {
          before(function() {
            when(mockObj).greeting();
          });

          it("should return undefined", function() {
            assertThat(mockObj.greeting(), sameAs(undefined));
          });
        });

        describe("when using 'then' and a function stub", function() {
          before(function() {
            when(mockObj).greeting().then(stubFunction);
          });

          it("should return result of stub function", function() {
            assertThat(mockObj.greeting(), equalTo('stub result'));
          });

          it("should invoke stub function when called", function() {
            mockObj.greeting();
            assertThat(stubArguments, not(nil()));
          });

          it("should invoke stub function with the mock as context by default", function() {
            mockObj.greeting();
            assertThat(stubContext, sameAs(mockObj), "Context was not the same");
          });

          it("should invoke stub function with the same arguments", function() {
            mockObj.greeting('hello', undefined, 5);
            assertThat(stubArguments, equalTo(['hello', undefined, 5]));
          });

          it("should invoke stub function when invoked via call with object as context", function() {
            mockObj.greeting.call(mockObj);
            assertThat(stubContext, sameAs(mockObj), "Context was not the same");
          });

          it("should invoke stub function when invoked via apply with object as context", function() {
            mockObj.greeting.apply(mockObj, ['hello', 6]);
            assertThat(stubContext, sameAs(mockObj), "Context was not the same");
            assertThat(stubArguments, equalTo(['hello', 6]));
          });

          it("should not invoke stub function when invoked via call with different context", function() {
            assertThat(mockObj.greeting.call({}), sameAs(undefined));
            assertThat(stubContext, sameAs(undefined));
          });
        });
      });

      describe("when method is stubbed with multiple arguments", function() {
        before(function() {
          when(mockObj).farewell('foo', lessThan(10), anything()).then(stubFunction);
        });

        it("should return result of stub function", function() {
          assertThat(mockObj.farewell('foo', 9, {}), equalTo('stub result'));
        });

        it("should invoke stub even if additional arguments are present", function() {
          assertThat(mockObj.farewell.apply(mockObj, ['foo', 9, {}, 'something else']), equalTo('stub result'));
        });

        it("should return undefined if insufficent arguments compared to stub", function() {
          assertThat(mockObj.farewell('foo', 9), sameAs(undefined));
        });

        it("should return undefined if arguments do not match", function() {
          assertThat(mockObj.farewell('foo', 11, 'bar'), sameAs(undefined));
        });
      });
    
      describe("when stubbing a method with explit context matcher and 'then' clause", function() {
        before(function() {
          when(mockObj).greeting.call(anything()).then(stubFunction);
        });

        it("should invoke stub function with the same explicit context", function() {
          var context = {};
          mockObj.greeting.call(context, 1, 'foo');
          assertThat(stubContext, sameAs(context), "Context was not the same");
        });
      });

      describe("when mock object is created with a prototype", function() {
        var mockObj;
        before(function() {
          mockObj = mock(MyObject.prototype);
        });

        it("should be an instance of the same class", function() {
          assertThat(mockObj, instanceOf(MyObject));
        });

        it("should provide an instance of the same class when stubbing", function() {
          var stubBuilder = when(mockObj);
          assertThat(stubBuilder, instanceOf(MyObject));
        });

        it("should provide an instance of the same class when verifing", function() {
          var verifier = verify(mockObj);
          assertThat(verifier, instanceOf(MyObject));
        });

        it("should not invoke underlying prototype methods", function() {
          assertThat(mockObj.greeting(), sameAs(undefined));
        });
      });
    });
  });
});
