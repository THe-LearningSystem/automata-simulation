//DPA
function DPA($scope, $translate) {
    "use strict";

    var self = this;
    DFA.apply(this, arguments);


    /**Overrides**/
    //the statediagram controlling the svg diagramm
    $scope.simulator = new SimulationDPA($scope);
    //the statediagram controlling the svg diagramm
    $scope.statediagram = new StateDiagramDPA($scope, "#diagramm-svg");

}