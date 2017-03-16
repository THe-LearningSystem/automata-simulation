autoSim.Productions = function ($scope) {
    var self = this;

    console.log("langProduction");

    self.productionId = 0;
    self.nonTerminal = [];
    self.terminal = [];
    self.startVariable = 'S';
    self.endVariable = '-';
    self.posX = 0;
    self.posY = 0;

    /**
     * Searches the Rule with the given parameter.
     * @param   {[[Type]]} left [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.findStartRuleId = function () {
        var result = undefined;

        _.forEach($scope.productions, function (tmp) {
            if (tmp.left == self.startVariable) {
                result = tmp.id;
            }
        });
        return result;
    };

    /**
     * Set's the follower of each production rule.
     */
    self.addFollowingId = function () {
        _.forEach(self, function (tmp) {

            _.forEach(tmp.right, function (value) {

                if (value == angular.uppercase(value)) {

                    _.forEach(self, function (production) {

                        if (value == production.left) {
                            if (!self.checkIfFollowerExists(tmp.follower, production.id)) {
                                tmp.follower.push(production.id);
                            }
                        }

                    });
                }
            });
        });
    };

    /**
     * Check the array for an existing value and returns true, if this value exist's.
     * @param   {[[Type]]} followerArray [[Description]]
     * @param   {[[Type]]} toAdd         [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.checkIfFollowerExists = function (followerArray, toAdd) {
        var check = false;

        _.forEach(followerArray, function (value) {
            if (value == toAdd) {
                check = true;
            }
        });
        return check;
    };

    /**
     * Return the nonTerminal array.
     * @returns {[[Type]]} [[Description]]
     */
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
        return self.createWithId(self.productionId++, prLeft, prRight);
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
        // Type 3 language
        var prLeftUpper = angular.uppercase(prLeft);

        self.addVariable(prLeftUpper, self.nonTerminal, true);
        self.addVariable(prRight, self.nonTerminal, true);
        self.addVariable(prLeftUpper, self.terminal, false);
        self.addVariable(prRight, self.terminal, false);
        self.calculateStartPosition(prLeftUpper, prRight);
        var production = new autoSim.Production(pId, prLeftUpper, prRight, self.posX, self.posY);
        self.push(production);
        self.addFollowingId();
        return production;
    };

    /**
     * Set's the position of a rule in the diagram.
     * @param {[[Type]]} left [[Description]]
     */
    self.calculateStartPosition = function (left) {
        self.posX = 200;
        self.posY = 200;
        console.log(self.pos);

        if (left == self.startVariable) {
            self.posX = 100;
            self.posY = 100;
        }
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
            if (upper === true) {
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
        self.findStartRuleId();
    };

};
autoSim.Productions.prototype = Array.prototype;
