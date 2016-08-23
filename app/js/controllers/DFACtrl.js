angular.module('automata-simulation').controller('DFACtrl', DFACtrl);

function DFACtrl($scope, hotkeys) {
    console.log("created DFA");
    $scope.safeApply = scopeSaveApply;
    var dfa = new DFA($scope);
    createHotkeys($scope, hotkeys);
}