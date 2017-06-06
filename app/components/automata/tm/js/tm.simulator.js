//Simulator for the simulation of the automata
autoSim.SimulatorTM = function($scope, $uibModal) {
    var self = this;
    autoSim.Simulator.apply(this, arguments);


    self.tape = new autoSim.TMTape($scope);
    self.virtualTape = new autoSim.TMTape($scope);

    self.tape.refillTape();
    self.tape.setPointer();
    self.virtualTape.refillTape();
    self.virtualTape.setPointer();


    //save the reference
    var parentReset = this.reset;

    /**
     * Should reset the simulation
     */
    self.reset = function() {
        self.tape.refillTape();
        self.tape.fillTape($scope.automatonData.inputWord);
        self.virtualTape.refillTape();
        self.virtualTape.fillTape($scope.automatonData.inputWord);
        self.currentSequencePosition = 0;
        self.animated = {
            currentState: null,
            transition: null,
            nextState: null,
            currentTapeItem: null
        };
        parentReset.apply(this);
    }

    /**
     * Prepare the simulation (set startSettings)
     */
    self.prepareSimulation = function() {
        self.reset();
        self.isInAnimation = true;
        self.sequences = self.getSequences(self.virtualTape.tapeArray);
    };

    /**
     * Make a step forward
     */
    self.stepForward = function() {
        var modalIsDisplayed = false;
        if (!self.isInAnimation) {
            self.prepareSimulation();
        }
        if (!_.includes(["accepted", "notAccepted"], self.status)) {
            // if (self.isEmptyWordAccepted && self.tape.isEmpty() === true) {
            //     self.animateEmptyWord();
            // } else {
                if (self.animated.currentState === null) {
                    self.animateCurrentState();
                    self.animateCurrentTapeItem();
                } else if (self.animated.transition === null) {
                    self.animateTransition();
                    self.animateCurrentTapeItem();
                    if (self.animated.transition !== null) {
                        self.tape.writeOnTape(self.animated.transition.outputSymbol);
                        if (self.animated.transition.movingDirection === "→") {
                            self.tape.pointerGoRight();
                        } else if (self.animated.transition.movingDirection === "←") {
                            self.tape.pointerGoLeft();
                        } else {
                            self.tape.pointerStay();
                        }
                        //wenn aktiviert, dann wandert currentTapeItem gleichzeitig mit Pointer
                        // self.animateCurrentTapeItem();
                    }
                    if (self.tape.pointer > 24 && !self.modalIsDisplayed) {
                        $uibModal.open({
                            ariaLabelledBy: 'modal-title',
                            templateUrl: '/app/components/automata/tm/views/tm.modal.html',
                            controller: 'ModalCtrl',
                            controllerAs: 'vm'
                        });
                        self.modalIsDisplayed = true;
                    }
                    if (self.tape.pointer < 0 && !self.modalIsDisplayed) {
                      $uibModal.open ({
                        ariaLabelledBy: 'modal-title',
                        templateUrl: '/app/components/automata/tm/views/tm.modal.html',
                        controller: 'ModalCtrl',
                        controllerAs: 'vm'
                      });
                      self.modalIsDisplayed = true;
                    }
                } else if (self.animated.nextState === null) {
                    self.animateNextState();
                    self.animateCurrentTapeItem();
                } else {
                    self.changeNextStateToCurrentState();
                }
            // }
        }
        $scope.saveApply();
    };

    self.sleep = function(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds) {
                break;
            }
        }
    }
    /**
     *Animate the currentState
     */
    self.animateCurrentTapeItem = function() {
        self.animated.currentTapeItem = self.tape.pointer;
    };


    /**
     *Change the currentState to the nextState
     */
    self.changeNextStateToCurrentState = function() {
        self.currentPosition++;
        self.currentSequencePosition++;
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
    self.isAnimationAccepted = function() {
        return self.currentSequencePosition == self.sequences.sequences[0].length && self.sequences.possible;
    };

    /**
     * Goes the animation back. if we have only a currentState
     */
    self.goAnimationBack = function() {
        self.status = "unknown";
        if (self.currentPosition !== 0) {
            self.currentPosition--;
            self.animated.nextState = self.animated.currentState;
            self.animated.transition = self.getLongestSequence(self.sequences.sequences)[self.currentPosition];
            if (self.animated.transition.movingDirection === "→") {
                self.tape.pointerGoLeft();
            } else if (self.animated.transition.movingDirection === "←") {
                self.tape.pointerGoRight();
            } else {
                self.tape.pointerStay();
            }
            self.tape.writeOnTape(self.animated.transition.inputSymbol);
            self.animated.currentState = self.animated.transition.fromState;
        } else {
            self.reset();
        }
    };

    /**
     * checks if a word is accepted from the automata
     * @return {Boolean}
     */
    self.isInputWordAccepted = function(tapeWord) {
        self.virtualTape.tapeSetup($scope.automatonData.inputWord);
        return self.getSequences(self.virtualTape.tapeArray).possible;
    };

    /**
     * Return either the possibleSequences, if there is no possibleSequence, then return the farthestPossibleSequences
     * @param inputWord
     * @returns {{}}
     */
    self.getSequences = function(tapeWord) {
        self.virtualTape.fillTape(tapeWord);
        tapeWord = self.virtualTape.tapeArray;
        var tmpObj = {};
        if (self.tape.isEmpty() && $scope.states.final.isFinalState($scope.states.startState)) {
            tmpObj.possible = true;
            tmpObj.sequences = [];
            return tmpObj;
        }
        // if (self.tape.isEmpty()) {
        //     if ($scope.states.final.isFinalState($scope.states.startState)) {
        //         tmpObj.possible = true;
        //         tmpObj.sequences = [];
        //         return tmpObj;
        //     } else {
        //         tmpObj.possible = false;
        //         tmpObj.sequences = [];
        //         return tmpObj;
        //     }
        // }
        var possibleSequences = self.getAllPossibleSequences(tapeWord);
        if (possibleSequences.length !== 0) {
            tmpObj.possible = true;
            tmpObj.sequences = possibleSequences;
            return tmpObj;
        } else {
            tmpObj.possible = false;
            tmpObj.sequences = self.getFarthestPossibleSequences(tapeWord);
            return tmpObj;
        }
    };

    /**
     * returns all possible transition, which go from the fromState with the inputSymbol to a state
     * @param fromState
     * @param inputSymbol
     * @returns {Array}
     */
    self.getNextTransitions = function(fromState, tapeSymbol) {
        var transitions = [];
        _.forEach($scope.transitions, function(transitionGroup) {
            _.forEach(transitionGroup, function(transition) {
                if (transition.fromState == fromState && transition.inputSymbol == tapeSymbol) {
                    transitions.push([transition]);
                }
            })
        });
        return transitions;
    };


    /**
     * Returns all possible sequences, if an empty array is returned, there is no possibleSequence
     * @param inputWord
     * @returns {Array}
     */
    self.getAllPossibleSequences = function(tapeWord) {
        var possibleSequences = [];
        var state = $scope.states.startState;
        var possibleSequence = [];

        while (self.getNextTransitions(state, self.virtualTape.tapeArray[self.virtualTape.pointer]).length !== 0) {
            var possibleTransition = self.getNextTransitions(state, self.virtualTape.tapeArray[self.virtualTape.pointer]);
            if (possibleTransition[0][0].inputSymbol === tapeWord[self.virtualTape.pointer]) {
                self.virtualTape.writeOnTape(possibleTransition[0][0].outputSymbol);
                if (possibleTransition[0][0].movingDirection === "→") {
                    self.virtualTape.pointerGoRight();
                } else if (possibleTransition[0][0].movingDirection === "←") {
                    self.virtualTape.pointerGoLeft();
                } else {
                    self.virtualTape.pointerStay();
                }
                possibleSequence.push(possibleTransition[0][0]);
            }
            // } else if ($scope.states.final.isFinalState(possibleTransition[0][0].fromState)) {
            //     possibleSequences.push(possibleSequence);
            //     return possibleSequences;
            // } else {
            //     self.virtualTape.refillTape();
            //     self.virtualTape.fillTape($scope.automatonData.inputWord);
            //     possibleSequences = [];
            //     console.log("start");
            //     return possibleSequences;
            // }
            state = possibleTransition[0][0].toState;
        }
        if ($scope.states.final.isFinalState(state)) {
            possibleSequences.push(possibleSequence);
            return possibleSequences;
        }
        self.virtualTape.tapeSetup($scope.automatonData.inputWord);
        return possibleSequences;


        // //as long as there are possibleSequences do
        // while (tapeSequences.length !== 0) {
        //     var tmpSequence = tapeSequences.pop();
        //     if (tmpSequence.length === self.tape.numOfChar && $scope.states.final.isFinalState(_.last(tmpSequence).toState)) {
        //         possibleSequences.push(tmpSequence);
        //     } else if (self.tape.numOfChar > tmpSequence.length) {
        //         // console.log(tmpSequence);
        //         var tmpSequences = [];
        //         var newTmpSequence = [];
        //         var i = self.getPointerPosition(tmpSequence);
        //         console.log(tapeWord[i]);
        //         _.forEach(self.getNextTransitions(_.last(tmpSequence).toState, tapeWord[self.tape.pointer + tmpSequence.length]), function(value) {
        //             newTmpSequence = _.concat(tmpSequence, value);
        //             tmpSequences.push(newTmpSequence);
        //         });
        //         tapeSequences = _.concat(tapeSequences, tmpSequences);
        //     }
        // }
        // return possibleSequences;
    };

    /**
     * Returns the farthest possible sequences
     * @param inputWord
     * @returns {Array}
     */
    self.getFarthestPossibleSequences = function(tapeWord) {
        var farthestSequences = [];
        //     //     //1.Get the all possible transitions
        //     //     var tapeSequences = self.getNextTransitions($scope.states.startState, tapeWord[self.tape.pointer]);
        //     //     //as long as there are possibleSequences do
        //     //     while (tapeSequences.length !== 0) {
        //     //         var tmpSequence = tapeSequences.pop();
        //     //         if (tmpSequence.length === self.tape.numOfChar && $scope.states.final.isFinalState(_.last(tmpSequence).toState)) {}
        //     // else if (self.tape.numOfChar > tmpSequence.length) {
        //     //             var tmpSequences = [];
        //     //             var newTmpSequence = [];
        //     //             var i = self.tape.pointer + tmpSequence.length;
        //     //             _.forEach(self.getNextTransitions(_.last(tmpSequence).toState, tapeWord[i]), function(value) {
        //     //                 newTmpSequence = _.concat(tmpSequence, value);
        //     //                 tmpSequences.push(newTmpSequence);
        //     //             });
        //     //             tapeSequences = _.concat(tapeSequences, tmpSequences);
        //     //             if (tmpSequences.length === 0) {
        //     //                 farthestSequences.push(tmpSequence);
        //     //             }
        //     //         } else {
        //     //             farthestSequences.push(tmpSequence);
        //     //         }
        //     //     }
        //     //     return farthestSequences;
        //
        var state = $scope.states.startState;
        var farthestSequence = [];

        while (self.getNextTransitions(state, self.virtualTape.tapeArray[self.virtualTape.pointer]).length !== 0) {
            var possibleTransition = self.getNextTransitions(state, self.virtualTape.tapeArray[self.virtualTape.pointer]);
            if (possibleTransition[0][0].inputSymbol === tapeWord[self.virtualTape.pointer]) {
                self.virtualTape.writeOnTape(possibleTransition[0][0].outputSymbol);
                if (possibleTransition[0][0].movingDirection === "→") {
                    self.virtualTape.pointerGoRight();
                } else if (possibleTransition[0][0].movingDirection === "←") {
                    self.virtualTape.pointerGoLeft();
                } else {
                    self.virtualTape.pointerStay();
                }
                farthestSequence.push(possibleTransition[0][0]);
            }
            // } else if ($scope.states.final.isFinalState(possibleTransition[0][0].fromState)) {
            //     farthestSequences.push(farthestSequence);
            //     return farthestSequences;
            // } else {
            //     farthestSequences = [];
            //     return farthestSequences;
            // }
            state = possibleTransition[0][0].toState;
        }
        if ($scope.states.final.isFinalState(state)) {
            farthestSequences.push(farthestSequence);
            return farthestSequences;
        }
        farthestSequences.push(farthestSequence);
        return farthestSequences;
    };

    /**
     *update the currentSequences if it didn't break the simulation
     */
    self.updateCurrentSequences = function() {};


    // //save the reference
    // var parentReset = this.reset;
    //
    // /**
    //  * Should reset the simulation
    //  */
    // self.reset = function () {
    //     self.stack = new autoSim.PDAStack();
    //     parentReset.apply(this);
    //
    //     //TODO:
    //     //$scope.statediagram.addToStack(self.stack.stackContainer);
    // };
    //
    // /**
    //  * for stack pop used
    //  */
    // self.animateTransitionOverride = function () {
    //     self.stack.pop();
    // };
    //
    // //saving reference
    // var parentChangeNextStateToCurrentState = self.changeNextStateToCurrentState;
    //
    // /**
    //  * stack push integrated
    //  */
    // self.changeNextStateToCurrentState = function () {
    //     self.stack.push(self.animated.transition.writeToStack);
    //     parentChangeNextStateToCurrentState();
    // };


    // /**
    //  * Returns all possible sequences, if an empty array is returned, there is no possibleSequence
    //  * @param inputWord
    //  * @returns {Array}
    //  */
    // self.getAllPossibleSequences = function(inputWord) {
    //     var possibleSequences = [];
    //     //Get the all possible transitions
    //     var stackSequences = self.getNextTransitions($scope.states.startState, inputWord[0]);
    //     //as long as there are possibleSequences do
    //     while (stackSequences.length !== 0) {
    //         var tmpSequence = stackSequences.pop();
    //         if (tmpSequence.length === inputWord.length && $scope.states.final.isFinalState(_.last(tmpSequence).toState)) {
    //             possibleSequences.push(tmpSequence);
    //         } else if (inputWord.length > tmpSequence.length) {
    //             var tmpSequences = [];
    //             var newTmpSequence = [];
    //             _.forEach(self.getNextTransitions(_.last(tmpSequence).toState, inputWord[tmpSequence.length]), function(value) {
    //                 newTmpSequence = _.concat(tmpSequence, value);
    //                 tmpSequences.push(newTmpSequence);
    //             });
    //             stackSequences = _.concat(stackSequences, tmpSequences);
    //         }
    //     }
    //     return possibleSequences;
    // //init needed variables
    // var possibleSequences = [];
    // var stackSequences = [];
    // var tmpSequences = [];
    //
    // if (inputWord.length !== 0) {
    //     tmpSequences = self.getNextTransitions($scope.states.startState, inputWord[0], new autoSim.PDAStack().stackFirstSymbol);
    //     for (var i = 0; i < tmpSequences.length; i++) {
    //         var tmpSequence = {};
    //         tmpSequence.stack = new autoSim.PDAStack();
    //         tmpSequence.stack.pop();
    //         tmpSequence.stack.push(tmpSequences[i].writeToStack);
    //         tmpSequence.value = [tmpSequences[i]];
    //         stackSequences.push(tmpSequence);
    //     }
    // }
    //
    // while (stackSequences.length !== 0) {
    //     tmpSequence = stackSequences.pop();
    //     if (tmpSequence.value.length === inputWord.length && tmpSequence.stack.stackContainer.length === 0) {
    //         possibleSequences.push(tmpSequence.value);
    //     } else if (inputWord.length > tmpSequence.value.length && tmpSequence.stack.stackContainer.length !== 0) {
    //         tmpSequences = [];
    //         _.forEach(self.getNextTransitions(_.last(tmpSequence.value).toState, inputWord[tmpSequence.value.length], tmpSequence.stack.pop()), function (sequence) {
    //             var newTmpSequence = {};
    //             newTmpSequence.stack = new autoSim.PDAStack(tmpSequence.stack.stackContainer);
    //             newTmpSequence.stack.push(sequence.writeToStack);
    //             newTmpSequence.value = _.concat(tmpSequence.value, sequence);
    //             tmpSequences.push(newTmpSequence);
    //         });
    //         stackSequences = _.concat(stackSequences, tmpSequences);
    //     }
    // }
    // return possibleSequences;
    // };


    // /**
    //  * Returns the farthest possible sequences
    //  * @param inputWord
    //  * @returns {Array}
    //  */
    // self.getFarthestPossibleSequences = function(inputWord) {
    //     var farthestSequences = [];
    //     //1.Get the all possible transitions
    //     var stackSequences = self.getNextTransitions($scope.states.startState, inputWord[0]);
    //     //as long as there are possibleSequences do
    //     while (stackSequences.length !== 0) {
    //         var tmpSequence = stackSequences.pop();
    //         if (tmpSequence.length === inputWord.length && $scope.states.final.isFinalState(_.last(tmpSequence).toState)) {} else if (inputWord.length > tmpSequence.length) {
    //             var tmpSequences = [];
    //             var newTmpSequence = [];
    //             _.forEach(self.getNextTransitions(_.last(tmpSequence).toState, inputWord[tmpSequence.length]), function(value) {
    //                 newTmpSequence = _.concat(tmpSequence, value);
    //                 tmpSequences.push(newTmpSequence);
    //             });
    //             stackSequences = _.concat(stackSequences, tmpSequences);
    //             if (tmpSequences.length === 0) {
    //                 farthestSequences.push(tmpSequence);
    //             }
    //         } else {
    //             farthestSequences.push(tmpSequence);
    //         }
    //     }
    //     return farthestSequences;
    // //init needed variables
    // var farthestSequences = [];
    // var stackSequences = [];
    // var tmpSequences = [];
    //
    //
    // if (inputWord.length !== 0) {
    //     tmpSequences = self.getNextTransitions($scope.states.startState, inputWord[0], new autoSim.PDAStack().stackFirstSymbol);
    //     for (var i = 0; i < tmpSequences.length; i++) {
    //         var tmpSequence = {};
    //         tmpSequence.stack = new autoSim.PDAStack();
    //         tmpSequence.stack.pop();
    //         tmpSequence.stack.push(tmpSequences[i].writeToStack);
    //         tmpSequence.value = [tmpSequences[i]];
    //         stackSequences.push(tmpSequence);
    //     }
    // }
    //
    // while (stackSequences.length !== 0) {
    //     tmpSequence = stackSequences.pop();
    //     if (tmpSequence.value.length === inputWord.length && tmpSequence.stack.stackContainer.length === 0) {
    //     } else if (inputWord.length > tmpSequence.value.length && tmpSequence.stack.stackContainer.length !== 0) {
    //         tmpSequences = [];
    //         _.forEach(self.getNextTransitions(_.last(tmpSequence.value).toState, inputWord[tmpSequence.value.length], tmpSequence.stack.pop()), function (sequence) {
    //             var newTmpSequence = {};
    //             newTmpSequence.stack = new autoSim.PDAStack(tmpSequence.stack.stackContainer);
    //             newTmpSequence.stack.push(sequence.writeToStack);
    //             newTmpSequence.value = _.concat(tmpSequence.value, sequence);
    //             tmpSequences.push(newTmpSequence);
    //         });
    //         stackSequences = _.concat(stackSequences, tmpSequences);
    //         if (tmpSequences.length === 0) {
    //             farthestSequences.push(tmpSequence.value);
    //         }
    //     } else {
    //         farthestSequences.push(tmpSequence.value);
    //     }
    // }
    // return farthestSequences;
    // };



};
