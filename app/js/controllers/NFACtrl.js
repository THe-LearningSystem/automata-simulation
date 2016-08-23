angular.module('automata-simulation').controller('NFACtrl', NFACtrl);

function NFACtrl($scope, hotkeys) {
    console.log("created NFA");
    $scope.safeApply = scopeSaveApply;

    var nfa = new NFA($scope);
    createHotkeys($scope, hotkeys);
}