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
  },

  /**
   * Make the public JsMockito API available to JsTestDriver
   * @see JsMockito.Integration.importTo(window)
   */
  JsTestDriver: function() {
    JsMockito.Integration.importTo(window);
  },

  /**
   * Make the public JsMockito API available to JsUnitTest
   * @see JsMockito.Integration.importTo(JsUnitTest.Unit.Testcase.prototype)
   */
  JsUnitTest: function() {
    JsMockito.Integration.importTo(JsUnitTest.Unit.Testcase.prototype);
  },

  /**
   * Make the public JsMockito API available to YUITest
   * @see JsMockito.Integration.importTo(window)
   */
  YUITest: function() {
    JsMockito.Integration.importTo(window);
  },

  /**
   * Make the public JsMockito API available to QUnit
   * @see JsMockito.Integration.importTo(window)
   */
  QUnit: function() {
    JsMockito.Integration.importTo(window);
  },

  /**
   * Make the public JsMockito API available to jsUnity
   * @see JsMockito.Integration.importTo(jsUnity.env.defaultScope)
   */
  jsUnity: function() {
    JsMockito.Integration.importTo(jsUnity.env.defaultScope);
  }
};
