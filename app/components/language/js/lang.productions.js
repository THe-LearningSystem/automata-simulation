autoSim.Productions = function ($scope) {
    var self = this;

    console.log("langProduction");

    self.productionId = 0;
    self.nonTerminal = [];
    self.terminal = [];
    self.startVariable = 'S';
    self.endVariable = '-';

    self.getNonTerminals = function () {
        return self.nonTerminal;
    };

    self.create = function (prLeft, prRight) {
        // Type 3 language
        var prLeftUpper = angular.uppercase(prLeft);

        return self.createWithId(self.productionId++, prLeftUpper, prRight);
    };

    self.createWithId = function (pId, prLeft, prRight) {
        self.addVariable(prLeft, self.nonTerminal, true);
        self.addVariable(prRight, self.nonTerminal, true);
        self.addVariable(prLeft, self.terminal, false);
        self.addVariable(prRight, self.terminal, false);

        var production = new autoSim.Production(pId, prLeft, prRight);
        self.push(production);
        return production;
    };

    self.sortByAlphabet = function (array) {
        return _.sortBy(array, []);
    };

    self.addVariable = function (variable, array, upper) {
        var i = 0;
        var character = "";
        while ((character = variable[i]) !== undefined) {
            if (upper == true) {
                if (character == angular.uppercase(character)) {
                    if (self.checkVariableIfExist(character, array)) {
                        if (character !== self.endVariable) {
                            array.push(character);
                            array = self.sortByAlphabet(array);
                        }
                    }
                }
            } else {
                if (character == angular.lowercase(character)) {
                    if (self.checkVariableIfExist(character, array)) {
                        if (character !== self.endVariable) {
                            array.push(character);
                            array = self.sortByAlphabet(array);
                        }
                    }
                }
            }
            i++;
        }
    };

    self.checkVariableIfExist = function (char, variable) {
        for (var i = 0; variable[i] !== undefined; i++) {
            if (variable[i] == char) {
                return false;
            }
        }
        return true;
    };

    self.changeStartVariable = function (variable) {
        self.startVariable = variable;
    };

};
autoSim.Productions.prototype = Array.prototype;
