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



        self.functionData.transitions = $scope.config.alphabet;



        //Update of States
        self.functionData.states = [];
        for (i = 0; i < $scope.config.states.length; i++) {
            stringStates = '';
            var selectedClass = "";
            if ($scope.graphdesigner.selectedState !== null && $scope.graphdesigner.selectedState.id == $scope.config.states[i].id) {
                selectedClass = "selected";
            }
            if ($scope.config.states[i].id == $scope.simulator.animated.currentState && $scope.simulator.status === "accepted") {
                stringStates += '<span class="animated-accepted ' + selectedClass + '">';
            } else if ($scope.config.states[i].id == $scope.simulator.animated.currentState && $scope.simulator.status === "not accepted") {
                stringStates += '<span class="animated-not-accepted ' + selectedClass + '">';
            } else if ($scope.config.states[i].id == $scope.simulator.animated.currentState) {
                stringStates += '<span class="animated-currentstate ' + selectedClass + '">';
            } else {
                stringStates += '<span class="' + selectedClass + '">';
            }

            stringStates += $scope.config.states[i].name;
            stringStates += '</span>';
            if (i < $scope.config.states.length - 1) {
                stringStates = stringStates + ', ';
            }
            self.functionData.states.push(stringStates);
        }



        //Update of statetransitionfunction
        self.functionData.statetransitionfunction = [];
        for (i = 0; i < $scope.config.transitions.length; i++) {
            if ($scope.config.transitions[i] !== undefined) {
                var stateTransition = $scope.config.transitions[i];
                var selectedTransition = "";
                if ($scope.graphdesigner.selectedTransition !== null && _.find($scope.graphdesigner.selectedTransition.names, {
                        id: $scope.config.transitions[i].id
                    }) !== undefined) {
                    console.log("found it");
                    selectedTransition = "selected";
                }
                var tmp = '';
                if ($scope.simulator.animated.transition && $scope.simulator.animated.transition.id === stateTransition.id) {
                    stringStateTransitions = '(<span class="animated-currentstate ' + selectedTransition + '">' + $scope.getStateById(stateTransition.fromState).name + ', ';
                    stringStateTransitions += stateTransition.name + ", ";
                    stringStateTransitions += $scope.getStateById(stateTransition.toState).name + '</span>)';
                } else {
                    stringStateTransitions = '(<span class=" ' + selectedTransition + '">' + $scope.getStateById(stateTransition.fromState).name + ', ';
                    stringStateTransitions += stateTransition.name + ', ';
                    stringStateTransitions += $scope.getStateById(stateTransition.toState).name + '</span>)';
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
            stringStartState += '<span class="">' + startState.name + '</span>';
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

    $scope.$watch('graphdesigner.selectedState', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            self.updateFunction();
        }
    });

    $scope.$watch('graphdesigner.selectedTransition', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            console.log("test");
            console.log(newValue);
            self.updateFunction();
        }
    });
}