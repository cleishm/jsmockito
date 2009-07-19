// vi:ts=2 sw=2 expandtab
Screw.Unit(function() {
  describe('JsMockito', function() {
    describe("when mock function invoked once with no arguments", function() { 
      var mockFunc;
      var scope;
      before(function() {
        mockFunc = mockFunction();
        scope = this;
        mockFunc();
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
          "Wanted but not invoked: func(), 'this' being anything"));
      });
    });

    describe("when mock function invoked twice with no arguments", function() { 
      var mockFunc;
      var scope;
      before(function() {
        mockFunc = mockFunction();
        scope = this;
        mockFunc();
        mockFunc();
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
      before(function() {
        mockFunc = mockFunction();
        mockFunc.apply(this, args);
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
          verify(mockFunc)('bar');
        } catch (err) {
          exception = err;
        }
        assertThat(exception, not(nil()), "Exception not raised");
        assertThat(exception, equalTo(
          "Wanted but not invoked: func(<equal to \"bar\">), 'this' being anything"));
      });
    });

    describe("when mock function invoked once with multiple arguments", function() { 
      var mockFunc;
      var scope;
      var args = [1, 'test', {}];
      before(function() {
        mockFunc = mockFunction();
        mockFunc.apply(this, args);
      });

      it("should verify mock function was invoked", function() {
        verify(mockFunc)();
      });

      it("should verify mock function was invoked with all args", function() {
        verify(mockFunc).apply(anything(), args);
      });

      it("should verify mock function was invoked with some args", function() {
        verify(mockFunc)(args[0]);
      });

      it("should not verify function was invoked with different args", function() {
        var exception;
        try { 
          verify(mockFunc)(args[0], 'boo', {});
        } catch (err) {
          exception = err;
        }
        assertThat(exception, not(nil()), "Exception not raised");
        assertThat(exception, equalTo(
          "Wanted but not invoked: func(<equal to 1>, <equal to \"boo\">, <equal to " + args[2] + ">), 'this' being anything"));
      });
    });
  });
});
