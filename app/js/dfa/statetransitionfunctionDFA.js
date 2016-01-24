"use strict";

var statetransitionfunctionDFA = function($scope){

	var self = this;
    self.functionData = {};
    self.functionData.states = '';
    self.functionData.startState = '';
    self.functionData.finalStates = '';
   	self.functionData.transitions = '';
   	self.functionData.statetransitionfunction = [];


    $scope.$watchCollection('config', function() {
        self.updateFunction();
    });


    $scope.$watch('statetransitionfunction.functionData.startState', function() {
        self.changeStartState();
    });


    self.updateFunction = function(){
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
    	arrayAlphabet = _.uniq(arrayAlphabet);
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
			
			self.functionData.statetransitionfunction.push(stringStateTransitions);
    		}
    	}


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


    self.changeStartState = function() {
        var arrayStates = [];
        console.log(self.functionData.startState.length);

        for (var i = 0; i < self.functionData.startState.length; i++) {
            arrayStates[i] = self.functionData.startState.charAt(i);
        };
        console.log(arrayStates);
    }
}