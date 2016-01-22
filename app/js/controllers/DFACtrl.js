"use strict";

angular
    .module('AutoSim')
    .controller('DFACtrl', DFACtrl);


function DFACtrl($scope) {

	var dfa = new DFA($scope);

}