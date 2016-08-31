angular.module('automata-simulation').controller('DFACtrl', DFACtrl);

function DFACtrl($scope, hotkeys) {
    console.log("created DFA");
    $scope.safeApply = scopeSaveApply;
    //for debug purposes better way for accessing in console?
    window.debugScope = $scope;
    //Debug Mode (that the browser doesn't ask if you want to reload, or for the unit testing)
    $scope.debug = true;

    //Config Object
    $scope.automatonData = new AutomatonDataDFA();

    $scope.core = new DFACore($scope);
    $scope.states = new States($scope);
    $scope.transitions = new Transitions($scope);
    //$scope.table = new TableDFA($scope);
    $scope.simulator = new SimulationDFA($scope);
    // $scope.simulation = new SimulationDFA($scope);

    $scope.testAgent = new TestData($scope);


    /**CREATE_COMPONENTS_START**/
    /*
     //the simulator controlling the simulation
     $scope.simulator = new SimulationDFA($scope);
     // the table where states and transitions are shown
     $scope.table = new TableDFA($scope);
     //the statediagram controlling the svg diagram
     $scope.statediagram = new StateDiagramDFA($scope, "#diagram-svg");
     //the statetransitionfunction controlling the statetransitionfunction-table
     $scope.statetransitionfunction = new StatetransitionfunctionDFA($scope);
     //the bulkTester
     $scope.bulktester = new BulkTesterDFA($scope);
     //the portation Component
     $scope.portation = new PortationDFA($scope);
     //for the test data
     $scope.testData = new TestData($scope);

     createHotkeys($scope, hotkeys);
     */
}