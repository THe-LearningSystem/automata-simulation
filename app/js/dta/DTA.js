//TURING
function DTA($scope, $translate) {
    "use strict";
    
    var self = this;
    DFA.apply(this, arguments);
    
    $scope.defaultConfig.tapeAlphabet = [];
    $scope.defaultConfig.blankSymbol = "";
    
    /**Overrides**/
    //the simulator conrtolling the svg-diagram
    $scope.simulator = new SimulationDTA($scope);
    //the statediagram controlling the svg-diagram
    $scope.statediagram = new StateDiagramDTA($scope, "#diagramm-svg");
    //the table where states and transitions are shown
    $scope.table = new TableDTA($scope);
}