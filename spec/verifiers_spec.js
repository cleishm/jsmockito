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

      describe('when function invoked 3 times with different args', function() {
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
        it('should not verify with some arguments', function() {
          assertThat(function() {
            verify(mockFunc, once())(42);
          }, throwsMessage('Wanted 1 invocation but got 2: func(<equal to 42>)'));
        });
        it('should verify with all arguments', function() {
          verify(mockFunc, once())(42, 'hi');
        });
      });
    });

    describe('#times', function() {
      describe('when function never invoked', function() {
        it('should verify invoked 0 times', function() {
          verify(mockFunc, times(0))();
        });
        it('should not verify invoked 1 time', function() {
          assertThat(function() {
            verify(mockFunc, times(1))();
          }, throwsMessage('Wanted but not invoked: func()'));
        });
      });

      describe('when function invoked once', function() {
        before(function() {
          mockFunc(42, 'hi');
        });
        it('should not verify invoked 0 times with no arguments', function() {
          assertThat(function() {
            verify(mockFunc, times(0))();
          }, throwsMessage('Never wanted but invoked: func()'));
        });
        it('should verify invoked 0 times with different arguments', function() {
          verify(mockFunc, times(0))('foo');
        });
        it('should not verify invoked 0 times with same arguments', function() {
          assertThat(function() {
            verify(mockFunc, times(0))(42, 'hi');
          }, throwsMessage('Never wanted but invoked: func(<equal to 42>, <equal to "hi">)'));
        });

        it('should verify invoked 1 time with no arguments', function() {
          verify(mockFunc, times(1))();
        });
        it('should not verify invoked 1 time with different arguments', function() {
          assertThat(function() {
            verify(mockFunc, times(1))('foo');
          }, throwsMessage('Wanted but not invoked: func(<equal to "foo">)'));
        });
        it('should verify invoked 1 time with same arguments', function() {
          verify(mockFunc, times(1))(42, 'hi');
        });

        it('should not verify invoked 2 times with no arguments', function() {
          assertThat(function() {
            verify(mockFunc, times(2))();
          }, throwsMessage('Wanted 2 invocations but got 1: func()'));
        });
        it('should not verify invoked 2 times with different arguments', function() {
          assertThat(function() {
            verify(mockFunc, times(2))('foo');
          }, throwsMessage('Wanted but not invoked: func(<equal to "foo">)'));
        });
        it('should not verify invoked 2 times with same arguments', function() {
          assertThat(function() {
            verify(mockFunc, times(2))(42, 'hi');
          }, throwsMessage('Wanted 2 invocations but got 1: func(<equal to 42>, <equal to "hi">)'));
        });
      });

      describe('when function invoked 3 times with different args', function() {
        before(function() {
          mockFunc(42, 'hi');
          mockFunc(43, 'hi');
          mockFunc(42, 'bye');
        });
        it('should not verify invoked 1 time with no arguments', function() {
          assertThat(function() {
            verify(mockFunc, times(1))();
          }, throwsMessage('Wanted 1 invocation but got 3: func()'));
        });
        it('should not verify invoked 2 times with no arguments', function() {
          assertThat(function() {
            verify(mockFunc, times(2))();
          }, throwsMessage('Wanted 2 invocations but got 3: func()'));
        });
        it('should verify invoked 3 times with no arguments', function() {
          verify(mockFunc, times(3))();
        });

        it('should not verify invoked 1 time with some arguments', function() {
          assertThat(function() {
            verify(mockFunc, times(1))(42);
          }, throwsMessage('Wanted 1 invocation but got 2: func(<equal to 42>)'));
        });
        it('should verify invoked 2 times with some arguments', function() {
          verify(mockFunc, times(2))(42);
        });
        it('should not verify invoked 3 times with some arguments', function() {
          assertThat(function() {
            verify(mockFunc, times(3))(42);
          }, throwsMessage('Wanted 3 invocations but got 2: func(<equal to 42>)'));
        });

        it('should verify invoked 1 time with all arguments', function() {
          verify(mockFunc, times(1))(42, 'hi');
        });
        it('should not verify invoked 2 times with all arguments', function() {
          assertThat(function() {
            verify(mockFunc, times(2))(42, 'hi');
          }, throwsMessage('Wanted 2 invocations but got 1: func(<equal to 42>, <equal to "hi">)'));
        });
      });
    });
  });
});
