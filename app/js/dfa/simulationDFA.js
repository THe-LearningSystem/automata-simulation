//Simulator for the simulation of the automata
function SimulationDFA($scope) {
    "use strict";
    var self = this;

    //if the simulation loops (start at the end again)
    self.loopSimulation = true;
    //time between the steps
    self.stepTimeOut = 1500;
    //Time between loops when the animation restarts
    self.loopTimeOut = 2000;
    //if the simulation is paused
    self.simulationPaused = false;
    //simulationsettings
    self.simulationSettings = true;

    //
    self.currentState = null;
    self.nextState = null;
    self.transition = null;

    self.settings = function () {
        self.simulationSettings = !self.simulationSettings;
    };
    self.animated = {
        currentState: null,
        transition: null,
        nextState: null
    };

    /**
     * Should reset the simulation
     */
    self.reset = function () {
        //reset animation
        self.animated = {
            currentState: null,
            transition: null,
            nextState: null
        };
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
    };

    /**
     * Pause the simulation
     */
    self.pause = function () {
        if (!self.simulationPaused) {
            self.simulationPaused = true;
            self.changeToPlay();
        }
    };

    /**
     * Stops the simulation
     */
    self.stop = function () {
        self.pause();
        self.reset();
        //enable inputField after simulation
        d3.select(".inputWord").attr("disabled", null);
    };

    /**
     * Play the simulation
     */
    self.play = function () {

        //if the simulation is paused then return
        if (!self.simulationPaused) {
            //start and prepare for the play
            if (!self.simulationStarted) {
                self.prepareSimulation();
            } else {
                //loop through the steps
                if (self.isNextStepCalculated || ((self.status != 'accepted') && (self.status != 'not accepted'))) {
                    self.animateNextMove();
                    $scope.safeApply(function () {});
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
                    $scope.safeApply(function () {});
                }
            }
        } else {
            return;
        }
    };

    /**
     * Prepare the simulation ( set startSettings)
     */
    self.prepareSimulation = function () {
        //disable inputField during simulation
        d3.select(".inputWord").attr("disabled", true);
        //The simulation always resets the parameters at the start -> it also sets the inputWord
        self.reset();
        self.simulationStarted = true;
        self.animated.currentState = _.last(self.statusSequence);

        $scope.safeApply();
        setTimeout(self.play, self.loopTimeOut);
    };

    /**
     * animate the next Move (a step has more than three moves)
     */
    self.animateNextMove = function () {
        if (!self.isNextStepCalculated) {
            self.calcNextStep();
        }

        //First: Paint the transition & wait
        if (!self.animatedTransition) {
            self.animatedTransition = true;
            self.animated.transition = self.transition.id;

            //Second: Paint the nextstate & wait
        } else if (!self.animatedNextState && self.animatedTransition) {
            self.animatedNextState = true;
            self.animated.nextState = self.nextState;


            //Third: clear transition & currentStatecolor and set currentState = nexsttate and wait
        } else if (self.animatedTransition && self.animatedNextState) {
            self.animated.transition = null;
            self.animated.nextState = null;
            self.animated.currentState = self.nextState;

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

    };

    /**
     * calcs the next step
     */
    self.calcNextStep = function () {
        self.isNextStepCalculated = true;
        self.status = 'step';
        self.nextChar = self.inputWord[self.madeSteps];

        //get the next transition
        self.transition = _.filter($scope.config.transitions, function (transition) {
            //if there is no next char then the word is not accepted
            if (self.nextChar === undefined) {
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
    };

    /**
     * pause the simulation and then stepForward steps to the nextAnimation ( not a whole step)
     */
    self.stepForward = function () {
        if (!self.simulationPaused) {
            self.pause();
        }
        if (!self.simulationStarted) {
            self.prepareSimulation();
            self.status = 'step';
            // return if automat is not running
        } else if (!(_.include(['step', 'stopped', 'accepted', 'not accepted'], self.status))) {
            //TODO:DEBUG
            console.log(self.status);
            return;
        } else if (!_.include(['accepted', 'not accepted'], self.status)) {
            self.animateNextMove();
        }
    };


    /**
     * pause the simulation and then steps back to the lastAnimation ( not a whole step)
     * @return {[type]} [description]
     */
    self.stepBackward = function () {
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
        if (!self.animatedTransition && !self.animatedNextState && self.madeSteps === 0) {
            self.reset();
        } else {
            // Decrease count and remove last element from statusSequence
            self.animateLastMove();
        }
    };

    /**
     * animates the last move if there is no lastmove, then calcLastStep
     * @return {[type]} [description]
     */
    self.animateLastMove = function () {
        console.log(self.animatedTransition + " " + self.animatedNextState);
        if (self.animatedTransition && self.animatedNextState) {
            self.animated.nextState = null;
            self.animatedNextState = false;
        } else if (self.animatedTransition) {
            self.animated.transition = null;

            self.animatedTransition = false;
        } else {
            self.calcLastStep();
        }

    };

    /**
     * calc the last step
     */
    self.calcLastStep = function () {
        self.nextChar = self.processedWord.slice(-1);
        console.log(self.nextChar + " " + self.statusSequence[self.statusSequence.length - 2]);

        //get the gone way back
        self.transition = _.filter($scope.config.transitions, function (transition) {
            //if there is no next char then the word is not accepted
            if (self.nextChar === undefined) {
                self.status = 'not accepted';
                return;
            }
            //get the nextState
            return transition.fromState == self.statusSequence[self.statusSequence.length - 2] && transition.toState == self.currentState && transition.name == self.nextChar;
        });
        self.transition = self.transition[0];
        //First: Paint the transition & wait
        self.animatedTransition = true;
        self.animated.transition = self.transition.id;
        var tmp = self.currentState;
        self.currentState = self.transition.fromState;
        self.nextState = tmp;
        self.animated.nextState = self.nextState;
        //Second: Paint the nextstate & wait
        self.animatedNextState = true;

        self.animated.currentState = self.currentState;
        self.madeSteps--;
        self.statusSequence.splice(-1, 1);
        self.processedWord = self.processedWord.slice(0, -1);
    };

    //TODO: better name
    self.checkTransition = function (transition, nextChar, statusSequence) {
        //if there is no next char then the word is not accepted
        if (nextChar === undefined) {
            return;
        }
        //get the nextState
        return transition.fromState == _.last(statusSequence) && transition.name == nextChar;
    };

    /**
     * checks if a word is accepted from the automata
     * @return {Boolean} [description]
     */
    self.check = function () {
        //init needed variables
        var accepted = false;
        var statusSequence = [];
        statusSequence.push($scope.config.startState);
        var nextChar = '';
        var madeSteps = 0;
        var transition = null;

        while (self.status === '') {
            nextChar = $scope.inputWord[madeSteps];
            //get the next transition
            transition = _.filter($scope.config.transitions, self.checkTransition(transition, nextChar, statusSequence));
            //if there is no next transition, then the word is not accepted
            if (_.isEmpty(transition)) {
                break;
            }
            transition = transition[0];
            //push the new State to the sequence
            statusSequence.push(transition.toState);
            madeSteps++;
            //if outmadeSteps is equal to the length of the inputWord 
            //and our currenState is a finalState then the inputWord is accepted, if not its not accepted
            if ($scope.inputWord.length == madeSteps) {
                if (_.include($scope.config.finalStates, _.last(statusSequence))) {
                    accepted = true;
                    break;
                } else {
                    break;
                }
            }
        }
        return accepted;
    };


    //BUTTONS NEED DIRECTIVES
    /**
     *  Checks if the automata is playable ( has min. 1 states and 1 transition and automat has a start and a finalstate)
     * @return {Boolean} [description]
     */
    self.isPlayable = function () {
        return $scope.config.states.length >= 1 && $scope.config.transitions.length >= 1 && $scope.config.startState !== null && $scope.config.finalStates.length >= 1;
    };

    /**
     * [playOrPause description]
     * @return {[type]} [description]
     */
    self.playOrPause = function () {
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
            //$scope.dbug.debugDanger("Kein Automat vorhanden!");
        }

    };

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
    self.changeToPlay = function () {
        d3.select(".glyphicon-pause").attr("class", "glyphicon glyphicon-play");
        self.isInPlay = false;
    };

}
