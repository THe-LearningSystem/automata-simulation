//Deterministic Turing Automaton
function DTA($scope, $translate) {
    "use strict";
    
    var self = this;
    DFA.apply(this, arguments);
    
    $scope.defaultConfig.type = "DTA";
    $scope.defaultConfig.tapeAlphabet = [];
    $scope.defaultConfig.blankSymbol = "";
    
    $scope.config = _.cloneDeep($scope.defaultConfig);
    
    /**Overrides**/
    //the simulator conrtolling the svg-diagram
    $scope.simulator = new SimulationDTA($scope);
    //the statediagram controlling the svg-diagram
    $scope.statediagram = new StateDiagramDTA($scope, "#diagram-svg");
    //the table where states and transitions are shown
    $scope.table = new TableDTA($scope);
}