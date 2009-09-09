// vi:ts=2 sw=2 expandtab
Screw.Unit(function() {
  describe('JsMockito function spy', function() {
    var mockFunc;
    var proxyMock;
    before(function() {
      mockFunc = mockFunction();
      proxyMock = spy(mockFunc);
    });

    describe("when invoked", function() {
      var scope;
      before(function() {
        scope = {};
        proxyMock.call(scope, 'foo', 42);
      });

      it("should invoke proxied function", function() {
        verify(mockFunc)('foo', 42);
      });
      it("should invoke proxied function with same scope", function() {
        verify(mockFunc).call(scope, 'foo');
      });
    });

    describe("when stubbed", function() {
      before(function() {
        when(proxyMock)('bar').thenReturn(99);
      });

      describe("when invoked with arguments matching stub", function() {
        var result;
        before(function() {
          result = proxyMock('bar');
        });

        it("should return result of stub", function() {
          assertThat(result, equalTo(99));
        });

        it("should not invoke proxied function", function() {
          verifyZeroInteractions(mockFunc);
        });
      });

      describe("when invoked with arguments not matching stub", function() {
        before(function() {
          proxyMock('foo');
        });

        it("should invoke the proxied function", function() {
          verify(mockFunc)('foo');
        });
      });
    });
  });
});
