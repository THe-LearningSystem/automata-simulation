function TestLangData($scope) {
    "use strict";
    var self = this;

    self.testLANG1 = function () {
        // At least 2 times 'a' and then as many of 'a' and then as many of 'b'.
        
        var rule00 = $scope.langProductionRules.create("S", "aA");
        var rule01 = $scope.langProductionRules.create("A", "aA");
        var rule02 = $scope.langProductionRules.create("A", "aB");
        var rule03 = $scope.langProductionRules.create("B", "bB");
        var rule04 = $scope.langProductionRules.create("B", "ε");
        
        $scope.languageData.inputWord = "aaab";
        $scope.langProductionRules.changeStart(rule00);
    };
    
    self.testLANG2 = function () {
        // At least 2 times 'a' and then as many of 'a' and then as many of 'b'.
        
        var rule10 = $scope.langProductionRules.create("S", "aA");
        var rule11 = $scope.langProductionRules.create("A", "aA");
        var rule12 = $scope.langProductionRules.create("A", "bA");
        var rule13 = $scope.langProductionRules.create("A", "cA");
        var rule14 = $scope.langProductionRules.create("A", "dA");
        var rule15 = $scope.langProductionRules.create("A", "aB");
        var rule16 = $scope.langProductionRules.create("B", "bB");
        var rule17 = $scope.langProductionRules.create("B", "ε");
        
        $scope.languageData.inputWord = "aabcda";
        $scope.langProductionRules.changeStart(rule10);
    };
}
