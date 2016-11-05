function TestLangData($scope) {
    "use strict";
    var self = this;

    self.testLANG = function () {
        console.log("Test");
        
        var left1 = 
        
        $scope.LangProduction.create("S", "aA", 100, 100);
        $scope.LangProduction.create("S", "bA", 100, 100);
        $scope.LangProduction.create("A", "bB", 100, 100);
        $scope.LangProduction.create("B", "bA", 100, 100);
        console.log("Tes2t");
    };
}