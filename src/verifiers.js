// vi:ts=2 sw=2 expandtab

JsMockito.verifiers = {
  never: function() {
    return new JsMockito.verifiers.Times(0);
  },

  zeroInteractions: function() {
    return new JsMockito.verifiers.ZeroInteractions();
  },

  times: function(wanted) { 
    return new JsMockito.verifiers.Times(wanted);
  },

  once: function() { 
    return new JsMockito.verifiers.Times(1);
  }
};

JsMockito.Verifier = function() { this.init.apply(this, arguments) };
JsMockito.Verifier.prototype = {
  init: function() { },

  verify: function(mock) {
    var self = this;
    return mock._jsMockitoVerifier(JsHamcrest.Matchers.anything(), function() {
      self.verifyInteractions.apply(self, arguments);
    });
  },

  verifyInteractions: function(funcName, interactions, matchers, withContext) {
  },

  buildDescription: function(message, funcName, matchers, withContext) {
    var description = new JsHamcrest.Description();
    description.append(message + ': ' + funcName + '(');
    JsMockito.each(matchers.splice(1), function(matcher, i) {
      if (i > 0)
        description.append(', ');
      description.append('<');
      matcher.describeTo(description);
      description.append('>');
    });
    description.append(")");
    if (withContext) {
      description.append(", 'this' being ");
      matchers[0].describeTo(description);
    }
    return description;
  }
};

JsMockito.verifier('Times', {
  init: function(wanted) {
    this.wanted = wanted;
  },

  verifyInteractions: function(funcName, interactions, matchers, withContext) {
    var interactions = JsMockito.grep(interactions, function(interaction) {
      return JsMockito.matchArray(matchers, interaction);
    });
    if (interactions.length == this.wanted)
      return;

    var message;
    if (interactions.length == 0) {
      message = 'Wanted but not invoked';
    } else if (this.wanted == 0) {
      message = 'Never wanted but invoked';
    } else if (this.wanted == 1) {
      message = 'Wanted 1 invocation but got ' + interactions.length;
    } else {
      message = 'Wanted ' + this.wanted + ' invocations but got ' + interactions.length;
    }

    var description = this.buildDescription(message, funcName, matchers, withContext);
    throw description.get();
  }
});

JsMockito.verifier('ZeroInteractions', {
  verify: function(mock) {
    var neverVerifier = JsMockito.verifiers.never();
    JsMockito.each(mock._jsMockitoMockFunctions(), function(mockFunc) {
      neverVerifier.verify(mockFunc)();
    });
  }
});
