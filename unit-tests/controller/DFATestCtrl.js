angular
    .module('automata-simulation')
    .controller('DFACtrl', DFACtrl);


function DFACtrl($scope) {
    $scope.safeApply = scopeSaveApply;

    $scope.automatonData = new AutomatonDataDFA();

    $scope.core = new DFACore($scope);
    $scope.states = new States($scope);
    $scope.transitions = new Transitions($scope);
}