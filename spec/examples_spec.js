// vi:ts=2 sw=2 expandtab
Screw.Unit(function() {
  describe('JsMockito README examples', function() {
    describe("Basic verification", function() {
      it("should verify objects (via prototype)", function() {
        var prototype = new Array();
        var mockedArray = mock(prototype);

        //using mock object
        mockedArray.push("one");
        mockedArray.reverse();

        //verification
        verify(mockedArray).push("one");
        verify(mockedArray).reverse();
      });

      it("should verify objects (via constructor)", function() {
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
        when(mockedArray).slice(2).then(function() { return 1+2 });

        //following returns "f"
        assertThat(mockedArray.slice(0), equalTo("f"));

        //the following throws exception 'An exception'
        var ex = undefined;
        try {
          mockedArray.slice(1);
        } catch (e) {
          ex = e;
        }
        assertThat(ex, equalTo('An exception'));

        //the following invokes the stub method, which returns 3
        assertThat(mockedArray.slice(2), equalTo(3));

        //the following returns undefined as slice(999) was not stubbed
        assertThat(mockedArray.slice(999), typeOf("undefined"));

        //stubs can take multiple values to return in order
        when(mockedArray).pop().thenReturn('a', 'b', 'c');
        assertThat(mockedArray.pop(), equalTo('a'));
        assertThat(mockedArray.pop(), equalTo('b'));
        assertThat(mockedArray.pop(), equalTo('c'));
        assertThat(mockedArray.pop(), equalTo('c'));

        //stubs can be chained to return values in order
        when(mockedArray).unshift().thenReturn('a').thenReturn('b').then(function() { return 'c' });
        assertThat(mockedArray.unshift(), equalTo('a'));
        assertThat(mockedArray.unshift(), equalTo('b'));
        assertThat(mockedArray.unshift(), equalTo('c'));
        assertThat(mockedArray.unshift(), equalTo('c'));

        //stub matching can overlap, allowing for specific cases and defaults
        when(mockedArray).slice(3).thenReturn('abcde');
        when(mockedArray).slice(3, lessThan(0)).thenReturn('edcba');
        assertThat(mockedArray.slice(3, -1), equalTo('edcba'));
        assertThat(mockedArray.slice(3, 1), equalTo('abcde'));
        assertThat(mockedArray.slice(3), equalTo('abcde'));

        //can also verify a stubbed invocation, although this is usually redundant
        verify(mockedArray).slice(0);
      });

      it("should stub functions", function() {
        var mockedFunc = mockFunction();

        //stubbing
        when(mockedFunc)(0).thenReturn('f');
        when(mockedFunc)(1).thenThrow('An exception');
        when(mockedFunc)(2).then(function() { return 1+2 });

        //the following returns "f"
        assertThat(mockedFunc(0), equalTo("f"));

        //the following throws exception 'An exception'
        var ex = undefined;
        try {
          mockedFunc(1);
        } catch (e) {
          ex = e;
        }
        assertThat(ex, equalTo('An exception'));

        //the following invokes the stub, which returns 3
        assertThat(mockedFunc(2), equalTo(3));

        //the following returns undefined as mockedFunc(999) was not stubbed
        assertThat(mockedFunc(999), typeOf("undefined"));

        //stubs can take multiple values to return in order
        when(mockedFunc)(3).thenReturn('a', 'b', 'c');
        assertThat(mockedFunc(3), equalTo('a'));
        assertThat(mockedFunc(3), equalTo('b'));
        assertThat(mockedFunc(3), equalTo('c'));
        assertThat(mockedFunc(3), equalTo('c'));

        //stubs can be chained to return values in order
        when(mockedFunc)(4).thenReturn('a').thenReturn('b').then(function() { return 'c' });
        assertThat(mockedFunc(4), equalTo('a'));
        assertThat(mockedFunc(4), equalTo('b'));
        assertThat(mockedFunc(4), equalTo('c'));
        assertThat(mockedFunc(4), equalTo('c'));

        //stub matching can overlap, allowing for specific cases and defaults
        when(mockedFunc)(5).thenReturn('abcde');
        when(mockedFunc)(5, lessThan(0)).thenReturn('edcba');
        assertThat(mockedFunc(5, -1), equalTo('edcba'));
        assertThat(mockedFunc(5, 1), equalTo('abcde'));
        assertThat(mockedFunc(5), equalTo('abcde'));

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
