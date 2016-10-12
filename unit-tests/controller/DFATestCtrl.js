angular
    .module('automata-simulation')
    .controller('DFACtrl', DFACtrl);

function DFACtrl($scope) {
    $scope.saveApply = scopeSaveApply;

    $scope.automatonData = new autoSim.AutomatonData();

    $scope.core = new autoSim.DFACore($scope);
    $scope.states = new autoSim.States($scope);
    $scope.transitions = new autoSim.Transitions($scope);
}