angular.module('automata-simulation').controller('NFAController', NFAController);

function NFAController($scope, hotkeys) {
    console.log("created NFA");
    prepareScope($scope);

    //Config Object
    $scope.automatonData = new autoSim.AutomatonData('NFA', true);
    $scope.core = new autoSim.DFACore($scope);
    $scope.states = new autoSim.States($scope);
    $scope.states.menu = new autoSim.StateMenus($scope);
    $scope.transitions = new autoSim.TransitionsNFA($scope);
    $scope.transitions.menu = new autoSim.TransitionMenus($scope);
    $scope.simulator = new autoSim.Simulator($scope);
    $scope.statediagram = new autoSim.StateDiagram($scope);
    $scope.statediagram.grid = new autoSim.StateDiagramGrid($scope);
    $scope.statediagram.menu = new autoSim.StateDiagramMenu($scope);
    $scope.statediagram.zoom = new autoSim.StateDiagramZoom($scope);
    $scope.table = new autoSim.Table($scope);


    $scope.testAgent = new TestData($scope);


    $scope.testAgent.testNFA();
}