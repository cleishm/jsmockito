// vi:ts=2 sw=2 expandtab

JsMockito.verifiers = {
  never: function() {
    return new JsMockito.verifiers.Never();
  },

  zeroInteractions: function() {
    return new JsMockito.verifiers.ZeroInteractions();
  },

  once: function() { 
    return new JsMockito.verifiers.Once();
  }
};

JsMockito.Verifier = function() {};
JsMockito.Verifier.prototype = {
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

JsMockito.verifier('Never', {
  verifyInteractions: function(funcName, interactions, matchers, withContext) {
    var interaction = JsMockito.find(interactions, function(interaction) {
      return JsMockito.matchArray(matchers, interaction);
    });
    if (interaction === undefined)
      return;

    var description = this.buildDescription(
      'Never wanted but invoked', funcName, matchers, withContext);
    throw description.get();
  }
});

JsMockito.verifier('Once', {
  verifyInteractions: function(funcName, interactions, matchers, withContext) {
    var interactions = JsMockito.grep(interactions, function(interaction) {
      return JsMockito.matchArray(matchers, interaction);
    });
    if (interactions.length == 1)
      return;

    var description = this.buildDescription(
      (interactions.length == 0)?
        'Wanted but not invoked' : 'Wanted 1 invocation but got ' + interactions.length,
      funcName, matchers, withContext);
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
