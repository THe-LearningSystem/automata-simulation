function TestLangData($scope) {
    "use strict";
    var self = this;
    
    console.log("langTest")

    self.testLANG = function () {
        $scope.production.create("S", "aA", 100, 100);
        $scope.production.create("A", "bA", 100, 100);
        $scope.production.create("A", "bB", 100, 100);
        $scope.production.create("B", "bA", 100, 100);
    };
}