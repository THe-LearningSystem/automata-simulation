autoSim.DerivationSequence = function ($scope) {
    var self = this;

    console.log("create DerivationSequence");

    self.currentPosition = undefined;
    self.positions = [];
    self.currentSequenceObjId = 0;
    self.firstStep = true;
    self.counter = 0;

    $scope.langCore.langUpdateListeners.push(self);


    /**
     * Searches the next right sequence.
     */
    self.getNextTerminal = function () {
        var check = false;
        var string = "";

        _.forEach($scope.productions, function (production) {

            if (production.id == self.currentPosition) {

                _.forEach(production.follower, function (follows) {

                    if (!check) {
                        self.positions.push(follows);
                    }

                    //Check if endsign is not reachable!!!!

                    _.forEach($scope.productions, function (followProduction) {

                        if (follows == followProduction.id) {

                            if (self.firstStep === true) {

                                var sequence = new autoSim.DerivationSequenceObject(self.currentSequenceObjId++,
                                    production.right);
                                self.push(sequence);
                                self.firstStep = false;

                            }

                            if (!check) {
                                string = _.replace($scope.derivationsequence[self.currentSequenceObjId - 1].sequence,
                                    followProduction.left, followProduction.right);
                                var sequence = new autoSim.DerivationSequenceObject(self.currentSequenceObjId++,
                                    string);
                                self.push(sequence);
                            }

                            var test = string.includes($scope.productions.endSign);

                            if (test) {
                                check = true;
                                self.positions = [];
                            }

                        }
                    });
                });
            }
        });
        self.currentPosition = self.positions.pop();
        self.counter++;
    };

    /**
     * Calls the getNextTerminal method, until endSign is reached.
     */
    self.callGetNextTerminal = function () {
        self.currentPosition = $scope.productions.findStartRuleId();

        while ($scope.productions.getEndSignId() !== self.currentPosition) {
            self.getNextTerminal();

            if (self.counter > 10) {
                return false;
            }
        }
    };

    // Called by the listener in the core.
    self.updateFunction = function () {
        self.positions = [];
        self.currentSequenceObjId = 0;
        self.firstStep = true;
        self.counter = 0;

        while (self.pop() !== undefined) {}
        self.callGetNextTerminal();
    };

};
autoSim.DerivationSequence.prototype = Array.prototype;
