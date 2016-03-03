angular
    .module('automata-simulation')
    .controller('DFACtrl', DFACtrl);


function DFACtrl($scope) {
    console.log("created DFA");
	var dfa = new DFA($scope);

}