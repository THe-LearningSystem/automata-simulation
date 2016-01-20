"use strict";

var statetransitionfunctionDFA = function($scope){

	var self = this;
    self.functionData = {};
    self.functionData.states = '';
    self.functionData.startState = '';
    self.functionData.finalStates = '';
   	self.functionData.transitions = '';
   	self.functionData.statetransitionfunction = '';


    self.update = function(){
    	var arrayAlphabet = [];
    	var stringAlphabet = '';
    	var stringStates = '';
    	var stringStateTransitions = '';
    	var stringAllStateTransitions = '';
    	var stringStartState = '';
    	var startState;
    	var stringFinalStates = '';
    	var finalState;

    	//Update of the Alphabet
    	for (var i = 0; i < $scope.config.transitions.length; i++) {
    		arrayAlphabet[i] = $scope.config.transitions[i].name;
    	}
    	arrayAlphabet = jQuery.unique(arrayAlphabet);
    	for (var i = 0; i < arrayAlphabet.length; i++) {
    		stringAlphabet = stringAlphabet + arrayAlphabet[i];
    		if (i < arrayAlphabet.length - 1) {
    			stringAlphabet = stringAlphabet + ', ';
    		}
    	}
    	
    	self.functionData.transitions = stringAlphabet;



    	//Update of States
    	for (var i = 0; i < $scope.config.states.length; i++) {
    		stringStates = stringStates + $scope.config.states[i].name;
    		if (i < $scope.config.states.length - 1) {
    			stringStates = stringStates + ', ';
    		}
    	}

    	self.functionData.states = stringStates;



    	//Update of statetransitionfunction
    	for (var i = 0; i < $scope.config.transitions.length; i++) {
    		if ($scope.config.transitions[i] != undefined) {
    		var stateTransition = $scope.config.transitions[i];
    		var tmp = '';
    		tmp = $scope.getStateById(stateTransition.fromState);
    		stringStateTransitions = '(' + tmp.name + ', ' 
    		tmp = stateTransition.name;
    		stringStateTransitions = stringStateTransitions + tmp + ', ';
    		tmp = $scope.getStateById(stateTransition.toState);
    		stringStateTransitions = stringStateTransitions + tmp.name + ')';
			
			stringAllStateTransitions = stringAllStateTransitions + stringStateTransitions + '\n';
    		}
    	}

    	self.functionData.textareaRows = i;
    	// console.log(self.functionData.textareaRows);
    	self.functionData.statetransitionfunction = stringAllStateTransitions;



    	//Update of Startstate
    	startState = $scope.getStateById($scope.config.startState);
    	if(startState != undefined){
    		stringStartState = stringStartState + startState.name;
    	}

    	self.functionData.startState = stringStartState;



    	//Update of Finalstates
    	for (var i = 0; i < $scope.config.finalStates.length; i++) {
    		finalState = $scope.getStateById($scope.config.finalStates[i]);
    		if(finalState != undefined){
    			stringFinalStates = stringFinalStates + finalState.name;
    		}
    		if (i < $scope.config.finalStates.length - 1) {
    			stringFinalStates = stringFinalStates + ', ';
    		}
    	}

    	self.functionData.finalStates = stringFinalStates;
    }
}