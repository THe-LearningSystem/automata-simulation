"use strict";

//Simulator for the simulation of the automata
var simulationDFA = function($scope) {
    var self = this;

    self.status;
    self.statusSequence = []; // TODO: Is there a better name for that?
    self.count; // TODO name this more meaningfull
    self.input = ''; // Set this to the empty string so that the simulation can be started
    self.processedWord = '';

    self.loopSimulation = true;
    //time between the steps
    self.stepTimeOut = 1500;
    //Time between loops when the animation restarts
    self.loopTimeOut = 1000;
    self.simulationPaused = false;

    //DONT NEEDED ANYMOREself.inAnimation = false;

    /**
     *  Checks if the automata is playable ( has min. 1 states and 1 transition and automat has a start and a finalstate)
     * @return {Boolean} [description]
     */
    self.isPlayable = function() {
        return $scope.config.states.length <1 && $scope.config.transitions.length < 1 && $scope.config.startState && $scope.config.finalStates.length <1;
    }

    //Simulation REMOVE START;

    self.playOrPause = function() {
        //the automat needs to be playable
        if (self.isPlayable) {
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




    function validateInput() {
        if ($scope.simulator.input != $scope.inputWord) {
            $scope.simulator.setInput($scope.inputWord);
            $scope.simulator.reset();
        }
    }
    //REMOVE END
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

    self.changeToPlay = function() {
        d3.select(".glyphicon-pause").attr("class", "glyphicon glyphicon-play");
        self.isInPlay = false;
    }



    self.updateConfig = function(config) {
            self.config = config;
        }
        // Sets an word for the simulation
    self.setInput = function(input) {
        self.input = input;
        self.count = 0;
        self.status = 'stoped';
    }

    // Reset the simulation by setting the start state as first state to the statusSequence and 
    // setting the status to 'stop'
    self.reset = function() {
        //remove graphdesigner animations if looped or if stopped
        if (self.currentState) {
            $scope.graphdesigner.setStateAs(self.currentState, false);
        }
        if (self.nextState) {
            $scope.graphdesigner.setStateAs(self.nextState, false);
        }
        if (self.transition) {
            $scope.graphdesigner.setTransitionAs(self.transition.id, false);
        }
        //reset animation settings

        self.currentState = null;
        self.transition = null;
        self.nextState = null;
        self.isInStep = false;
        self.animationStarted = false;
        self.animatedTransition = false;
        self.animatedNextState = false;
   
        self.nextChar = '';
        self.statusSequence = [$scope.config.startState];
        self.currentState = $scope.config.startState;
        self.count = 0;
        self.status = 'stoped';
        self.processedWord = '';
        if (self.lastVisited != null) {
            $scope.graphdesigner.setStateAsUnvisited(self.lastVisited);
            self.lastVisited = null;
        }
    }

    // Step through the simulation TODO: more comments
    self.step = function() {
        //if 
        if (!self.isInStep) {
            self.isInStep = true;
            self.status = 'step';
            self.nextChar = self.input[self.count++];

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
            self.transition = self.transition[0];
            self.nextState = self.transition.toState;


            if (self.input.length == self.count) {
                if (_.include($scope.config.finalStates, self.nextState)) {
                    self.status = 'accepted';
                } else {
                    self.status = 'not accepted';
                }
            }

            self.statusSequence.push(self.nextState);

        }


        //First: Paint the transition & wait
        if (!self.animatedTransition) {
            self.animatedTransition = true;
            $scope.graphdesigner.setTransitionAs(self.transition.id, true);

            //Second: Paint the nextstate & wait
        } else if (!self.animatedNextState && self.animatedTransition) {
            self.animatedNextState = true;
            $scope.graphdesigner.setStateAs(self.nextState, true);

            //Third: clear transition & currentStatecolor and set currentState = nexsttate and wait
        } else if (self.animatedTransition && self.animatedNextState) {
            $scope.graphdesigner.setTransitionAs(self.transition.id, false);
            $scope.graphdesigner.setStateAs(self.currentState, false);


            self.currentState = self.nextState;
            //Reset the step & start the next step
            self.isInStep = false;
            self.animatedNextState = false;
            self.animatedTransition = false;

        }

    }


    self.play = function() {
        //if the simulation
        if (!self.simulationPaused) {
            //start and prepare for the play
            if (!self.animationStarted) {
                self.startSimulation();
            }
            //loop through the steps
            if (self.isInStep || ((self.status != 'accepted') && (self.status != 'not accepted'))) {
                self.simulate();
            }

            //end the animation & reset it if loop through is activated the animation loop throuh play
            if (!self.isInStep && self.status == 'accepted') {
                self.endSimulation();
            }
        } else {

        }
    }

    self.pause = function() {
        self.simulationPaused = true;
    }

    self.stop = function() {
        self.pause();
        self.reset();

    }


    self.startSimulation = function() {
        self.reset();
        self.animationStarted = true;
        self.setInput($scope.inputWord);
        $scope.graphdesigner.setStateAs(_.last(self.statusSequence), true);

        $scope.safeApply();

    }

    self.simulate = function() {
        self.step();
        $scope.safeApply(function() {});
        if (self.isInStep || ((self.status != 'accepted') && (self.status != 'not accepted'))) {
            setTimeout(self.play, self.stepTimeOut);
        }

    }

    self.endSimulation = function() {

        //start again
        if (self.loopSimulation) {
            setTimeout(self.play, self.loopTimeOut);
            //finish the Animation
        } else {
            self.changeToPlay();

        }

        self.animationStarted = false;
        $scope.safeApply(function() {});

    }

    // Undo function to step backwards
    self.undo = function() {
        // return if utomat is not running
        if (!(_.include(['step', 'accepted', 'not accepted'], self.status))) {
            return;
        }
        self.status = 'step';

        // Reset if no more undoing is impossible
        if (self.count == 0) {
            self.reset();
        } else {
            // Decrease count and remove last element from statusSequence
            self.count--;
            self.statusSequence.pop();
        }
    }

}
