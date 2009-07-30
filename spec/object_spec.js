// vi:ts=2 sw=2 expandtab
Screw.Unit(function() {
  describe('JsMockito object mocking', function() {
    var MyObject;

    before(function() {
      MyObject = function() {
        this.greeting = function() { return "hello" };
        this.farewell = function() { return "goodbye" };
      };
    });

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
        var exception;
        var testContext = {};
        try {
          verify(mockObj).greeting.call(testContext);
        } catch (err) {
          exception = err;
        }
        assertThat(exception, not(nil()), "Exception not raised");
        assertThat(exception, equalTo(
          "Wanted but not invoked: obj.greeting(), 'this' being equal to " + testContext));
      });

/*
      it("should verify that method was not invoked twice", function() {
        var exception;
        try { 
          verify(mockObj, times(2)).greeting();
        } catch (err) {
          exception = err;
        }
        assertThat(exception, not(nil()), "Exception not raised");
        assertThat(exception, equalTo("Wanted but not invoked: obj.greeting()"));
      });
*/
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
        var exception;
        try { 
          verify(mockObj).farewell('hunter', 'thompson', 67, 'batcountry');
        } catch (err) {
          exception = err;
        }
        assertThat(exception, not(nil()), "Exception not raised");
        assertThat(exception, equalTo(
          "Wanted but not invoked: obj.farewell(<equal to \"hunter\">, <equal to \"thompson\">, <equal to 67>, <equal to \"batcountry\">)"));
      });

      it("should not verify the method was invoked if different arguments", function() {
        var exception;
        try { 
          verify(mockObj).farewell('hunter', 'thompson', 68);
        } catch (err) {
          exception = err;
        }
        assertThat(exception, not(nil()), "Exception not raised");
        assertThat(exception, equalTo(
          "Wanted but not invoked: obj.farewell(<equal to \"hunter\">, <equal to \"thompson\">, <equal to 68>)"));
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
        var exception;
        var testContext = {};
        try {
          verify(mockObj).greeting();
        } catch (err) {
          exception = err;
        }
        assertThat(exception, not(nil()), "Exception not raised");
        assertThat(exception, equalTo("Wanted but not invoked: obj.greeting()"));
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
    });
  });
});
