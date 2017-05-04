autoSim.Productions = function ($scope) {
    var self = this;

    console.log("langProduction");

    self.productionId = 0;
    self.nonTerminal = [];
    self.terminal = [];
    self.selected = null;
    self.startVariable = 'S';
    self.endVariable = '-';
    self.posX = 0;
    self.posY = 0;

    /**
     * Moves a production to the given position.
     * @param state
     * @param newX
     * @param newY
     */
    self.moveProduction = function (production, newX, newY) {
        production.posX = newX;
        production.posY = newY;
    };

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
     * @param   {[[Type]]} toCheck         [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.checkIfFollowerExists = function (followerArray, toCheck) {
        var check = false;

        _.forEach(followerArray, function (value) {
            if (value == toCheck) {
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
     * Returns the production with the given id.
     * @param productionId
     * @returns {object} Returns the objectReference of the production undefined if not found
     */
    self.getById = function (productionId) {
        return self[self.getIndexByProductionId(productionId)];
    };

    /**
     * Get the array index from the production with the given id.
     * @param productionId
     * @returns  {Boolean} Returns the index and -1 when production with productionId not found
     */
    self.getIndexByProductionId = function (productionId) {
        return _.findIndex(self, function (production) {
            if (production.id === productionId) {
                return production;
            }
        });
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
        // Only Type 3 language
        var prLeftUpper = angular.uppercase(prLeft);

        self.addVariable(prLeftUpper, self.nonTerminal, true);
        self.addVariable(prRight, self.nonTerminal, true);
        self.addVariable(prLeftUpper, self.terminal, false);
        self.addVariable(prRight, self.terminal, false);

        var production = new autoSim.Production(pId, prLeftUpper, prRight, self.posX, self.posY);

        self.addFollowingId();

        var rightId = 0;
        var counter = 0;
        var x = self.posX;
        var y = self.posY + 100;
        self.posX = self.posX + 200;

        _.forEach(prRight, function (char) {

            if (self.checkVariableIfExist(char, self.nonTerminal)) {
                if (counter > 0) {
                    x = x - 100;
                }
                var rightProduction = production.create(rightId++, x, y, char);
                counter++;
            }
        });

        self.push(production);
        return production;
    };

    /**
     * Not in use.
     * Set's the position of a rule in the diagram.
     * @param {[[Type]]} left [[Description]]
     */
    self.updateLeftPositions = function () {

        _.forEach(self, function (value) {

            _.forEach(self, function (follow) {

                _.forEach(follow.follower, function (followArray) {

                    if (followArray == value.id) {
                        value.posX = self.posX;
                        value.posY = self.posY;
                    }
                });

            });
        });
    };

    /**
     * Reinspect on functionality.
     * Sort array by Id.
     * @param   {[[Type]]} array [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.sortByAlphabet = function (array) {
        /*
        _.sortBy([2, 3, 1], function (num) {
            return num;
        });
        */
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
                            self.sortByAlphabet(array);
                        }
                    }
                }
            } else {
                if (character == angular.lowercase(character)) {
                    if (self.checkVariableIfExist(character, array)) {
                        if (character !== self.endVariable) {
                            array.push(character);
                            self.sortByAlphabet(array);
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
