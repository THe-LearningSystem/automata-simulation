//TableDFA
function TableDFA($scope) {
    var self = this;
    self.states = [];
    $scope.updateListeners.push(self);


    self.updateFunction = function () {
        self.states = [];
        var dfa = $scope.config;
        // iterates over all States
        for (var i = 0; i < dfa.states.length; i++) {
            var tmpState = dfa.states[i];
            var tmpObject = {};
            tmpObject.id = tmpState.id;
            tmpObject.trans = [];

            // iterates over all aplphabet 
            for (var alphabetCounter = 0; alphabetCounter < dfa.alphabet.length; alphabetCounter++) {
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

                    console.log($scope.simulator.animated.transition + " First");
                    console.log(foundTransition.id + " Second");
                    if ($scope.simulator.animated.transition == foundTransition.id) {
                        trans.State = '<span style="color:red">' + tmpToState.name + '</span>';
                    } else {
                        trans.State = tmpToState.name;
                    }
                } else {
                    trans.State = "";
                }

                // marks the current active state at the simulation in the table
                if ($scope.simulator.animated.currentState == tmpState.id) {
                    tmpObject.name = '<span class="animated-transition">' + tmpState.name + '</span>';
                } else {
                    tmpObject.name = tmpState.name;
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
    

}
