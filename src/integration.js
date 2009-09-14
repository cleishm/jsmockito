// vi:ts=2 sw=2 expandtab

/**
 * Verifiers
 * @namespace
 */
JsMockito.Integration = {
  /**
   * Import the public JsMockito API into the specified object (namespace)
   *
   * @param {object} target An object (namespace) that will be populated with
   * the functions from the public JsMockito API
   */
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

  /**
   * Make the public JsMockito API available in Screw.Unit
   * @see JsMockito.Integration.importTo(Screw.Matchers)
   */
  screwunit: function() {
    JsMockito.Integration.importTo(Screw.Matchers);
  }
};
