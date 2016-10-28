angular.module('automata-simulation').controller('DTAController', DTAController);

function DTAController($scope, hotkeys) {
    console.log("created DTA");
    prepareScope($scope);

    //Config Object
    $scope.automatonData = new autoSim.AutomatonData('DTA');
    $scope.core = new autoSim.DFACore($scope);
    $scope.states = new autoSim.States($scope);
    $scope.states.menu = new autoSim.StateMenus($scope);
    $scope.transitions = new autoSim.TransitionsDTA($scope);
    $scope.transitions.menu = new autoSim.TransitionMenusDTA($scope);
    $scope.simulator = new autoSim.SimulatorDTA($scope);
    $scope.statediagram = new autoSim.StateDiagram($scope);
    $scope.statediagram.grid = new autoSim.StateDiagramGrid($scope);
    $scope.statediagram.menu = new autoSim.StateDiagramMenu($scope);
    $scope.statediagram.zoom = new autoSim.StateDiagramZoom($scope);

    $scope.testAgent = new TestData($scope);
    $scope.testAgent.testDTA();

}
