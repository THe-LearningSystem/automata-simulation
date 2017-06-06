angular.module('automata-simulation').controller('TMController', TMController);

function TMController($scope, hotkeys, $uibModal) {
    console.log("created TM");
    prepareScope($scope);

    //Config Object
    $scope.automatonData = new autoSim.AutomatonData('TM');
    $scope.core = new autoSim.DFACore($scope);
    $scope.states = new autoSim.States($scope);
    $scope.states.menu = new autoSim.StateMenus($scope);
    $scope.transitions = new autoSim.TransitionsTM($scope);
    $scope.transitions.menu = new autoSim.TransitionMenusTM($scope);
    $scope.simulator = new autoSim.SimulatorTM($scope, $uibModal);
    $scope.table = new autoSim.TableTM($scope);
    $scope.statediagram = new autoSim.StateDiagram($scope);
    $scope.statediagram.grid = new autoSim.StateDiagramGrid($scope);
    $scope.statediagram.menu = new autoSim.StateDiagramMenu($scope);
    $scope.statediagram.zoom = new autoSim.StateDiagramZoom($scope);

    $scope.testAgent = new TestData($scope);
    $scope.testAgent.testTM();

}
