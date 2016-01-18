"use strict";

//Simulator for the simulation of the automata
var simulationDFA = function($scope) {
    var self = this;

    //if the simulation loops (start at the end again)
    self.loopSimulation = true;
    //time between the steps
    self.stepTimeOut = 1500;
    //Time between loops when the animation restarts
    self.loopTimeOut = 1000;
    //if the simulation is paused
    self.simulationPaused = false;


    /**
     *  Checks if the automata is playable ( has min. 1 states and 1 transition and automat has a start and a finalstate)
     * @return {Boolean} [description]
     */
    self.isPlayable = function() {
        return $scope.config.states.length >= 1 && $scope.config.transitions.length >= 1 && $scope.config.startState != null && $scope.config.finalStates.length >= 1;
    }


    /**
     * [playOrPause description]
     * @return {[type]} [description]
     */
    self.playOrPause = function() {
        //the automat needs to be playable
        if (self.isPlayable()) {
            //change the icon and the state to Play or Pause
            changeToPlayOrPause();
            if (self.isInPlay) {
                self.simulationPaused = false;
                self.play();
            } else {
                self.pause();
            }

        } else {
            $scope.dbug.debugDanger("Kein Automat vorhanden!");
        }

    }

    //Saves if the icons show Play and if its false it shows pause
    self.isInPlay = false;


    /**
     * Changes the icon of the playorpause button and the state of isInPlay
     */
    function changeToPlayOrPause() {
        if (!self.isInPlay) {
            //change to Pause
            d3.select(".glyphicon-play").attr("class", "glyphicon glyphicon-pause");

        } else {
            //change to Play
            d3.select(".glyphicon-pause").attr("class", "glyphicon glyphicon-play");
        }
        self.isInPlay = !self.isInPlay;

    }

    /**
     * [changeToPlay description]
     * @return {[type]} [description]
     */
    self.changeToPlay = function() {
        d3.select(".glyphicon-pause").attr("class", "glyphicon glyphicon-play");
        self.isInPlay = false;
    }

    /**
     * [reset description]
     * @return {[type]} [description]
     */
    self.reset = function() {
        //remove graphdesigner animations
        if (self.currentState != null) {
            $scope.graphdesigner.setClassStateAs(self.currentState, false, "visitedState");
        }
        if (self.nextState != null) {
            $scope.graphdesigner.setClassStateAs(self.nextState, false, "visitedState");
        }
        if (self.transition != null) {
            $scope.graphdesigner.setTransitionAs(self.transition.id, false);
        }
        //Animation Settings
        //saves the currentStateId -> for animating
        self.currentState = $scope.config.startState;
        //saves the nextTransition for animating
        self.transition = null;
        //saves if the transition is animated
        self.animatedTransition = false;
        //saves the nextState for animating
        self.nextState = null;
        //saves if the nextState is animated
        self.animatedNextState = false;
        //saves if we already calculated the next step
        self.isNextStepCalculated = false;
        //saves if the simulationStarted
        self.simulationStarted = false;

        //Simulation Settings
        //saves the States we gone through
        self.statusSequence = [$scope.config.startState];
        //saves the steps we made T.
        self.madeSteps = 0;
        //the word we want to check
        self.inputWord = $scope.inputWord;
        //the word we already checked
        self.processedWord = '';
        //the char we checked at the step
        self.nextChar = '';
        //the status is stopped at when resetted
        self.status = 'stopped';
    }

    /**
     * [pause description]
     * @return {[type]} [description]
     */
    self.pause = function() {
        if (!self.simulationPaused) {
            self.simulationPaused = true;
            self.changeToPlay();
        }
    }

    /**
     * [stop description]
     * @return {[type]} [description]
     */
    self.stop = function() {
        self.pause();
        self.reset();


    }

    /**
     * [play description]
     * @return {[type]} [description]
     */
    self.play = function() {
        //if the simulation is paused then return
        if (!self.simulationPaused) {
            //start and prepare for the play
            if (!self.simulationStarted) {
                //The simulation always resets the parameters at the start -> it also sets the inputWord
                self.reset();
                self.simulationStarted = true;
                $scope.graphdesigner.setClassStateAs(_.last(self.statusSequence), true, "visitedState");
                $scope.safeApply();
            }

            //loop through the steps
            if (self.isNextStepCalculated || ((self.status != 'accepted') && (self.status != 'not accepted'))) {
                self.animateNextMove();
                $scope.safeApply(function() {});
                if (self.isNextStepCalculated || ((self.status != 'accepted') && (self.status != 'not accepted'))) {
                    setTimeout(self.play, self.stepTimeOut);
                }
            }

            //end the animation & reset it if loop through is activated the animation loop throuh play
            if (!self.isNextStepCalculated && self.status == 'accepted') {
                if (self.loopSimulation) {
                    setTimeout(self.play, self.loopTimeOut);
                    //finish the Animation
                } else {
                    self.changeToPlay();

                }

                self.simulationStarted = false;
                $scope.safeApply(function() {});
            }

        } else {
            return;
        }
    }


    /**
     * [step description]
     * @return {[type]} [description]
     */
    self.animateNextMove = function() {
        if (!self.isNextStepCalculated) {
            self.calcNextStep();
        }


        //First: Paint the transition & wait
        if (!self.animatedTransition) {
            self.animatedTransition = true;
            $scope.graphdesigner.setTransitionAs(self.transition.id, true);

            //Second: Paint the nextstate & wait
        } else if (!self.animatedNextState && self.animatedTransition) {
            self.animatedNextState = true;
            $scope.graphdesigner.setClassStateAs(self.nextState, true, "visitedState");

            //Third: clear transition & currentStatecolor and set currentState = nexsttate and wait
        } else if (self.animatedTransition && self.animatedNextState) {
            $scope.graphdesigner.setTransitionAs(self.transition.id, false);
            $scope.graphdesigner.setClassStateAs(self.currentState, false, "visitedState");


            self.currentState = self.nextState;
            //after the step was animated it adds a step to the madeSteps
            self.madeSteps++;
            //if the nextState is the finalState
            if (self.inputWord.length == self.madeSteps) {
                if (_.include($scope.config.finalStates, self.currentState)) {
                    self.status = 'accepted';
                } else {
                    self.status = 'not accepted';
                }
            }

            //Reset the step & start the next step
            self.isNextStepCalculated = false;
            self.animatedNextState = false;
            self.animatedTransition = false;
            self.processedWord += self.nextChar;

            //push the currentState to the statusSequence
            self.statusSequence.push(self.currentState);

        }

    }

    self.calcNextStep = function() {
        self.isNextStepCalculated = true;
        self.status = 'step';
        self.nextChar = self.inputWord[self.madeSteps];

        //get the next transition
        self.transition = _.filter($scope.config.transitions, function(transition) {
            //if there is no next char then the word is not accepted
            if (self.nextChar == undefined) {
                self.status = 'not accepted';
                return;
            }
            //get the nextState
            return transition.fromState == _.last(self.statusSequence) && transition.name == self.nextChar;
        });

        //if there is no next transition, then the word is not accepted
        if (_.isEmpty(self.transition)) {
            self.status = 'not accepted';
            return;
        }
        //save transition and nextState for the animation
        self.transition = self.transition[0];
        self.nextState = self.transition.toState;


    }

    /**
     * [stepForward description]
     * @return {[type]} [description]
     */
    self.stepForward = function() {
        if (!self.simulationPaused) {
            self.pause();
        }
        // return if automat is not running
        if (!(_.include(['step', 'accepted', 'not accepted'], self.status))) {
            //TODO:DEBUG
            return;
        }
        if (!_.include(['accepted', 'not accepted'], self.status)) {
            self.animateNextMove();
        } else {
            $scope.dbug.debugDanger("IS ALREADY LAST STEP");
        }

    }


    /**
     * [undo description]
     * @return {[type]} [description]
     */
    self.stepBackward = function() {
        if (!self.simulationPaused) {
            self.pause();
        }
        // return if automat is not running
        if (!(_.include(['step', 'accepted', 'not accepted'], self.status))) {
                      //TODO:DEBUG
            return;
        }
        self.status = 'step';

        // Reset if no more undoing is impossible n-> not right at the moment
        if (!self.animatedTransition && !self.animatedNextState && self.madeSteps == 0) {
            self.reset();
        } else {
            // Decrease count and remove last element from statusSequence

            self.animateLastMove();
        }
    }

    /**
     * [step description]
     * @return {[type]} [description]
     */
    self.animateLastMove = function() {
        console.log(self.animatedTransition + " " + self.animatedNextState);
        if (self.animatedTransition && self.animatedNextState) {
            $scope.graphdesigner.setClassStateAs(self.nextState, false, "visitedState");
            self.animatedNextState = false;
        } else if (self.animatedTransition) {
            $scope.graphdesigner.setTransitionAs(self.transition.id, false);
            self.animatedTransition = false;
        } else {
            self.calcLastStep();
        }

    }

    /**
     * [calcLastStep description]
     * @return {[type]} [description]
     */
    self.calcLastStep = function() {
        self.nextChar = self.processedWord.slice(-1);
        console.log(self.nextChar + " " + self.statusSequence[self.statusSequence.length - 2]);

        //get the gone way back
        self.transition = _.filter($scope.config.transitions, function(transition) {
            //if there is no next char then the word is not accepted
            if (self.nextChar == undefined) {
                self.status = 'not accepted';
                return;
            }
            //get the nextState
            return transition.fromState == self.statusSequence[self.statusSequence.length - 2] && transition.toState == self.currentState && transition.name == self.nextChar;
        });
        self.transition = self.transition[0];
        //First: Paint the transition & wait
        self.animatedTransition = true;
        $scope.graphdesigner.setTransitionAs(self.transition.id, true);
        var tmp = self.currentState;
        self.currentState = self.transition.fromState;
        self.nextState = tmp;
        //Second: Paint the nextstate & wait
        self.animatedNextState = true;
        $scope.graphdesigner.setClassStateAs(self.currentState, true, "visitedState");
        self.madeSteps--;
        self.statusSequence.splice(-1, 1);
        self.processedWord = self.processedWord.slice(0, -1);



    }

}
