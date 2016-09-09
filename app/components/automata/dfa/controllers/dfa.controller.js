angular.module('automata-simulation').controller('DFAController', DFAController);

function DFAController($scope, hotkeys) {
    console.log("created DFA");
    $scope.saveApply = scopeSaveApply;
    //for debug purposes better way for accessing in console?
    window.debugScope = $scope;
    //Debug Mode (that the browser doesn't ask if you want to reload, or for the unit testing)
    $scope.debug = true;

    //Config Object
    $scope.automatonData = new autoSim.AutomatonData();
    $scope.core = new autoSim.DFACore($scope);
    $scope.states = new autoSim.States($scope);
    $scope.states.menu = new autoSim.StateMenus($scope);
    $scope.transitions = new autoSim.Transitions($scope);
    $scope.transitions.menu = new autoSim.TransitionMenus($scope);
    $scope.simulator = new autoSim.Simulator($scope);
    $scope.statediagram = new autoSim.StateDiagram($scope);
    $scope.statediagram.menu = new autoSim.StateDiagramMenu($scope);
    $scope.statediagram.zoom = new autoSim.StateDiagramZoomHandler($scope);

    $scope.testAgent = new TestData($scope);


    //Hotkeys
    autoSim.hotkeysGenerator($scope, hotkeys);

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