// vi:ts=2 sw=2 expandtab
Screw.Unit(function() {
  describe('JsMockito verifiers', function() {
    var mockFunc;
    before(function() {
      mockFunc = mockFunction();
    });

    describe('#never', function() {
      describe('when function never invoked', function() {
        it('should verify with no arguments', function() {
          verify(mockFunc, never())();
        });
        it('should verify with arguments', function() {
          verify(mockFunc, never())(42, 'hi');
        });
      });

      describe('when function invoked', function() {
        before(function() {
          mockFunc(42, 'hi');
        });
        it('should verify with different arguments', function() {
          verify(mockFunc, never())('foo');
        });
        it('should not verify with no arguments', function() {
          assertThat(function() {
            verify(mockFunc, never())();
          }, throwsMessage("Never wanted but invoked: func()"));
        });
        it('should not verify with same arguments', function() {
          assertThat(function() {
            verify(mockFunc, never())(42, 'hi');
          }, throwsMessage('Never wanted but invoked: func(<equal to 42>, <equal to "hi">)'));
        });
      });
    });
  });
});
