function TestLangData($scope) {
    "use strict";
    var self = this;
    
    console.log("langTest");

    self.testLANG = function () {
    
        var prod1L = "S";
        var prod1R = "hA";
        
        var prod2L = "B";
        var prod2R = "lC";
        
        var prod3L = "A";
        var prod3R = "eB";
        
        var prod4L = "C";
        var prod4R = "lD";
        
        var prod5L = "D";
        var prod5R = "oG";
        
        var prod6L = "G";
        var prod6R = "e";
        

        $scope.productions.create(prod1L, prod1R);
        $scope.productions.create(prod2L, prod2R);
        $scope.productions.create(prod3L, prod3R);
        $scope.productions.create(prod4L, prod4R);
        $scope.productions.create(prod5L, prod5R);
        $scope.productions.create(prod6L, prod6R);
        
        $scope.derivationsequence.calculateCurrentTerminal($scope.productions.startVariable);
        $scope.derivationsequence.calculateCurrentTerminal($scope.derivationsequence.nextLeft);
        $scope.derivationsequence.calculateCurrentTerminal($scope.derivationsequence.nextLeft);
        $scope.derivationsequence.calculateCurrentTerminal($scope.derivationsequence.nextLeft);
        $scope.derivationsequence.calculateCurrentTerminal($scope.derivationsequence.nextLeft);
        $scope.derivationsequence.calculateCurrentTerminal($scope.derivationsequence.nextLeft);
    };
}