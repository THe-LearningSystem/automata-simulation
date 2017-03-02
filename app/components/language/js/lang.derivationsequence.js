autoSim.DerivationSequence = function ($scope) {
    "use strict";
    var self = this;

    self.currentPosition = 0;
    self.currentSequenceObjId = 0;

    console.log("create DerivationSequence");

    /**
     * Searches the next right sequence.
     */
    self.getNextTerminal = function () {
        var tmp = '';
        var tmp2 = '';
        var tmp3 = '';
        var tmp4 = '';


        if (self.currentPosition === 0) {

            _.forEach($scope.productions, function (production) {

                if ($scope.productions.startVariable == production.left) {
                    self.currentPosition = production.follower[0];
                    var sequence = new autoSim.DerivationSequenceObject(self.currentSequenceObjId++, production.id, production.right);
                    self.push(sequence);
                }
            });
        } else {

            _.forEach($scope.productions, function (production) {

                if (self.currentPosition == production.id) {
                    tmp = production.right;
                    //Needs better method.
                    tmp2 = production.follower[0];
                    tmp3 = production.left;
                    tmp4 = production.id;
                }
            });
            var string = _.replace($scope.derivationsequence[self.currentSequenceObjId - 1].sequence, tmp3, tmp);
            var sequence = new autoSim.DerivationSequenceObject(self.currentSequenceObjId++, tmp4, string);
            self.push(sequence);
            self.currentPosition = tmp2;
            console.log(self);
        }
    };

    /**
     * Calls the getNextTerminal method, until end is reached.
     */
    self.callGetNextTerminal = function () {
        var i = 0;

        while (i < 10) {
            self.getNextTerminal();
            i++;
        }
    };

    /**
     * Set the sequence options to default values.
     */
    self.resetSequence = function () {
        self.currentPosition = 0;
        self.currentSequenceObjId = 0;

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
