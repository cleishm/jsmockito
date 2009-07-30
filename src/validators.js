// vi:ts=2 sw=2 expandtab

JsMockito.validators = {
  once: function() { 
    return function(interactions, matchers, mockName, displayContext) {
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
      if (displayContext) {
        description.append(", 'this' being ");
        matchers[0].describeTo(description);
      }
      throw description.get();
    }
  }
};
