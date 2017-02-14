function TestLangData($scope) {
    "use strict";
    var self = this;
    
    console.log("langTest");

    self.testLANG = function () {
    
        var prod1L = "S";
        var prod1R = "aA";
        var prod2L = "A";
        var prod2R = "bB";
        var prod3L = "B";
        var prod3R = "bA";
        var prod4L = "B";
        var prod4R = "e";
        

        $scope.productions.create(prod1L, prod1R);
        $scope.productions.create(prod2L, prod2R);
        $scope.productions.create(prod3L, prod3R);
        $scope.productions.create(prod4L, prod4R);
    };
}