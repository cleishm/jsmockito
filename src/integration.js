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
    JsMockito.each(JsMockito._export, function(exported) {
      target[exported] = JsMockito[exported];
    });

    JsMockito.each(JsMockito.Verifiers._export, function(exported) {
      target[exported] = JsMockito.Verifiers[exported];
    });
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
   * Make the public JsMockito API available to Node.js / NodeUnit
   * @see JsMockito.Integration.importTo(global)
   */
  Nodeunit: function() {
    JsMockito.Integration.importTo(global);
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
  },

  /**
   * Make the public JsMockito API available to jSpec
   * @see JsMockito.Integration.importTo(jSpec.defaultContext)
   */
  jSpec: function() {
    JsMockito.Integration.importTo(jSpec.defaultContext);
  }
};
