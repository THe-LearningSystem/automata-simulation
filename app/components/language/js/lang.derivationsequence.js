autoSim.DerivationSequence = function ($scope) {
    "use strict";
    var self = this;

    self.sequenceId = 0;
    self.nextLeft = '';
    self.currentRight = "";

    console.log("create DerivationSequence");

    /**
     * Call's the methods for sequence creation.
     * @param   {[[Type]]} toCheck [[Description]]
     * @returns {boolean}  [[Description]]
     */
    self.createSequence = function (toCheck) {
        //only type 3 possible
        _.forEach($scope.productions, function (production) {
            //only type 3 possible
            if (production.left == toCheck) {
                self.createNextSequeceStep(production);
                self.setNextLeft(production.right);
                return true;
            }
        });
    };

    /**
     * Calls up "createSequence", until endVariable is reached.
     * @param {[[Type]]} start [[Description]]
     */
    self.calculateSequence = function (start) {
        while (self.nextLeft !== '-') {
            var current = start;
            self.createSequence(start);
            start = self.nextLeft;
        }
    };

    /**
     * Set's the "nextLeft" to the current left of the right side of production rule.
     * @param {[[Type]]} string [[Description]]
     */
    self.setNextLeft = function (string) {

        _.forEach(string, function (value) {

            if (value == angular.uppercase(value)) {
                self.nextLeft = value;
            }
        });
    };

    /**
     * Create the next step of the derivation sequence.
     * @param   {object}  production [[Description]]
     * @returns {boolean} [[Description]]
     */
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

    /**
     * Set the sequence options to default values.
     */
    self.resetSequence = function () {
        self.currentRight = "";
        self.nextLeft = '';
        
        while(self.pop() !== undefined) {}
        self.calculateSequence($scope.productions.startVariable);
    }
    
    //Listen for changes of the "startVariable"
    $scope.$watch('productions.startVariable', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            self.resetSequence();
        }
    });

};
autoSim.DerivationSequence.prototype = Array.prototype;
