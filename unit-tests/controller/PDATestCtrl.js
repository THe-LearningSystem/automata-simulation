angular
    .module('automata-simulation')
    .controller('PDACtrl', PDACtrl);


function PDACtrl($scope) {
    var pda = new PDA($scope);

}