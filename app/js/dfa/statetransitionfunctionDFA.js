function StatetransitionfunctionDFA($scope) {
    "use strict";

    var self = this;
    self.data = {};
    //ADD Listener
    $scope.updateListeners.push(self);

    self.updateFunction = function () {

        self.data.alphabet = $scope.config.alphabet;
        self.updateStates();
        self.updateStateTransitionFunctions();
        self.updateStartState();
        self.updateFinalStates();

    };

    /**
     * Updates the states in the stf
     */
    self.updateStates = function () {
        self.data.states = [];
        _.forEach($scope.config.states, function (state, key) {
            var tmpObject = {};
            tmpObject.name = state.name;
            tmpObject.selectedClass = ($scope.statediagram.selectedState !== null && $scope.statediagram.selectedState.id == state.id) ? 'selected' : '';

            if (state.id == $scope.simulator.animated.currentState && $scope.simulator.status === "accepted") {
                tmpObject.animatedClass = 'animated-accepted';
            } else if (state.id == $scope.simulator.animated.currentState && $scope.simulator.status === "not accepted") {
                tmpObject.animatedClass = 'animated-not-accepted';
            } else if (state.id == $scope.simulator.animated.currentState) {
                tmpObject.animatedClass = 'animated-currentstate';
            } else {
                tmpObject.animatedClass = '';
            }
            self.data.states.push(tmpObject);
        });

    };

    /**
     * Updates the statetransitionfunctions
     */
    self.updateStateTransitionFunctions = function () {
        self.data.statetransitionfunction = [];
        //we go through every state and check if there is a transition and then we save them in the statetransitionfunction array
        _.forEach($scope.config.states, function (state, keyOuter) {
            _.forEach($scope.config.transitions, function (transition, key) {
                var tmpObject = {};

                if (transition.fromState === state.id) {
                    var stateTransition = transition;
                    var selectedTransition = false;
                    tmpObject.selectedClass = ($scope.statediagram.selectedTransition !== null && _.find($scope.statediagram.selectedTransition.names, {
                        id: transition.id
                    }) !== undefined) ? 'selected' : '';

                    tmpObject.animatedClass = ($scope.simulator.animated.transition && $scope.simulator.animated.transition.id === stateTransition.id) ? 'animated-transition' : '';

                    tmpObject.fromState = $scope.getStateById(stateTransition.fromState).name;
                    tmpObject.toState = $scope.getStateById(stateTransition.toState).name;
                    tmpObject.char = stateTransition.name;

                    self.data.statetransitionfunction.push(tmpObject);
                }
            });
        });

    };

    /**
     * Updates the startstate
     */
    self.updateStartState = function () {
        //Update of Startstate
        var startState = $scope.getStateById($scope.config.startState);
        self.data.startState = (startState !== undefined) ? startState.name : '';
    };

    /**
     * Updates the final state
     */
    self.updateFinalStates = function () {
        self.data.finalStates = [];
        _.forEach($scope.config.finalStates, function (finalState, key) {
            finalState = $scope.getStateById(finalState);
            self.data.finalStates.push(finalState.name);
        });
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

    $scope.$watch('statediagram.selectedState', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            self.updateFunction();
        }
    });

    $scope.$watch('statediagram.selectedTransition', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            self.updateFunction();
        }
    });
    $scope.$watch('simulator.status', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            self.updateFunction();
        }
    });
}