angular
    .module('automata-simulation')
    .controller('DPACtrl', DPACtrl);


function DPACtrl($scope) {

    var dpa = new DPA($scope);

}
