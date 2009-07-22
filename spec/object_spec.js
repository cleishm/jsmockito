// vi:ts=2 sw=2 expandtab
Screw.Unit(function() {
  describe('JsMockito object mocking', function() {
    var MyObject = function() {
      this.greeting = function() { return "hello" };
    };

    describe("when mock object created", function() {
      var mockObj;
      before(function() {
        mockObj = mock(MyObject);
      });

      it("should be an instance of the same class", function() {
        assertThat(mockObj, instanceOf(MyObject));
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
        assertThat(result, equalTo(undefined));
      });

      it("should verify method was invoked", function() {
        verify(mockObj).greeting();
      });

      it("should verify method was invoked with scope", function() {
        verify(mockObj).greeting.call(mockObj);
      });

      it("should verify method was invocked using scope matcher", function() {
        verify(mockObj).greeting.apply(anything(), []);
      });

      it("should not verify method was invoked with different scope", function() {
        var exception;
        var testScope = {};
        try {
          verify(mockObj).greeting.call(testScope);
        } catch (err) {
          exception = err;
        }
        assertThat(exception, not(nil()), "Exception not raised");
        assertThat(exception, equalTo(
          "Wanted but not invoked: obj.greeting(), 'this' being equal to " + testScope));
      });

      it("should verify that method was not invoked twice", function() {
        verify(mockObj).greeting();
        var exception;
        try { 
          verify(mockObj).greeting();
        } catch (err) {
          exception = err;
        }
        assertThat(exception, not(nil()), "Exception not raised");
        assertThat(exception, equalTo("Wanted but not invoked: obj.greeting()"));
      });
    });

    describe("when mock method invocked with different scope", function() {
      var mockObj;
      var testScope = {};
      var result;
      before(function() {
        mockObj = mock(MyObject);
        result = mockObj.greeting.call(testScope);
      });

      it("should not verify that the method was invoked without explicit scope", function() {
        var exception;
        var testScope = {};
        try {
          verify(mockObj).greeting();
        } catch (err) {
          exception = err;
        }
        assertThat(exception, not(nil()), "Exception not raised");
        assertThat(exception, equalTo("Wanted but not invoked: obj.greeting()"));
      });

      it("should verify method was invoked with explicit scope", function() {
        verify(mockObj).greeting.apply(testScope, []);
      });
    });
  });
});
