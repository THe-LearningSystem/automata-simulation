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
        for (alphabetCounter = 0; alphabetCounter < dfa.alphabet.length; alphabetCounter++) {
            var transitionName = dfa.alphabet[alphabetCounter];
            var selectedTrans = "";
            if ($scope.graphdesigner.selectedTransition !== null && _.find($scope.graphdesigner.selectedTransition.names, {
                    name: transitionName
                }) !== undefined) {
                selectedTrans = "selected";
            }

            var tmp;
            if ($scope.simulator.animated.transition && $scope.simulator.animated.transition.name === transitionName) {
                tmp = '<span class="animated-transition ' + selectedTrans + '">' + transitionName + '</span>';
            } else {
                tmp = '<span class="' + selectedTrans + '">' + transitionName + '</span>';
            }
            self.alphabet.push(tmp);
        }

        // iterates over all States
        for (var i = 0; i < dfa.states.length; i++) {
            var tmpState = dfa.states[i];
            var tmpObject = {};
            tmpObject.id = tmpState.id;
            // marks the current active state at the simulation in the table
            var selectedClass = "";
            if ($scope.graphdesigner.selectedState !== null && $scope.graphdesigner.selectedState.id == tmpState.id) {
                selectedClass = "selected";
            }
            if ($scope.simulator.animated.currentState == tmpState.id) {
                var animatedClass = "";
                if ($scope.simulator.status === "accepted") {
                    animatedClass = "animated-accepted";
                } else if ($scope.simulator.status === "not accepted") {
                    animatedClass = "animated-not-accepted";
                } else {
                    animatedClass = "animated-currentstate";
                }
                tmpObject.name = '<span class="' + animatedClass + ' ' + selectedClass + '">' + tmpState.name + '</span>';
            } else {
                tmpObject.name = '<span class="' + selectedClass + '">' + tmpState.name + '</span>';
            }
            tmpObject.trans = [];


            // iterates over all aplphabet 
            for (alphabetCounter = 0; alphabetCounter < dfa.alphabet.length; alphabetCounter++) {
                var tmpTransitionName = dfa.alphabet[alphabetCounter];
                var foundTransition = null;

                // iterates over the available transitions and saves found transitions
                for (var transitionCounter = 0; transitionCounter < dfa.transitions.length; transitionCounter++) {
                    var tmpTransition = dfa.transitions[transitionCounter];
                    if (tmpTransition.fromState === tmpState.id && tmpTransition.name === tmpTransitionName) {
                        foundTransition = tmpTransition;

                    }
                }

                var trans = {};
                trans.alphabet = tmpTransitionName;

                // saves the found Transition in "Trans.State"
                if (foundTransition !== null) {
                    var tmpToState = $scope.getStateById(foundTransition.toState);
                    var selectedTrans = "";
                    if ($scope.graphdesigner.selectedTransition !== null && $scope.graphdesigner.selectedTransition.toState === tmpToState.id) {
                        selectedTrans = "selected";
                    }
                    if ($scope.simulator.animated.nextState == tmpToState.id && foundTransition.name == $scope.simulator.animated.transition.name) {
                        trans.State = '<span class="animated-nextstate ' + selectedTrans + '">' + tmpToState.name + '</span>';
                    } else {
                        trans.State = '<span class="' + selectedTrans + '">' + tmpToState.name + '</span>';
                    }
                } else {
                    trans.State = "";
                }



                tmpObject.trans.push(trans);
            }
            self.states.push(tmpObject);

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
    $scope.$watch('simulator.animated.nextState', function (newValue, oldValue) {
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
            self.updateFunction();
        }
    });

}