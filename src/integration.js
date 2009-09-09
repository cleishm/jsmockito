// vi:ts=2 sw=2 expandtab

JsMockito.Integration = {
  importTo: function(target) {
    for (var i = JsMockito._export.length; i > 0; --i) {
      var exported = JsMockito._export[i-1];
      target[exported] = JsMockito[exported];
    }

    for (var i = JsMockito.Verifiers._export.length; i > 0; --i) {
      var exported = JsMockito.Verifiers._export[i-1];
      target[exported] = JsMockito.Verifiers[exported];
    }
  },

  screwunit: function() {
    JsMockito.Integration.importTo(Screw.Matchers);
  }
};
