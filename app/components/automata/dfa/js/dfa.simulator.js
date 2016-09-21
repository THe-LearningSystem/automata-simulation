//Simulator for the simulation of the automata
autoSim.Simulator = function ($scope) {
    "use strict";
    var self = this;

    //add to the automatonData
    $scope.automatonData.inputWord = "";

    //if the simulation loops (start at the end again)
    self.loopSimulation = true;
    //time between the steps
    self.stepTimeOut = 500;
    //Time between loops when the animation restarts
    self.loopTimeOut = 500;

    //not in reset
    self.isInPlay = false;
    self.simulationPaused = false;

    /**
     * Reset the simulation
     */
    self.reset = function () {
        if (self.animatedSequence != null) {
            self.removeSequenceAnimation(self.animatedSequence, self.animatedSequencePossible);
        }
        self.animatedSequencePossible = null;
        self.animatedSequence = null;
        self.animated = {
            currentState: null,
            transition: null,
            nextState: null
        };
        self.currentState = null;
        self.transition = null;
        self.nextState = null;
        self.isInAnimation = false;
        self.sequences = {};
        self.processedWord = "";
        self.currentPosition = 0;
        //accepted,notAccepted,unknown
        self.status = "unknown";
        //is an empty inputWord Accepted
        self.isEmptyWordAccepted = true;
        $scope.saveApply();
    };
    //set values on init
    self.reset();


    /**
     * stop the animation
     */
    self.stop = function () {
        self.pause();
        self.reset();
    };

    /**
     * Pause the animation
     */
    self.pause = function () {
        if (!self.simulationPaused) {
            self.simulationPaused = true;
            self.isInPlay = false;
        }
    };

    /**
     * Play the simulation
     */
    self.play = function () {
        //if the simulation is paused then return
        if (!self.simulationPaused) {
            //start and prepare for the play
            if (!self.isInAnimation) {
                self.prepareSimulation();
                setTimeout(self.play, self.loopTimeOut);
            } else {
                self.stepForward();
                if (!_.includes(["accepted", "notAccepted"], self.status))
                    setTimeout(self.play, self.loopTimeOut);
            }
        }
    };

    /**
     * Starts or Pauses the Simulation
     */
    self.playOrPause = function () {
        //change the icon and the state to Play or Pause
        self.isInPlay = !self.isInPlay;
        if (self.isInPlay) {
            self.simulationPaused = false;
            self.play();
        } else {
            self.pause();
        }
    };

    /**
     * Prepare the simulation ( set startSettings)
     */
    self.prepareSimulation = function () {
        self.reset();
        self.isInAnimation = true;
        self.sequences = self.getSequences($scope.automatonData.inputWord);
    };

    /**
     * Make a step forward
     */
    self.stepForward = function () {
        if (!self.isInAnimation) {
            self.prepareSimulation();
        }
        if (!_.includes(["accepted", "notAccepted"], self.status)) {
            if (self.isEmptyWordAccepted && $scope.automatonData.inputWord === "") {
                self.animateEmptyWord();
            } else {
                if (self.animated.currentState === null) {
                    self.animateCurrentState();
                } else if (self.animated.transition === null) {
                    self.animateTransition();
                } else if (self.animated.nextState == null) {
                    self.animateNextState();
                } else {
                    self.changeNextStateToCurrentState();
                }
            }
        }
        $scope.saveApply();
    };

    /**
     * This wrapper function is for the button
     */
    self.stepForwardWrapper = function () {
        if (self.isInPlay)
            self.pause();
        self.stepForward();
    }

    /**
     *Animation for the empty word
     */
    self.animateEmptyWord = function () {
        if (self.animated.currentState === null) {
            self.animated.currentState = $scope.states.startState;
        } else {
            if ($scope.states.final.isFinalState(self.animated.currentState)) {
                self.status = "accepted";
            } else {
                self.status = "notAccepted";
            }
        }
    };

    /**
     *Animate the currentState
     */
    self.animateCurrentState = function () {
        self.animated.currentState = $scope.states.startState;
    };

    /**
     *Animate the transition
     */
    self.animateTransition = function () {
        if (self.getLongestSequence(self.sequences.sequences).length > self.currentPosition) {
            self.animated.transition = self.getLongestSequence(self.sequences.sequences)[self.currentPosition];
            self.processedWord += $scope.automatonData.inputWord[self.currentPosition];
            self.animateTransitionOverride();
        } else {
            self.status = "notAccepted";
            self.isInPlay = false;
        }
    };

    /**
     * Override Function if someone need to override it
     */
    self.animateTransitionOverride = function () {
    };

    /**
     *Animate the nextState
     */
    self.animateNextState = function () {
        self.animated.nextState = self.animated.transition.toState;
    };

    /**
     *Change the currentState to the nextState
     */
    self.changeNextStateToCurrentState = function () {
        self.currentPosition++;
        self.animated.currentState = self.animated.nextState;
        self.animated.nextState = null;
        self.animated.transition = null;
        if (self.isAnimationAccepted()) {
            self.status = "accepted";
            self.isInPlay = false;
        }
    };

    /**
     * Returns if the animation is accepted for overriding
     * @returns {boolean}
     */
    self.isAnimationAccepted = function () {
        return self.currentPosition == $scope.automatonData.inputWord.length && self.sequences.possible;
    };


    /**
     * go a step backward (called from the button or other components)
     */
    self.stepBackward = function () {
        if (self.animated.currentState != null && self.animated.transition != null && self.animated.nextState != null) {
            self.removeNextStateAnimation();
        } else if (self.animated.currentState != null && self.animated.transition != null) {
            self.removeTransitionAnimation();

        } else {
            self.goAnimationBack();
        }
    };


    /**
     * This wrapper function is for the button
     */
    self.stepBackwardWrapper = function () {
        if (self.isInPlay)
            self.pause();
        self.stepBackward();
    };

    /**
     * removes the nextState animation
     */
    self.removeNextStateAnimation = function () {
        self.animated.nextState = null;

    };

    /**
     * remove the transition animation
     */
    self.removeTransitionAnimation = function () {
        self.animated.transition = null;
        self.processedWord = self.processedWord.substring(0, -1);
    };

    /**
     * Goes the animation back ( if we have only a currentState
     */
    self.goAnimationBack = function () {
        self.status = "unknown";
        if (self.currentPosition !== 0) {
            self.currentPosition--;
            self.animated.nextState = self.animated.currentState;
            self.animated.transition = self.getLongestSequence(self.sequences.sequences)[self.currentPosition];
            self.animated.currentState = self.animated.transition.fromState;
        } else {
            self.reset();
        }
    };

    /**
     * checks if a word is accepted from the automata
     * @return {Boolean}
     */
    self.isInputWordAccepted = function (inputWord) {
        return self.getSequences(inputWord).possible;
    };

    /**
     * Returns the shortest Sequence from the given sequences
     * @param sequences
     * @returns {Array}
     */
    self.getShortestSequence = function (sequences) {
        var returnSequence = [];
        _.forEach(sequences, function (sequence) {
            if (returnSequence.length === 0 || returnSequence.length > sequence.length)
                returnSequence = sequence;
        });
        return returnSequence;
    };

    /**
     * Returns the longestSequence from the given sequences
     * @param sequences
     * @returns {Array}
     */
    self.getLongestSequence = function (sequences) {
        var returnSequence = [];
        _.forEach(sequences, function (sequence) {
            if (returnSequence.length < sequence.length)
                returnSequence = sequence;
        });
        return returnSequence;

    };

    /**
     * Return either the possibleSequences, if there is no possibleSequence, then return the farthestPossibleSequences
     * @param inputWord
     * @returns {{}}
     */
    self.getSequences = function (inputWord) {
        var tmpObj = {};
        if (inputWord == "" && $scope.states.final.isFinalState($scope.states.startState)) {
            tmpObj.possible = true;
            tmpObj.sequences = [];
            return tmpObj;
        }
        var possibleSequences = self.getAllPossibleSequences(inputWord);
        if (possibleSequences.length !== 0) {
            tmpObj.possible = true;
            tmpObj.sequences = possibleSequences;
            return tmpObj;
        } else {
            tmpObj.possible = false;
            tmpObj.sequences = self.getFarthestPossibleSequences(inputWord);
            return tmpObj;
        }
    };

    /**
     * Returns all possible sequences, if an empty array is returned, there is no possibleSequence
     * @param inputWord
     * @returns {Array}
     */
    self.getAllPossibleSequences = function (inputWord) {
        var possibleSequences = [];
        //1.Get the all possible transitions
        var stackSequences = self.getNextTransitions($scope.states.startState, inputWord[0]);
        //as long as there are possibleSequences do
        while (stackSequences.length !== 0) {
            var tmpSequence = stackSequences.pop();
            if (tmpSequence.length === inputWord.length && $scope.states.final.isFinalState(_.last(tmpSequence).toState)) {
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

    /**
     * Returns the farthest possible sequences
     * @param inputWord
     * @returns {Array}
     */
    self.getFarthestPossibleSequences = function (inputWord) {
        var farthestSequences = [];
        //1.Get the all possible transitions
        var stackSequences = self.getNextTransitions($scope.states.startState, inputWord[0]);
        //as long as there are possibleSequences do
        while (stackSequences.length !== 0) {
            var tmpSequence = stackSequences.pop();
            if (tmpSequence.length === inputWord.length && $scope.states.final.isFinalState(_.last(tmpSequence).toState)) {
            } else if (inputWord.length > tmpSequence.length) {
                var tmpSequences = [];
                var newTmpSequence = [];
                _.forEach(self.getNextTransitions(_.last(tmpSequence).toState, inputWord[tmpSequence.length]), function (value) {
                    newTmpSequence = _.concat(tmpSequence, value);
                    tmpSequences.push(newTmpSequence);
                });
                stackSequences = _.concat(stackSequences, tmpSequences);
                if (tmpSequences.length === 0) {
                    farthestSequences.push(tmpSequence);
                }
            } else {
                farthestSequences.push(tmpSequence);
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
    self.getNextTransitions = function (fromState, inputSymbol) {
        var transitions = [];
        _.forEach($scope.transitions, function (transitionGroup) {
            _.forEach(transitionGroup, function (transition) {
                if (transition.fromState == fromState && transition.inputSymbol == inputSymbol) {
                    transitions.push([transition]);
                }
            })
        });
        return transitions;
    };

    /**
     *update the currentSequences if it didn't break the simulation
     */
    self.updateCurrentSequences = function () {
        var newSequences = self.getSequences($scope.automatonData.inputWord);
        var newShortestSequence = self.getLongestSequence(newSequences.sequences);
        var bool = true;
        if (newShortestSequence.length < self.currentPosition) {
            bool = false;
        } else if (self.animated.transition !== null && newShortestSequence.length < self.currentPosition + 1) {
            bool = false
        } else {
            if (self.status === "notAccepted")
                self.status = "unknown";
            if (newShortestSequence.length < self.currentPosition + 1) {
                self.status = "notAccepted";
            }
            self.sequences = newSequences;
        }
        if (!bool) {
            self.reset();
            $scope.showModalWithMessage('SIM.MODAL_TITLE', 'SIM.MODAL_DESC');
        }
    };

    /**
     * animates the sequence
     * @param sequence
     * @param possible
     */
    self.animateSequence = function (sequence, possible) {
        self.reset();
        self.isInAnimation = true;
        $scope.statediagram.animateSequence(sequence, possible);
        //TODO: Save Values and after load them
        self.animatedSequence = sequence;
        self.animatedSequencePossible = possible;
    };

    /**
     * removes the sequence animation
     * @param sequence
     * @param possible
     */
    self.removeSequenceAnimation = function (sequence, possible) {
        $scope.statediagram.removeSequenceAnimation(sequence, possible);
    };


    $scope.core.updateListeners.push(self);

    /**
     * updateFunction for the dfa listener
     */
    self.updateFunction = function () {
        if (!isObjectEmpty(self.sequences))
            self.updateCurrentSequences();
        if (self.animatedSequence !== null) {
            var seq = self.animatedSequence;
            var seqPos = self.animatedSequencePossible;
            self.removeSequenceAnimation(seq, seqPos);
            self.animateSequence(seq, seqPos);
        }
    };
};