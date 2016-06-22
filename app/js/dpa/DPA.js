//DPA
function DPA($scope, $translate) {
    "use strict";

    var self = this;
    DFA.apply(this, arguments);

    $scope.defaultConfig.stackFirstSymbol = "#";
    $scope.defaultConfig.stack = [$scope.defaultConfig.stackFirstSymbol];

    //Config Object
    $scope.config = cloneObject($scope.defaultConfig);


    /**Overrides**/
    //the statediagram controlling the svg diagramm
    $scope.simulator = new SimulationDPA($scope);
    //the statediagram controlling the svg diagramm
    $scope.statediagram = new StateDiagramDPA($scope, "#diagramm-svg");
    // the table where states and transitions are shown
    $scope.table = new TableDPA($scope);




    $scope.pushOnStack = function () {

    };


    $scope.popFromStack = function () {

    };
}