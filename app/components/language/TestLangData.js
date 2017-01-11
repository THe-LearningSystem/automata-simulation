function TestLangData($scope) {
    "use strict";
    var self = this;
    
    console.log("langTest");

    self.testLANG = function () {
        /* var prod1 = $scope.production.create("S", "aA");
        var prod2 = $scope.production.create("A", "bB");
        var prod3 = $scope.production.create("B", "bA");
        var prod4 = $scope.production.create("B", "e"); */ 
    
        var prod1L = "S";
        var prod1R = "aA";
        var prod2L = "A";
        var prod2R = "bB";
        var prod3L = "B";
        var prod3R = "bA";
        var prod4L = "B";
        var prod4R = "e";
        
        $scope.grammar.create("A, B, S", "a, b, e", [], "S");

        console.log($scope.production.create(prod1L, prod1R));
        console.log($scope.production.create(prod2L, prod2R));
        console.log($scope.production.create(prod3L, prod3R));
        console.log($scope.production.create(prod4L, prod4R));
    };
}