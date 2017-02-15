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
            var right = "";

            //only type 3 possible
            if (production.left == toCheck) {
                self.setNextLeft(production.right);
                right = self.createSequece(production)
                return true;
            }
        });
    };

    self.setNextLeft = function (string) {
        
        _.forEach(string, function (value) {
            
            if (value == angular.uppercase(value)) {
                self.nextLeft = value;
            }
        });
    };

    self.createSequece = function (production) {
        if (self.currentRight !== "") {
            var tmp = '';
            var nonTerminal = '';
            var string = "";
            
            _.forEach(self.currentRight, function(char) {
                tmp = angular.uppercase(char);
                console.log("Tmp: " + tmp + " Char: " + char);
                
                if(tmp == char) {
                    
                    _.forEach(production.left, function(left) {
                        console.log("Left: " + left);
                        
                        if(char == left) {
                            string = _.replace(self.currentRight, left, production.right)
                            console.log(string);
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
};
autoSim.DerivationSequence.prototype = Array.prototype;
