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
            
            
            var tmp;
            if ($scope.simulator.animated.transition && $scope.simulator.animated.transition.name === transitionName) {
                tmp = '<span class="animated-transition">' + transitionName + '</span>';
            } else {
                tmp = transitionName;
            }
            self.alphabet.push(tmp);
        }

        // iterates over all States
        for (var i = 0; i < dfa.states.length; i++) {
            var tmpState = dfa.states[i];
            var tmpObject = {};
            tmpObject.id = tmpState.id;
            // marks the current active state at the simulation in the table
            if ($scope.simulator.animated.currentState == tmpState.id) {
                tmpObject.name = '<span class="animated-currentstate">' + tmpState.name + '</span>';
            } else {
                tmpObject.name = tmpState.name;
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

                    if ($scope.simulator.animated.nextState == tmpToState.id && foundTransition.name == $scope.simulator.animated.transition.name) {
                        trans.State = '<span class="animated-nextstate">' + tmpToState.name + '</span>';
                    } else {
                        trans.State = tmpToState.name;
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


}
