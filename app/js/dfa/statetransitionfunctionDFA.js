function StatetransitionfunctionDFA($scope) {
    "use strict";

    var self = this;
    self.functionData = {};
    self.functionData.states = [];
    self.functionData.startState = '';
    self.functionData.finalStates = '';
    self.functionData.transitions = '';
    self.functionData.statetransitionfunction = [];
    //ADD Listener
    $scope.updateListeners.push(self);


    self.updateFunction = function () {
        var arrayAlphabet = [];
        var stringAlphabet = '';
        var stringStates = '';
        var stringStateTransitions = '';
        var stringAllStateTransitions = '';
        var stringStartState = '';
        var startState;
        var stringFinalStates = '';
        var finalState;
        var i;


        //Update of the Alphabet
        for (i = 0; i < $scope.config.transitions.length; i++) {
            arrayAlphabet[i] = $scope.config.transitions[i].name;
        }
        arrayAlphabet = _.uniq(arrayAlphabet);
        for (i = 0; i < arrayAlphabet.length; i++) {
            stringAlphabet += arrayAlphabet[i];
            if (i < arrayAlphabet.length - 1) {
                stringAlphabet += ', ';
            }
        }
        self.functionData.transitions = stringAlphabet;



        //Update of States
        self.functionData.states = [];
        for (i = 0; i < $scope.config.states.length; i++) {
            stringStates = '';
            if ($scope.config.states[i].id == $scope.simulator.animated.currentState) {
                stringStates += '<span class="animated-currentstate">';
                stringStates += $scope.config.states[i].name;
                stringStates += '</span>';
                if (i < $scope.config.states.length - 1) {
                    stringStates = stringStates + ', ';
                }
            } else {
                stringStates += $scope.config.states[i].name;
                if (i < $scope.config.states.length - 1) {
                    stringStates += ', ';
                }
            }
            self.functionData.states.push(stringStates);
        }



        //Update of statetransitionfunction
        self.functionData.statetransitionfunction = [];
        for (i = 0; i < $scope.config.transitions.length; i++) {
            if ($scope.config.transitions[i] !== undefined) {
                var stateTransition = $scope.config.transitions[i];
                var tmp = '';
                if ($scope.simulator.animated.transition === stateTransition.id) {
                    stringStateTransitions = '( <span class="animated-currentstate">' + $scope.getStateById(stateTransition.fromState).name + '</span>, <span class="animated-transition">';
                    stringStateTransitions += stateTransition.name + '</span>, <span class="animated-nextstate">';
                    stringStateTransitions += $scope.getStateById(stateTransition.toState).name + '</span>)';
                } else {
                    stringStateTransitions = '(' + $scope.getStateById(stateTransition.fromState).name + ', ';
                    stringStateTransitions += stateTransition.name + ', ';
                    stringStateTransitions += $scope.getStateById(stateTransition.toState).name + ')';
                }
                if (i < $scope.config.transitions.length - 1) {
                    stringStateTransitions += ', ';
                }

                self.functionData.statetransitionfunction.push(stringStateTransitions);
            }
        }


        //Update of Startstate
        startState = $scope.getStateById($scope.config.startState);
        if (startState !== undefined) {
            stringStartState += startState.name;
        }

        self.functionData.startState = stringStartState;



        //Update of Finalstates
        for (i = 0; i < $scope.config.finalStates.length; i++) {
            finalState = $scope.getStateById($scope.config.finalStates[i]);
            if (finalState !== undefined) {
                stringFinalStates += finalState.name;
            }
            if (i < $scope.config.finalStates.length - 1) {
                stringFinalStates += ', ';
            }
        }

        self.functionData.finalStates = stringFinalStates;

        var arrayStates = [];
        for (i = 0; i < self.functionData.startState.length; i++) {
            arrayStates[i] = self.functionData.startState.charAt(i);
        }
    };

    
    /**************
     **SIMULATION**
     *************/

    $scope.$watch('simulator.animated.currentState', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            self.updateFunction();
        }
    });
    
    $scope.$watch('simulator.animated.transition', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            self.updateFunction();
        }
    });
}
