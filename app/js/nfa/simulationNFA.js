//Simulator for the simulation of the NFA
function SimulationNFA($scope) {
    "use strict";

    var self = this;
    SimulationDFA.apply(self, arguments);

    /**
     * checks if a word is accepted from the automata
     * @return {Boolean} [description]
     */
    self.isInputWordAccepted = function (inputWord) {
        return self.getAllPossibleSequences(inputWord).length !== 0;
    };

    /**
     * Returns all possible sequences, if an empty array is returned, there is no possibleSequence
     * @param inputWord
     * @returns {Array}
     */
    self.getAllPossibleSequences = function (inputWord) {
        var possibleSequences = [];
        //1.Get the all possible transitions
        var stackSequences = self.getNextTransitions($scope.config.startState, inputWord[0]);
        //as long as there are possibleSequences do
        while (stackSequences.length !== 0) {
            var tmpSequence = stackSequences.pop();
            if (tmpSequence.length === inputWord.length && $scope.isStateAFinalState(_.last(tmpSequence).toState)) {
                possibleSequences.push(tmpSequence);
            } else if (inputWord.length > tmpSequence.length) {
                var tmpSequences = [];
                var newTmpSequence = [];
                _.forEach(self.getNextTransitions(_.last(tmpSequence).toState, inputWord[tmpSequence.length]), function (value) {
                    newTmpSequence = _.concat(tmpSequence, value);
                    tmpSequences.push(newTmpSequence);
                });
                stackSequences = _.concat(stackSequences, tmpSequences);
            }
        }
        return possibleSequences;
    };

    self.getNextTransitions = function (fromState, transitionName) {
        var transitions = [];
        for (var i = 0; i < $scope.config.transitions.length; i++) {
            var transition = $scope.config.transitions[i];
            if (transition.fromState == fromState && transition.name == transitionName) {
                transitions.push([transition]);
            }
        }
        return transitions;
    };

}