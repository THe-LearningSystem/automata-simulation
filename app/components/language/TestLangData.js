function TestLangData($scope) {
    "use strict";
    var self = this;

    console.log("langTest");

    self.testLANG = function () {

        var rule1 = $scope.productions.create("A", "aB");
        var rule2 = $scope.productions.create("B", "bC");
        //var rule21 = $scope.productions.create("B", "iC");
        var rule3 = $scope.productions.create("C", "cA");

        $scope.productions.changeStart(rule1.id);
        $scope.productions.changeEnd(rule3.left);
    };
}
