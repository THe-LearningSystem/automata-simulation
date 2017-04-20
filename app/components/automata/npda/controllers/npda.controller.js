angular.module('automata-simulation').controller('NPDAController', NPDAController);

function NPDAController($scope, hotkeys) {
    console.log("created NPDA");
    prepareScope($scope);

    //Config Object
    $scope.automatonData = new autoSim.AutomatonData('NPDA', true);
    $scope.core = new autoSim.DFACore($scope);
    $scope.states = new autoSim.States($scope);
    $scope.states.menu = new autoSim.StateMenus($scope);
    $scope.transitions = new autoSim.TransitionsNPDA($scope);
    $scope.transitions.menu = new autoSim.TransitionMenusPDA($scope);
    $scope.simulator = new autoSim.SimulatorPDA($scope);
    $scope.statediagram = new autoSim.StateDiagram($scope);
    $scope.statediagram.grid = new autoSim.StateDiagramGrid($scope);
    $scope.statediagram.menu = new autoSim.StateDiagramMenu($scope);
    $scope.statediagram.zoom = new autoSim.StateDiagramZoom($scope);

    $scope.testAgent = new TestData($scope);
    $scope.testAgent.testNPDA();

}