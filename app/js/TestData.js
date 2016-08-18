//TESTDATA
function TestData($scope) {
    "use strict";
    var self = this;

    self.testDFA = function () {
        $scope.config.inputWord = "abc";
        $scope.addStateWithPresets(100, 100);
        $scope.addStateWithPresets(100, 300);
        $scope.addStateWithPresets(300, 300);
        $scope.addStateWithPresets(300, 100);
        $scope.addFinalState(3);

        $scope.addTransition(0, 1, "a");
        $scope.addTransition(1, 2, "b");
        $scope.addTransition(2, 3, "c");
        $scope.addTransition(3, 0, "l");

    };

    self.testPDA = function () {
        $scope.config.inputWord = "ab";
        $scope.addStateWithPresets(200, 200);
        $scope.addStateWithPresets(500, 200);

        $scope.addTransition(0, 0, "a", "⊥", "A");
        $scope.addTransition(0, 0, "a", "A", "AA");
        $scope.addTransition(0, 1, "b", "A", "ε");
        $scope.addTransition(1, 1, "b", "A", "ε");
        $scope.addTransition(1, 1, "b", "⊥", "ε");

    };

    self.testPDA2 = function () {
        $scope.config.inputWord = "ab";
        $scope.addStateWithPresets(200, 200);
        $scope.addStateWithPresets(500, 200);
        $scope.addStateWithPresets(500, 500);

        $scope.addTransition(0, 1, "a", "⊥", "A");
        $scope.addTransition(1, 2, "b", "A", "ε");
    };

    self.testNFA = function () {
        $scope.config.inputWord = "abc";
        $scope.addStateWithPresets(100, 100);
        $scope.addStateWithPresets(100, 300);
        $scope.addStateWithPresets(300, 300);
        $scope.addStateWithPresets(300, 100);
        $scope.addFinalState(3);

        $scope.addTransition(0, 1, "a");
        $scope.addTransition(0, 2, "a");
        $scope.addTransition(1, 2, "b");
        $scope.addTransition(2, 3, "c");
        $scope.addTransition(3, 0, "l");
    };


}