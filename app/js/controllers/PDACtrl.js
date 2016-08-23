angular.module('automata-simulation').controller('PDACtrl', PDACtrl);

function PDACtrl($scope, hotkeys) {
    console.log("created PDA");
    $scope.safeApply = scopeSaveApply;

    var pda = new PDA($scope);
    createHotkeys($scope, hotkeys);

}