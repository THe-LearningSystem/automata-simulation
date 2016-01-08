"use strict";

//Simulator for the simulation of the automata
var simulationDFA = function(config, $scope) {
    var self = this;

    self.config = config;
    self.status;
    self.statusSequence = []; // TODO: Is there a better name for that?
    self.count; // TODO name this more meaningfull
    self.input = ''; // Set this to the empty string so that the simulation can be started
    self.processedWord = '';


    //animation controls
    self.animationStarted = false;
    self.animationPaused = false;
    self.inAnimation = false;
    self.loopAnimation = false;
    //time between the steps
    self.animationStepTimeOut = 1500;
    //Time between loops when the animation restarts
    self.animationBetweenLoopTimeOut = 1000;

    self.lastVisited = null;


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
        self.statusSequence = [self.config.startState];
        self.count = 0;
        self.status = 'stoped';
        self.processedWord = '';
    }

    // Step through the simulation TODO: more comments
    self.step = function() {
        console.log("Step" + self.count);


        //testanimate
        //
        if(self.lastVisited != null){
          console.log("TEst");
          $scope.graphdesigner.setStateAsUnvisited(self.lastVisited);
        }
        if (self.status == 'stoped') {
            self.reset();
            //include checks if the self.status is in collection
        } else if (_.include([undefined, 'accepted', 'not accepted'], self.status)) {
            return;
        }

        self.status = 'step';
        var nextChar = self.input[self.count++];
        var nextState = _.filter(self.config.transitions, function(transition) {
            if (nextChar == undefined) {
                self.status = 'not accepted';
                return;
            }
            //get
            return transition.fromState == _.last(self.statusSequence) && transition.name == nextChar;
        });
        //if there is no next transition
        if (_.isEmpty(nextState)) {
            self.status = 'not accepted';
            return;
        }

        var newStatus = nextState[0].toState;
        $scope.graphdesigner.setStateAsVisited(newStatus);
        self.lastVisited = newStatus;
        self.processedWord += nextChar;
        if (self.input.length == self.count) {
            if (_.include(self.config.finalStates, newStatus)) {
                self.status = 'accepted';
            } else {
                self.status = 'not accepted';
            }
        }
        self.statusSequence.push(newStatus);
        return nextState;
    }


    self.play = function() {
        if (!self.animationPaused) {
            //start and prepare for the play
            if (!self.animationStarted) {
                startAnimation();
            }
            //loop through the steps
            if ((self.status != 'accepted') && (self.status != 'not accepted')) {
                playAnimation();
            }

            //end the animation & reset it if loop through is activated the animation loop throuh play
            if (self.status == 'accepted') {
                endAnimation();

            }
        }
    }

    self.pause = function() {
        self.animationPaused = true;
    }

    self.stop = function() {
        self.pause();
        self.reset();

    }


    function startAnimation() {
        console.log("Animation Started");
        self.reset();
        self.animationStarted = true;
        self.setInput($scope.inputWord);
        $scope.safeApply(function() {});

    }

    function playAnimation() {

        self.step();
        $scope.safeApply(function() {});
        if ((self.status != 'accepted') && (self.status != 'not accepted')) {
            setTimeout(self.play, self.animationStepTimeOut);
        }

    }

    function endAnimation() {

        //start again
        if (self.loopAnimation) {

            setTimeout(self.play, self.animationBetweenLoopTimeOut);
            //finish the Animation
        } else {

            $scope.changeToPlay();

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
