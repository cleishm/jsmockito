// vi:ts=2 sw=2 expandtab
Screw.Unit(function() {
  describe('JsMockito mocking of native types', function() {
    JsMockito.each(JsMockito.nativeTypes, function(ntype, name) {
      describe('#' + name, function() {
        JsMockito.each(ntype.methods, function(methodName) {
          describe("native object", function() {
            it("should have a " + methodName + " method", function() {
              var nObj = new ntype.type();
              assertThat(nObj[methodName], typeOf("function"));
            });
          });

          describe("class mock", function() {
            it("should have a " + methodName + " mock method", function() {
              var mockNObj = mock(ntype.type);
              assertThat(JsMockito.isMock(mockNObj[methodName]), equalTo(true));
            });
          });
        });
      });
    });

    describe('bulk verification of Array class', function() {
      var mockArray;
      before(function() {
        mockArray = mock(Array);
      });

      it("should verifyZeroInteractions when there are none", function() {
        verifyZeroInteractions(mockArray);
      });

      it("should fail to verifyZeroInterations when there are", function() {
        mockArray.push(5);
        assertThat(function() {
          verifyZeroInteractions(mockArray);
        }, throwsMessage('Never wanted but invoked: obj.push()'));
      });
    });
  });
});
