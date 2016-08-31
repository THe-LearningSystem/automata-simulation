//2TESTDATA
function TestData($scope) {
    "use strict";
    var self = this;

    self.testDFA = function () {
        console.log("called");

        var state1 = $scope.states.createWithPresets(100, 100);
        var state2 = $scope.states.createWithPresets(100, 300);
        var state3 = $scope.states.createWithPresets(300, 300);
        var state4 = $scope.states.createWithPresets(300, 100);
        $scope.states.final.create(state1);

        $scope.transitions.create(state1, state2, "a");
        $scope.transitions.create(state2, state3, "b");
        $scope.transitions.create(state3, state4, "c");
        $scope.transitions.create(state4, state1, "l");

    };

    self.testPDA = function () {
        $scope.config.inputWord = "ab";
        $scope.addStateWithPresets(200, 200);
        $scope.addStateWithPresets(500, 200);

        $scope.addTransition(0, 0, "a", "⊥", "A");
        $scope.addTransition(0, 0, "a", "A", "AA");
        $scope.addTransition(0, 1, "b", "A", "ε");
        $scope.addTransition(1, 1, "b", "A", "ε");
    };
    self.testNPDA = function () {
        $scope.config.inputWord = "ab";
        $scope.addStateWithPresets(200, 200);
        $scope.addStateWithPresets(500, 200);
        $scope.addStateWithPresets(200, 500);

        $scope.addTransition(0, 0, "a", "⊥", "A");
        $scope.addTransition(0, 0, "a", "A", "AA");
        $scope.addTransition(0, 1, "b", "A", "ε");
        $scope.addTransition(1, 1, "b", "A", "ε");
        $scope.addTransition(0, 2, "b", "A", "ε");
        $scope.addTransition(2, 2, "b", "A", "ε");
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
        $scope.addFinalState(2);
        $scope.addFinalState(3);

        $scope.addTransition(0, 1, "a");
        $scope.addTransition(0, 2, "a");
        $scope.addTransition(1, 2, "b");
        $scope.addTransition(2, 3, "c");
        $scope.addTransition(3, 0, "l");
    };


}