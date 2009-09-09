JsHamcrest.Integration.screwunit();
JsMockito.Integration.screwunit();

Screw.Matchers.throwsMessage = function(exceptionText) {
  return new JsHamcrest.SimpleMatcher({
    matches: function(actualFunction) {
      try {
        actualFunction();
      } catch (e) {
        if (JsHamcrest.Matchers.equalTo(exceptionText).matches(e)) {
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
