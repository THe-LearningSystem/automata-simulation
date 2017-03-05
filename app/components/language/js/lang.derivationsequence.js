autoSim.DerivationSequence = function ($scope) {
    "use strict";
    var self = this;

    self.currentPosition = undefined;
    self.positions = [];
    self.currentSequenceObjId = 0;
    self.firstStep = true;

    console.log("create DerivationSequence");

    /**
     * Searches the next right sequence.
     */
    self.getNextTerminal = function () {
        var newPosition = 0;

        _.forEach($scope.productions, function (production) {

            if (production.id == self.currentPosition) {

                _.forEach(production.follower, function (follows) {
                    self.positions.push(follows);
                    
                    //check if no follower is available!!!!

                    _.forEach($scope.productions, function (followProduction) {

                        if (follows == followProduction.id) {

                            if (self.firstStep === true) {
                                var sequence = new autoSim.DerivationSequenceObject(self.currentSequenceObjId++,
                                    production.right);
                                self.push(sequence);
                                self.firstStep = false;

                            }
                            var string = _.replace($scope.derivationsequence[self.currentSequenceObjId - 1].sequence,
                                followProduction.left, followProduction.right);
                            var sequence = new autoSim.DerivationSequenceObject(self.currentSequenceObjId++,
                                string);
                            self.push(sequence);
                        }
                    });
                });
            }
        });
        self.currentPosition = self.positions.pop();
    };

    /**
     * Calls the getNextTerminal method, until end is reached.
     */
    self.callGetNextTerminal = function () {
        self.currentPosition = $scope.productions.findStartRuleId();

        while (self.currentPosition !== undefined) {
            self.getNextTerminal();
        }
    };

    /**
     * Set the sequence options to default values.
     */
    self.resetSequence = function () {
        self.currentPosition = $scope.productions.findStartRuleId();
        self.positions = [];
        self.currentSequenceObjId = 0;
        self.firstStep = true;

        while (self.pop() !== undefined) {}
        self.callGetNextTerminal();
    };

    //Listen for changes of the "startVariable"
    $scope.$watch('productions.startVariable', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            self.resetSequence();
        }
    });

};
autoSim.DerivationSequence.prototype = Array.prototype;
