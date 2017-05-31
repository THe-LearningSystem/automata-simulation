function TestLangData($scope) {
    "use strict";
    var self = this;
    
    console.log("langTest");

    self.testLANG = function () {

        var rule1 = $scope.productions.create("S", "hA");
        var rule2 = $scope.productions.create("B", "CD");
        var rule3 = $scope.productions.create("A", "eB");
        var rule4 = $scope.productions.create("C", "ll");
        var rule5 = $scope.productions.create("D", "oG");
        var rule6 = $scope.productions.create("G", "-");
        
        //var trans1 = $scope.transitions.create(rule1, rule3);
        
        $scope.productions.changeEndSign('-');
        $scope.productions.changeStart(rule1.left);
    };
}