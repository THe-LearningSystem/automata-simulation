autoSim.DerivationSequence = function ($scope) {
    "use strict";
    var self = this;

    self.sequenceId = 0;
    self.nextLeft = '';
    self.currentRight = "";

    console.log("create DerivationSequence");

    self.calculateCurrentTerminal = function (toCheck) {
        //only type 3 possible
        _.forEach($scope.productions, function (production) {
            //only type 3 possible
            if (production.left == toCheck) {
                //Why to use????? has no function
                self.createNextSequeceStep(production);
                self.setNextLeft(production.right);
                return true;
            }
        });
    };

    self.calculateSequence = function (start) {
        while (self.nextLeft !== '-') {
            console.log(self.nextLeft);
            var current = start;
            self.calculateCurrentTerminal(start);
            start = self.nextLeft;
        }
        console.log(self.currentRight);
    };

    self.setNextLeft = function (string) {

        _.forEach(string, function (value) {

            if (value == angular.uppercase(value)) {
                self.nextLeft = value;
            }
        });
    };

    self.createNextSequeceStep = function (production) {
        if (self.currentRight !== "") {
            var tmp = '';
            var nonTerminal = '';
            var string = "";

            _.forEach(self.currentRight, function (char) {
                tmp = angular.uppercase(char);

                if (tmp == char) {

                    _.forEach(production.left, function (left) {

                        if (char == left) {
                            string = _.replace(self.currentRight, left, production.right);

                            if (production.right == '-') {
                                string = _.trim(string, '-');
                            }
                            var sequence = new autoSim.DerivationSequenceObject(self.sequenceId++, string);
                            self.push(sequence);
                            self.currentRight = string;
                            return true;
                        }
                    });
                }
            });
        } else {
            self.currentRight = production.right;
            var sequence = new autoSim.DerivationSequenceObject(self.sequenceId++, production.right);
            self.push(sequence);
        }
    };

    $scope.$watch('productions.startVariable', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            //reset sequence
            self.currentRight = "";
            self.nextLeft = '';
            self.calculateSequence($scope.productions.startVariable);
        }
    });
};
autoSim.DerivationSequence.prototype = Array.prototype;
