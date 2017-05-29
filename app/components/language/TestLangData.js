function TestLangData($scope) {
    "use strict";
    var self = this;
    
    console.log("langTest");

    self.testLANG = function () {

        var rule1 = $scope.productions.create("S", "hA");
        
        //$scope.productions.create("B", "lC");
        var rule2 = $scope.productions.create("B", "CD");
        
        var rule3 = $scope.productions.create("A", "eB");
        
        //$scope.productions.create("C", "lD");
        var rule4 = $scope.productions.create("C", "ll");
        
        var rule5 = $scope.productions.create("D", "oG");
        
        var rule6 = $scope.productions.create("G", "-");
        
        $scope.productions.changeEndSign('-');
        $scope.productions.changeStart(rule1.left);
    };
}