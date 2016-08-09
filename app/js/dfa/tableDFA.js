//TableDFA
function TableDFA($scope) {
    var self = this;
    self.states = [];
    $scope.updateListeners.push(self);

    self.updateFunction = function () {
        self.states = [];
        self.alphabet = [];
        var dfa = $scope.config;

        var alphabetCounter;


        //prepare alphabet
        var tmpObject;
        _.forEach($scope.config.alphabet, function (character, key) {
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

        // iterates over all States

        _.forEach($scope.config.states, function (state, key) {

            tmpObject = {};
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

            if ($scope.isStateAFinalState(state.id))
                tmpObject.finalState = true;
            else
                tmpObject.finalState = false;

            if ($scope.config.startState === state.id)
                tmpObject.startState = true;
            else
                tmpObject.startState = false;

            tmpObject.trans = [];

            // iterates over all aplphabet
            _.forEach($scope.config.alphabet, function (character, key) {
                var foundTransition = null;

                // iterates over the available transitions and saves found transitions
                _.forEach($scope.config.transitions, function (transition, key) {
                    if (transition.fromState === state.id && transition.name === character) {
                        foundTransition = transition;
                        return;
                    }
                });

                var trans = {};
                trans.alphabet = character;

                // saves the found Transition in "Trans.State"
                if (foundTransition !== null) {
                    var tmpToState = $scope.getStateById(foundTransition.toState);
                    trans.stateName = tmpToState.name;
                    if ($scope.statediagram.selectedTransition !== null && $scope.statediagram.selectedTransition.toState === tmpToState.id && tmpObject.id === $scope.statediagram.selectedTransition.fromState) {
                        trans.selectedClass = "selected";
                    }
                    if ($scope.simulator.animated.nextState == tmpToState.id && foundTransition.name == $scope.simulator.animated.transition.name) {
                        trans.animatedClass = "animated-nextstate";
                    }
                } else {
                    trans.State = "";
                }

                tmpObject.trans.push(trans);
            });
            self.states.push(tmpObject);
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

}