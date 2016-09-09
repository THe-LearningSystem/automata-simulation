angular.module('automata-simulation').controller('NFACtrl', NFACtrl);

function NFACtrl($scope, hotkeys) {
    console.log("created NFA");
    $scope.saveApply = scopeSaveApply;

    var nfa = new NFA($scope);
    createHotkeys($scope, hotkeys);
}