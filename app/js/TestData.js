

//GRAPHDESIGNER for the svg diagramm
function TestData($scope) {
    "use strict";
    var self = this;

    self.testDFA = function() {
        console.log("ASD ");
        $scope.inputWord = "abc";
        $scope.addStateWithPresets(50, 50);
        $scope.addStateWithPresets(50, 200);
        $scope.addStateWithPresets(200, 200);
        $scope.addStateWithPresets( 200, 50);
        $scope.addFinalState(3);


        $scope.addTransition(0, 1, "a");
        $scope.addTransition(1, 2, "b");
        $scope.addTransition(2, 3, "c");
        $scope.addTransition(3, 0, "l");

    };

}