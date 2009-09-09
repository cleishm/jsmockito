// vi:ts=2 sw=2 expandtab

JsMockito.Integration = {
  importTo: function(target) {
    var importMethods = [
      'mock', 'mockFunction', 'spy', 'when', 'verify', 'verifyZeroInteractions'
    ];

    for (var i = importMethods.length; i > 0; --i) {
      var methodName = importMethods[i-1];
      target[methodName] = JsMockito[methodName];
    }

    for (var methodName in JsMockito.verifiers) {
      target[methodName] = JsMockito.verifiers[methodName];
    }
  },

  screwunit: function() {
    JsMockito.Integration.importTo(Screw.Matchers);
  }
};
