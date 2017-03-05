function TestLangData($scope) {
    "use strict";
    var self = this;
    
    console.log("langTest");

    self.testLANG = function () {

        $scope.productions.create("S", "hA");
        
        //$scope.productions.create("B", "lC");
        $scope.productions.create("B", "CD");
        
        $scope.productions.create("A", "eB");
        
        //$scope.productions.create("C", "lD");
        $scope.productions.create("C", "ll");
        
        $scope.productions.create("D", "oG");
        
        $scope.productions.create("G", "-");
        
        $scope.derivationsequence.callGetNextTerminal();
    };
}