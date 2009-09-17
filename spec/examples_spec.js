// vi:ts=2 sw=2 expandtab
Screw.Unit(function() {
  describe('JsMockito examples', function() {
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
        var mockedString = mock(String);

        //stubbing
        when(mockedString).charAt(0).thenReturn('f');
        when(mockedString).charAt(1).thenThrow('An exception');

        //following alerts "f"
        assertThat(mockedString.charAt(0), equalTo("f"));

        //following throws exception 'An exception'
        assertThat(function() { mockedString.charAt(1) },
          throwsMessage('An exception'));

        //following alerts "undefined" as charAt(999) was not stubbed
        assertThat(typeof (mockedString.charAt(999)), equalTo("undefined"));

        //can also verify a stubbed invocation, although this is usually redundant
        verify(mockedString).charAt(0);
      });

      it("should stub functions", function() {
        var mockedFunc = mockFunction();

        //stubbing
        when(mockedFunc)(0).thenReturn('f');
        when(mockedFunc)(1).thenThrow('An exception');

        //following alerts "f"
        assertThat(mockedFunc(0), equalTo("f"));

        //following throws exception 'An exception'
        assertThat(function() { mockedFunc(1) }, throwsMessage('An exception'));

        //following alerts "undefined" as charAt(999) was not stubbed
        assertThat(typeof (mockedFunc(999)), equalTo("undefined"));

        //can also verify a stubbed invocation, although this is usually redundant
        verify(mockedFunc)(0);
      });
    });

    describe("Matching Arguments", function() {
      it("should verify arguments", function() {
        var mockedString = mock(String);
        var mockedFunc = mockFunction();

        //stubbing using JsHamcrest
        when(mockedString).charAt(lessThan(10)).thenReturn('f');
        when(mockedFunc)(containsString('world')).thenReturn('foobar');

        //following alerts "f"
        assertThat(mockedString.charAt(5), equalTo("f"));

        //following alerts "foobar"
        assertThat(mockedFunc('hello world'), equalTo('foobar'));

        //you can also use matchers in verification
        verify(mockedString).charAt(greaterThan(4));
        verify(mockedFunc)(equalTo('hello world'));
      });
    });
  });
});
