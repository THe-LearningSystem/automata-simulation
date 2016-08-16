//TableDFA
function TableDFA($scope) {
    var self = this;
    self.states = [];
    $scope.updateListeners.push(self);

    /**
     * Creates the state array for the views
     */
    self.getStatesWithTransition = function () {
        var tmpObject;
        _.forEach($scope.config.states, function (state) {
            tmpObject = {};
            self.prepareFromState(tmpObject, state);
            tmpObject.trans = [];

            // iterates over all alphabet
            _.forEach($scope.config.alphabet, function (character) {
                var foundTransition = [];

                // iterates over the available transitions and saves found transitions
                _.forEach($scope.config.transitions, function (transition) {
                    if (transition.fromState === state.id && transition.name === character) {
                        foundTransition.push(transition);
                    }
                });

                var trans = {};
                trans.alphabet = character;

                // saves the found Transition in "Trans.State"
                if (foundTransition.length !== 0) {
                    trans.stateNames = [];
                    _.forEach(foundTransition, function (value) {
                        var tmpToState = $scope.getStateById(value.toState);
                        var tmpStateTrans = {};
                        tmpStateTrans.name = tmpToState.name;
                        if ($scope.statediagram.selectedTransition !== null && $scope.statediagram.selectedTransition.fromState === state.id && $scope.statediagram.selectedTransition.toState === tmpToState.id) {
                            tmpStateTrans.selectedClass = "selected";
                        }
                        if ($scope.simulator.animated.nextState == tmpToState.id && value.name == $scope.simulator.animated.transition.name) {
                            tmpStateTrans.animatedClass = "animated-nextstate";
                        }
                        trans.stateNames.push(tmpStateTrans);
                    });

                } else {
                    trans.State = "";
                }

                tmpObject.trans.push(trans);
            });
            self.states.push(tmpObject);
        });
    };

    /**
     * Prepares the firstState (the fromState)
     * @param tmpObject
     */
    self.prepareFromState = function (tmpObject, state) {
        tmpObject.name = state.name;
        tmpObject.id = state.id;
        // marks the current active state at the simulation in the table
        if (($scope.statediagram.selectedState !== null && $scope.statediagram.selectedState.id == state.id) || ($scope.statediagram.selectedTransition !== null && $scope.statediagram.selectedTransition.fromState === state.id)) {
            tmpObject.selectedClass = "selected";
        }
        if ($scope.simulator.animated.currentState == state.id) {
            if ($scope.simulator.status === "accepted") {
                tmpObject.animatedClass = "animated-accepted";
            } else if ($scope.simulator.status === "not accepted") {
                tmpObject.animatedClass = "animated-not-accepted";
            } else {
                tmpObject.animatedClass = "animated-currentstate";
            }
        }

        tmpObject.finalState = $scope.isStateAFinalState(state.id);

        tmpObject.startState = ($scope.config.startState === state.id);
    };

    /**
     * creates the alphabet array for the view
     */
    self.getAlphabet = function () {
        var tmpObject;
        _.forEach($scope.config.alphabet, function (character) {
            tmpObject = {};
            tmpObject.character = character;

            if ($scope.statediagram.selectedTransition !== null && _.find($scope.statediagram.selectedTransition.names, {
                    name: character
                }) !== undefined) {
                tmpObject.selectedClass = "selected";
            }

            if ($scope.simulator.animated.transition && $scope.simulator.animated.transition.name === character) {
                tmpObject.animatedClass = 'animated-transition';
            }
            self.alphabet.push(tmpObject);
        });
    };

    /**
     * called by the listener
     */
    self.updateFunction = function () {
        self.states = [];
        self.alphabet = [];

        //prepare alphabet
        self.getAlphabet();

        // iterates over all States
        self.getStatesWithTransition();


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
    $scope.$watch('simulator.animated.nextState', function (newValue, oldValue) {
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