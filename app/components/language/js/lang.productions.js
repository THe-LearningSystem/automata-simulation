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

    /**
     * Call's the "createWithId" function, to add the current Id.
     * @param   {[[Type]]} prLeft  [[Description]]
     * @param   {[[Type]]} prRight [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.create = function (prLeft, prRight) {
        // Type 3 language
        var prLeftUpper = angular.uppercase(prLeft);

        return self.createWithId(self.productionId++, prLeftUpper, prRight);
    };

    /**
     * Add the new production rule to itself.
     * Call's the functions to add Values of production rule.
     * @param   {[[Type]]} pId     [[Description]]
     * @param   {[[Type]]} prLeft  [[Description]]
     * @param   {[[Type]]} prRight [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.createWithId = function (pId, prLeft, prRight) {
        self.addVariable(prLeft, self.nonTerminal, true);
        self.addVariable(prRight, self.nonTerminal, true);
        self.addVariable(prLeft, self.terminal, false);
        self.addVariable(prRight, self.terminal, false);

        var production = new autoSim.Production(pId, prLeft, prRight);
        self.push(production);
        return production;
    };

    /**
     * Sort array by Id.
     * @param   {[[Type]]} array [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.sortByAlphabet = function (array) {
        return _.sortBy(array, []);
    };

    /**
     * Add's char to the specified array.
     * @param {[[Type]]} variable [[Description]]
     * @param {Array}    array    [[Description]]
     * @param {[[Type]]} upper    [[Description]]
     */
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

    /**
     * Checks if the permitted variable exist's in the array. 
     * @param   {[[Type]]} char     [[Description]]
     * @param   {[[Type]]} variable [[Description]]
     * @returns {boolean}  [[Description]]
     */
    self.checkVariableIfExist = function (char, variable) {
        for (var i = 0; variable[i] !== undefined; i++) {
            if (variable[i] == char) {
                return false;
            }
        }
        return true;
    };

    /**
     * Changes current startVariable of the grammar.
     * @param {[[Type]]} variable [[Description]]
     */
    self.changeStartVariable = function (variable) {
        self.startVariable = variable;
    };

};
autoSim.Productions.prototype = Array.prototype;
