// vi:ts=2 sw=2 expandtab
Screw.Unit(function() {
  describe('JsMockito README examples', function() {
    describe("Basic verification", function() {
      it("should verify objects", function() {
        var mockedArray = mock(Array);

        //using mock object
        mockedArray.push("one");
        mockedArray.reverse();

        //verification
        verify(mockedArray).push("one");
        verify(mockedArray).reverse();
      });

      it("should verify functions", function() {
        var mockedFunc = mockFunction();

        //using mock function
        mockedFunc('hello world');
        mockedFunc.call(this, 'foobar');
        mockedFunc.apply(this, [ 'barfoo' ]);

        //verification
        verify(mockedFunc)('hello world');
        verify(mockedFunc)('foobar');
        verify(mockedFunc)('barfoo');
      });
    });

    describe("Basic stubbing", function() {
      it("should stub object methods", function() {
        var mockedArray = mock(Array);

        //stubbing
        when(mockedArray).slice(0).thenReturn('f');
        when(mockedArray).slice(1).thenThrow('An exception');

        //following returns "f"
        assertThat(mockedArray.slice(0), equalTo("f"));

        //following throws exception 'An exception'
        assertThat(function() { mockedArray.slice(1) },
          throwsMessage('An exception'));

        //following returns undefined as slice(999) was not stubbed
        assertThat(typeof (mockedArray.slice(999)), equalTo("undefined"));

        //can also verify a stubbed invocation, although this is usually redundant
        verify(mockedArray).slice(0);
      });

      it("should use last stub for object methods", function() {
        function Worker() {
          this.doSomething = function(){};
        }
        var mockedWorker = mock(Worker);


        //stubbing
        when(mockedWorker).doSomething().thenReturn('doing_first');
        when(mockedWorker).doSomething().thenReturn('doing_second');

        //following returns "f"
        assertThat(mockedWorker.doSomething(), equalTo("doing_second"));
      });

      it("should stub functions", function() {
        var mockedFunc = mockFunction();

        //stubbing
        when(mockedFunc)(0).thenReturn('f');
        when(mockedFunc)(1).thenThrow('An exception');

        //following returns "f"
        assertThat(mockedFunc(0), equalTo("f"));

        //following throws exception 'An exception'
        assertThat(function() { mockedFunc(1) }, throwsMessage('An exception'));

        //following returns undefined as mockedFunc(999) was not stubbed
        assertThat(typeof (mockedFunc(999)), equalTo("undefined"));

        //can also verify a stubbed invocation, although this is usually redundant
        verify(mockedFunc)(0);
      });
    });

    describe("Matching Arguments", function() {
      it("should verify arguments", function() {
        var mockedArray = mock(Array);
        var mockedFunc = mockFunction();

        //stubbing using JsHamcrest
        when(mockedArray).slice(lessThan(10)).thenReturn('f');
        when(mockedFunc)(containsString('world')).thenReturn('foobar');

        //following returns "f"
        assertThat(mockedArray.slice(5), equalTo("f"));

        //following returns "foobar"
        assertThat(mockedFunc('hello world'), equalTo('foobar'));

        //you can also use matchers in verification
        verify(mockedArray).slice(greaterThan(4));
        verify(mockedFunc)(equalTo('hello world'));

        //if not specified then the matcher is anything(), thus either of these
        //will match an invocation with a single argument
        verify(mockedFunc)();
        verify(mockedFunc)(anything());
      });
    });
  });

  describe('JsMockito API doc examples', function() {
    describe("Let's verify some behaviour!", function() {
      it("should verify an object", function() {
        //mock creation
        var mockedArray = mock(Array);

        //using mock object
        mockedArray.push("one");
        mockedArray.reverse();

        //verification
        verify(mockedArray).push("one");
        verify(mockedArray).reverse();
      });
      it("should verify a function", function() {
        //mock creation
        var mockedFunc = mockFunction();

        //using mock function
        mockedFunc('hello world');
        mockedFunc.call(this, 'foobar');
        mockedFunc.apply(this, [ 'barfoo' ]);

        //verification
        verify(mockedFunc)('hello world');
        verify(mockedFunc)('foobar');
        verify(mockedFunc)('barfoo');
      });
    });

    describe("How about some stubbing?", function() {
      it("should stub an object", function() {
        var mockedArray = mock(Array);

        //stubbing
        when(mockedArray).slice(0).thenReturn('f');
        when(mockedArray).slice(1).thenThrow('An exception');

        //following returns "f"
        assertThat(mockedArray.slice(0), equalTo('f'));

        //following throws exception 'An exception'
        assertThat(function() { mockedArray.slice(1) }, throwsMessage('An exception'));

        //following returns undefined as slice(999) was not stubbed
        assertThat(typeof (mockedArray.slice(999)), equalTo('undefined'));

        //can also verify a stubbed invocation, although this is usually redundant
        verify(mockedArray).slice(0);
      });
      it("should stub a function", function() {
        var mockedFunc = mockFunction();

        //stubbing
        when(mockedFunc)(0).thenReturn('f');
        when(mockedFunc)(1).thenThrow('An exception');

        //following returns "f"
        assertThat(mockedFunc(0), equalTo('f'));

        //following throws exception 'An exception'
        assertThat(function() { mockedFunc(1) }, throwsMessage('An exception'));

        //following returns undefined as slice(999) was not stubbed
        assertThat(typeof (mockedFunc(999)), equalTo('undefined'));

        //can also verify a stubbed invocation, although this is usually redundant
        verify(mockedFunc)(0);
      });
    });
    describe("Matching Arguments", function() {
      it("should match arguments", function() {
        var mockedArray = mock(Array);
        var mockedFunc = mockFunction();

        //stubbing using JsHamcrest
        when(mockedArray).slice(lessThan(10)).thenReturn('f');
        when(mockedFunc)(containsString('world')).thenReturn('foobar');

        //following returns "f"
        assertThat(mockedArray.slice(5), equalTo('f'));

        //following returns "foobar"
        assertThat(mockedFunc('hello world'), equalTo('foobar'));

        //you can also use matchers in verification
        verify(mockedArray).slice(greaterThan(4));
        verify(mockedFunc)(equalTo('hello world'));

        //if not specified then the matcher is anything(), thus either of these
        //will match an invocation with a single argument
        verify(mockedFunc)();
        verify(mockedFunc)(anything());
      });
    });
    describe("Verify exact number of invocations / at least onece / never", function() {
      it("should verify number of invocations", function() {
        var mockedArray = mock(Array);
        var mockedFunc = mockFunction();

        mockedArray.slice(5);
        mockedArray.slice(6);
        mockedFunc('a');
        mockedFunc('b');

        //verification of multiple matching invocations
        verify(mockedArray, times(2)).slice(anything());
        verify(mockedFunc, times(2))(anything());

        //the default is times(1), making these are equivalent
        verify(mockedArray, times(1)).slice(5);
        verify(mockedArray).slice(5);
      });
    });
    describe("Matching the context ('this')", function() {
      it("should match for functions", function() {
        var mockedFunc = mockFunction();
        var context1 = {};
        var context2 = {};

        when(mockedFunc).call(equalTo(context2), anything()).thenReturn('hello');

        mockedFunc.call(context1, 'foo');
        //the following returns 'hello'
        assertThat(mockedFunc.apply(context2, [ 'bar' ]), equalTo('hello'));

        verify(mockedFunc).apply(context1, [ 'foo' ]);
        verify(mockedFunc).call(context2, 'bar');
      });
      it("should match for object methods", function() {
        var mockedArray = mock(Array);
        var otherContext = {};

        when(mockedArray).slice.call(otherContext, 5).thenReturn('h');

        //the following returns 'h'
        assertThat(mockedArray.slice.apply(otherContext, [ 5 ]), equalTo('h'));

        verify(mockedArray).slice.call(equalTo(otherContext), 5);
      });
    });
    describe("Making sure interactions never happened on a mock", function() {
      it("should verify for objects", function() {
        var mockOne = mock(Array);
        var mockTwo = mock(Array);
        var mockThree = mockFunction();

        //only mockOne is interacted with
        mockOne.push(5);

        //verify a method was never called
        verify(mockOne, never()).unshift('a');

        //verify that other mocks were not interacted with
        verifyZeroInteractions(mockTwo, mockThree);
      });
    });
  });
});
