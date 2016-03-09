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
            tmpObject.name = tmpState.name;
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
                    trans.State = tmpToState.name;
                } else {
                    trans.State = "";
                }

                tmpObject.trans.push(trans);
            }
            self.states.push(tmpObject);

        }

    };

}