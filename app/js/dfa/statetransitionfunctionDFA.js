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
        _.forEach($scope.config.states, function (state) {
            var tmpObject = {};
            tmpObject.name = state.name;
            tmpObject.selectedClass = ($scope.statediagram.selectedState !== null && $scope.statediagram.selectedState.id == state.id) ? 'selected' : '';

            if (state.id == $scope.simulator.animated.currentState && $scope.simulator.status === "accepted") {
                tmpObject.animatedClass = 'animated-accepted';
            } else if (state.id == $scope.simulator.animated.currentState && $scope.simulator.status === "notAccepted") {
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
        _.forEach($scope.config.states, function (state) {
            _.forEach($scope.config.transitions, function (transition) {
                var tmpObject = {};

                if (transition.fromState === state.id) {
                    var stateTransition = transition;
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
     * Updates the startState
     */
    self.updateStartState = function () {
        //Update of startState
        var startState = $scope.getStateById($scope.config.startState);
        self.data.startState = (startState !== undefined) ? startState.name : '';
    };

    /**
     * Updates the final state
     */
    self.updateFinalStates = function () {
        self.data.finalStates = [];
        _.forEach($scope.config.finalStates, function (finalState) {
            finalState = $scope.getStateById(finalState);
            self.data.finalStates.push(finalState.name);
        });
    };

    self.updateAutomaton = function () {
        /*var tmpEditStates = self.editStates.replaceAll(" ", "").split(",");
         _.forEach(tmpEditStates, function (state) {
         if ($scope.getStateByName(state) === undefined && state !== "") {
         $scope.addState(state, 100, 100);
         }
         });
         console.log(tmpEditStates);
         var tmpEditAlphabet = self.editAlphabet.replaceAll(" ", "").split(",");
         _.forEach(tmpEditAlphabet, function (char) {
         if (_.find($scope.config.alphabet, char) === undefined) {
         if (char !== "")
         $scope.config.alphabet.push(char);
         }
         });
         console.log(tmpEditAlphabet);
         */
        $scope.resetAutomaton();
        var transitions = self.parseSTF(self.editSTF.replaceAll(" ", ""));

        _.forEach(transitions, function (transition) {
            if (!$scope.existsStateWithName(transition.fromState))
                $scope.addState(transition.fromState, 100, 100);
            if (!$scope.existsStateWithName(transition.toState))
                $scope.addState(transition.toState, 100, 100);
            $scope.addTransition($scope.getStateByName(transition.fromState).id, $scope.getStateByName(transition.toState).id, transition.name);

        });

        $scope.changeStartState($scope.getStateByName(self.editStartState).id);
        var tmpEditFinalSTates = self.editFinalStates.replaceAll(" ", "").split(",");
        _.forEach(tmpEditFinalSTates, function (state) {
            if (state !== "")
                $scope.addFinalState($scope.getStateByName(state).id);

        });

    };

    self.parseSTF = function (input) {
        var tmpArray = [];
        for (var i = 0; i < input.length; i++) {
            if (input[i] == "(") {
                for (var x = i; x < input.length; x++) {
                    if (input[x] == ")") {
                        tmpArray.push(self.parseTransition(input.substring(i + 1, x)));


                        i = x + 1;
                        break;
                    }
                }

            }
        }
        return tmpArray;
    };

    self.parseTransition = function (string) {
        var tmpObj = {};
        var tmpArray = string.split(",");

        _.forEach(tmpArray, function (value, key) {
            if (string !== "") {
                if (key == 0) {
                    tmpObj.fromState = value;
                } else if (key == 1) {
                    tmpObj.name = value;
                } else {
                    tmpObj.toState = value;
                }

            } else
                return undefined;
        });

        return tmpObj;
    };


    self.showSTFEditModal = function () {
        //change it to angular function
        $("#stf-edit-modal").modal();
        self.editStartState = $scope.getStateById($scope.config.startState).name;
        self.editFinalStates = "";
        _.forEach($scope.config.finalStates, function (state, key) {
            self.editFinalStates += $scope.getStateById(state).name;
            if (key + 1 !== $scope.config.finalStates.length) {
                self.editFinalStates += ", "
            }
        });
        self.editSTF = "";
        _.forEach(self.data.statetransitionfunction, function (stf, key) {
            self.editSTF += "(" + stf.fromState + ", " + stf.char + ", " + stf.toState + ")";
            if (key + 1 !== self.data.statetransitionfunction.length) {
                self.editSTF += ", "
            }
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