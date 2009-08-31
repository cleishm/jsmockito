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

    describe('#zeroInteractions', function() {
      describe('when function never invoked', function() {
        it('should verify', function() {
          verify(mockFunc, zeroInteractions());
        });
      });

      describe('when function invoked', function() {
        before(function() {
          mockFunc(42, 'hi');
        });
        it('should not verify', function() {
          assertThat(function() {
            verify(mockFunc, zeroInteractions());
          }, throwsMessage("Never wanted but invoked: func()"));
        });
      });
    });

    describe('#once', function() {
      describe('when function never invoked', function() {
        it('should not verify', function() {
          assertThat(function() {
            verify(mockFunc, once())();
          }, throwsMessage('Wanted but not invoked: func()'));
        });
      });

      describe('when function invoked once', function() {
        before(function() {
          mockFunc(42, 'hi');
        });
        it('should not verify with different arguments', function() {
          assertThat(function() {
            verify(mockFunc, once())('foo');
          }, throwsMessage('Wanted but not invoked: func(<equal to "foo">)'));
        });
        it('should verify with no arguments', function() {
          verify(mockFunc, once())();
        });
        it('should verify with same arguments', function() {
          verify(mockFunc, once())(42, 'hi');
        });
      });

      describe('when function invoked twice with different args', function() {
        before(function() {
          mockFunc(42, 'hi');
          mockFunc(43, 'hi');
          mockFunc(42, 'bye');
        });
        it('should not verify with no arguments', function() {
          assertThat(function() {
            verify(mockFunc, once())();
          }, throwsMessage('Wanted 1 invocation but got 3: func()'));
        });
        it('should not verify with same arguments', function() {
          assertThat(function() {
            verify(mockFunc, once())(42);
          }, throwsMessage('Wanted 1 invocation but got 2: func(<equal to 42>)'));
        });
        it('should verify with all arguments', function() {
          verify(mockFunc, once())(42, 'hi');
        });
      });
    });
  });
});
