// vi:ts=2 sw=2 expandtab
JsHamcrest.Integration.screwunit();
JsMockito.Integration.screwunit();

Screw.Matchers.throwsMessage = function(exceptionText) {
  return new JsHamcrest.SimpleMatcher({
    matches: function(actualFunction) {
      try {
        actualFunction();
      } catch (e) {
        var message = e.message || e;
        if (JsHamcrest.Matchers.equalTo(exceptionText).matches(message)) {
          return true;
        } else {
          throw e;
        }
      }
      return false;
    },

    describeTo: function(description) {
      description.append('throws "').append(exceptionText).append('"');
    }
  });
}

var MyObject = function() {};
MyObject.prototype = {
  greeting: function() { return "hello" },
  farewell: function() { return "goodbye" }
};

var MyUnwritableObject = function() {};

Object.defineProperties(MyUnwritableObject.prototype, {
  greeting: { enumerable: false, writable: false, value: function() { return "hello" } },
  farewell: { enumerable: true, writable: false, value: function() { return "goodbye" } }
});
