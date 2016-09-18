//Simulator for the simulation of the automata
autoSim.SimulatorPDA = function ($scope) {
    var self = this;
    autoSim.Simulator.apply(this, arguments);


    self.stack = new autoSim.PDAStack();

    //save the reference
    var parentReset = this.reset;

    /**
     * Should reset the simulation
     */
    self.reset = function () {
        self.stack = new autoSim.PDAStack();
        parentReset.apply(this);

        //TODO:
        //$scope.statediagram.addToStack(self.stack.stackContainer);
    };

    /**
     * for stack pop used
     */
    self.animateTransitionOverride = function () {
        self.stack.pop();
    };

    //saving reference
    var parentChangeNextStateToCurrentState = self.changeNextStateToCurrentState;

    /**
     * stack push integrated
     */
    self.changeNextStateToCurrentState = function () {
        self.stack.push(self.animated.transition.writeToStack);
        parentChangeNextStateToCurrentState();
    };


    /**
     * Returns all possible sequences, if an empty array is returned, there is no possibleSequence
     * @param inputWord
     * @returns {Array}
     */
    self.getAllPossibleSequences = function (inputWord) {
        //init needed variables
        var possibleSequences = [];
        var stackSequences = [];
        var tmpSequences = [];

        if (inputWord.length !== 0) {
            tmpSequences = self.getNextTransitions($scope.states.startState, inputWord[0], new autoSim.PDAStack().stackFirstSymbol);
            for (var i = 0; i < tmpSequences.length; i++) {
                var tmpSequence = {};
                tmpSequence.stack = new autoSim.PDAStack();
                tmpSequence.stack.pop();
                tmpSequence.stack.push(tmpSequences[i].writeToStack);
                tmpSequence.value = [tmpSequences[i]];
                stackSequences.push(tmpSequence);
            }
        }

        while (stackSequences.length !== 0) {
            tmpSequence = stackSequences.pop();
            if (tmpSequence.value.length === inputWord.length && tmpSequence.stack.stackContainer.length === 0) {
                possibleSequences.push(tmpSequence.value);
            } else if (inputWord.length > tmpSequence.value.length && tmpSequence.stack.stackContainer.length !== 0) {
                tmpSequences = [];
                _.forEach(self.getNextTransitions(_.last(tmpSequence.value).toState, inputWord[tmpSequence.value.length], tmpSequence.stack.pop()), function (sequence) {
                    var newTmpSequence = {};
                    newTmpSequence.stack = new autoSim.PDAStack(tmpSequence.stack.stackContainer);
                    newTmpSequence.stack.push(sequence.writeToStack);
                    newTmpSequence.value = _.concat(tmpSequence.value, sequence);
                    tmpSequences.push(newTmpSequence);
                });
                stackSequences = _.concat(stackSequences, tmpSequences);
            }
        }
        return possibleSequences;
    };


    /**
     * Returns the farthest possible sequences
     * @param inputWord
     * @returns {Array}
     */
    self.getFarthestPossibleSequences = function (inputWord) {
        //init needed variables
        var farthestSequences = [];
        var stackSequences = [];
        var tmpSequences = [];


        if (inputWord.length !== 0) {
            tmpSequences = self.getNextTransitions($scope.states.startState, inputWord[0], new autoSim.PDAStack().stackFirstSymbol);
            for (var i = 0; i < tmpSequences.length; i++) {
                var tmpSequence = {};
                tmpSequence.stack = new autoSim.PDAStack();
                tmpSequence.stack.pop();
                tmpSequence.stack.push(tmpSequences[i].writeToStack);
                tmpSequence.value = [tmpSequences[i]];
                stackSequences.push(tmpSequence);
            }
        }

        while (stackSequences.length !== 0) {
            tmpSequence = stackSequences.pop();
            if (tmpSequence.value.length === inputWord.length && tmpSequence.stack.stackContainer.length === 0) {
            } else if (inputWord.length > tmpSequence.value.length && tmpSequence.stack.stackContainer.length !== 0) {
                tmpSequences = [];
                _.forEach(self.getNextTransitions(_.last(tmpSequence.value).toState, inputWord[tmpSequence.value.length], tmpSequence.stack.pop()), function (sequence) {
                    var newTmpSequence = {};
                    newTmpSequence.stack = new autoSim.PDAStack(tmpSequence.stack.stackContainer);
                    newTmpSequence.stack.push(sequence.writeToStack);
                    newTmpSequence.value = _.concat(tmpSequence.value, sequence);
                    tmpSequences.push(newTmpSequence);
                });
                stackSequences = _.concat(stackSequences, tmpSequences);
                if (tmpSequences.length === 0) {
                    farthestSequences.push(tmpSequence.value);
                }
            } else {
                farthestSequences.push(tmpSequence.value);
            }
        }
        return farthestSequences;
    };


    /**
     * returns all possible transition, which go from the fromState with the inputSymbol to a state
     * @param fromState
     * @param inputSymbol
     * @returns {Array}
     */
    self.getNextTransitions = function (fromState, inputSymbol, readFromStack) {
        var transitions = [];
        _.forEach($scope.transitions, function (transitionGroup) {
            _.forEach(transitionGroup, function (transition) {
                if (transition.fromState == fromState && transition.inputSymbol == inputSymbol && transition.readFromStack == readFromStack) {
                    transitions.push(transition);
                }
            });
        });
        return transitions;
    };
};