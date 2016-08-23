angular.module('automata-simulation').controller('NPDACtrl', NPDACtrl);

function NPDACtrl($scope, hotkeys) {
    console.log("created NPDA");
    $scope.safeApply = scopeSaveApply;

    var npda = new NPDA($scope);
    createHotkeys($scope, hotkeys);

}