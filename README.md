JsMockito
---------

  http://github.com/chrisleishman/jsmockito/tree/master

JsMockito is a JavaScript stub/mock framework heavily inspired by
Mockito. To quote the mockito website:

  "Mockito is a mocking framework that tastes really good. It
   lets you write beautiful tests with a clean & simple API.
   Mockito doesn't give you a hangover because the tests are
   very readable and they produce clean verification errors."

JsMockito aims to try and reproduce the clean & simple API, with a
JavaScript twist. And why not add some variation to your drinking habits?


What do you serve it with?
--------------------------

JsMockito must be served with JsHamcrest.  Not only do they go well
together, it's essential to avoid a very nasty hangover.  Get
JsHamcrest from here:

  http://github.com/danielfm/jshamcrest/


How to drink it?
----------------

To use JsMockito with a JavaScript unit test framework, follow the usual
installation/configuration instructions for the framework and plug JsMockito
into it. If you're integrating with Screw.Unit (and why wouldn't you?) then you
just need to make the following calls:

    JsHamcrest.Integration.screwunit();
    JsMockito.Integration.screwunit();

Once installed, you can verify with interactions:

    var mockedObject = mock(Array);
  
    // -- start code under test --
    mockedObject.push("one");
    // -- end code under test --
  
    verify(mockedObject).push("one");

Or you can stub method calls:

    var mockedObject = mock(Array);
  
    when(mockedObject).get(1).thenReturn("hello world");
    
    // -- start code under test --
    alert(mockedObject.get(1));
  
    // the following alerts 'true' as get(99) was not stubbed
    alert(typeof (mockedObject.get(99)) === 'undefined');
    // -- end code under test --

For a JavaScript twist, you can also mock functions:

    mockFunc = mockFunction();
    when(mockFunc)(anything()).then(function(arg) {
      return "foo " + arg;
    });
  
    // -- start code under test --
    mockFunc("bar");
    // -- end code under test --
  
    verify(mockFunc)(anything());

    // or if you want to verify the scope it was called with, use:
    verify(mockFunc).call(this, anything())

Mockitos are also good for spys
-------------------------------

Real super spies don't drink martinis - they go for mockitos. And just like
Mockito, JsMockito supports 'spying' (e.g. partial mocking) on real functions
and objects and verifing how they were interacted with.

An example with functions:

    realFunc = function(msg) { alert(msg) };
    mockFunc = spy(realFunc);

    // -- start code under test --
    // the following alerts 'hello world'
    mockFunc("hello world");
    // -- end code under test --

    verify(mockFunc)("hello world");

or with objects:

    realObj = new Array();
    mockedObj = spy(realObj);

    when(mockedObj).pop().thenReturn("bar");

    // -- start code under test --
    mockedObject.push("foo");
    alert(realObj.length); // alerts '1'

    alert(mockedObject.pop()); // alerts 'bar'
    alert(realObj.length); // still alerts '1'
    // -- end code under test --
 
    verify(mockedObject).push("foo");
    verify(mockedObject).pop();

For more examples and documentation, run 'ant doc' and then look in the doc directory.


Who is your bartender?
----------------------

This variation is served to you by Chris Leishman and friends.  Also a big
thank you to the mockito guys for the inspiration!

Also thanks to the JsHamcrest authors, who made this easy.
