// vi:ts=2 sw=2 expandtab

JsMockito.verifiers = {
  never: function() {
    return function(interactions, matchers, mockName, withContext) {
      var interaction = JsMockito.find(interactions, function(interaction) {
        return JsMockito.matchArray(matchers, interaction);
      });
      if (interaction === undefined)
        return;

      var description = new JsHamcrest.Description();
      description.append('Never wanted but invoked: ' + mockName + '(');
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
      throw description.get();
    }
  },

  once: function() { 
    return function(interactions, matchers, mockName, withContext) {
      var interaction = JsMockito.find(interactions, function(interaction) {
        return JsMockito.matchArray(matchers, interaction);
      });
      if (interaction)
        return;

      var description = new JsHamcrest.Description();
      description.append('Wanted but not invoked: ' + mockName + '(');
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
      throw description.get();
    }
  }
};
