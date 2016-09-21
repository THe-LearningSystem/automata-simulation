angular.module('automata-simulation').controller('DFAController', DFAController);

function DFAController($scope, hotkeys) {
    console.log("created DFA");
    prepareScope($scope);

    //Config Object
    $scope.automatonData = new autoSim.AutomatonData('DFA');
    $scope.core = new autoSim.DFACore($scope);
    $scope.states = new autoSim.States($scope);
    $scope.states.menu = new autoSim.StateMenus($scope);
    $scope.transitions = new autoSim.Transitions($scope);
    $scope.transitions.menu = new autoSim.TransitionMenus($scope);
    $scope.simulator = new autoSim.Simulator($scope);
    $scope.statediagram = new autoSim.StateDiagram($scope);
    $scope.statediagram.grid = new autoSim.StateDiagramGrid($scope);
    $scope.statediagram.menu = new autoSim.StateDiagramMenu($scope);
    $scope.statediagram.zoom = new autoSim.StateDiagramZoom($scope);
    $scope.table = new autoSim.Table($scope);

    $scope.testAgent = new TestData($scope);


    $scope.testAgent.testDFA();


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