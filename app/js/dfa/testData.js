"use strict";

//GRAPHDESIGNER for the svg diagramm
var testData = function($scope) {
    self = this;

    self.testDFA = function() {
        $scope.config.finalStates.push(3);
        $scope.inputWord = "abc";
        $scope.addState("SO", 50, 50);
        $scope.addState("S1", 50, 200);
        $scope.addState("S2", 200, 200);
        $scope.addState("S3", 200, 50);


        $scope.config.startState = 0;
        $scope.addTransition(0, 1, "a");
        $scope.addTransition(1, 2, "b");
        $scope.addTransition(2, 1, "b");
        $scope.addTransition(2, 3, "c");
        $scope.addTransition(3, 0, "l");

    }

}