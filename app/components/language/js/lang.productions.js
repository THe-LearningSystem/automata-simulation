autoSim.Productions = function ($scope) {
    var self = this;

    console.log("langProduction");

    self.nonTerminalId = 0;
    self.terminalId = 0;
    self.nonTerminalObject = [];
    self.nonTerminal = [];
    self.terminalObject = [];
    self.terminal = [];
    self.selected = null;
    self.currentStartVariable = undefined;
    self.endSign = undefined;
    self.radiusNT = 25;
    self.radiusT = 20;
    self.posX = 0;
    self.posY = 0;

    $scope.langCore.langUpdateListeners.push(self);
    
    /**
     * Changes the endSign to the given one.
     * @param {[[Type]]} value [[Description]]
     */
    self.changeEndSign = function (value) {
        console.log(self);
        self.endSign = value;
        $scope.langCore.langUpdateListener();
    };

    /**
     * Searches for the Id, given the endSign.
     * @returns {[[Type]]} [[Description]]
     */
    self.getEndSignId = function () {
        var check = -1;

        _.forEach(self.nonTerminalObject, function (value) {

            _.forEach(value.right, function (right) {

                if (right == self.endSign) {
                    check = value.id;
                }
            });
        });
        return check;
    };

    /**
     * Changes the start values of the productions.
     * @param {[[Type]]} left [[Description]]
     */
    self.changeStart = function (left) {

        _.forEach(self.nonTerminalObject, function (value) {

            if (value.isStart === true) {
                value.isStart = false;
            }

            if (left == value.left) {
                value.isStart = true;
                self.currentStartVariable = value.left;
            }
        });
        $scope.langCore.langUpdateListener();
    };

    /**
     * Deletes the given Production with its transitions.
     * @param {[[Type]]} prId [[Description]]
     */
    self.removeWithId = function (prId) {
        $scope.langTransitions.removeWithId(prId);
        self.nonTerminalObject.splice(self.getIndexBynonTerminalId(prId), 1);
        $scope.langCore.langUpdateListener();
    };

    /**
     * Moves a non terminal to the given position.
     * @param state
     * @param newX
     * @param newY
     */
    self.moveNonTerminal = function (nonTerminal, newX, newY) {
        nonTerminal.posX = newX;
        nonTerminal.posY = newY;
        $scope.langTransitions.updateTransitionPosition(nonTerminal);
    };
    
    /**
     * Moves a terminal to the given position.
     * @param state
     * @param newX
     * @param newY
     */
    self.moveTerminal = function (terminal, newX, newY) {
        terminal.posX = newX;
        terminal.posY = newY;
        $scope.langTransitions.updateTransitionPosition(terminal, true);
    };

    /**
     * Searches the Rule with the given parameter.
     * @param   {[[Type]]} left [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.findStartRuleId = function () {
        var result;
        
        _.forEach(self.nonTerminalObject, function (tmp) {
            
            if (tmp.left == self.currentStartVariable) {
                result = tmp.id;
            }
        });
        return result;
    };

    /**
     * Set's the follower of each production rule.
     */
    self.updateFollowingIds = function () {

        _.forEach(self.nonTerminalObject, function (tmp) {
            
            _.forEach(self.nonTerminalObject, function (production) {

                _.forEach(production.right, function (right) {

                    if (tmp.left == right) {

                        if (!self.checkIfFollowerExists(production.follower, tmp.id)) {
                            production.follower.push(tmp.id);
                        }
                    }

                });
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
     * Returns the non terminal with the given id.
     * @param nonTerminalId
     * @returns {object} Returns the objectReference of the production undefined if not found
     */
    self.getByNonTerminalId = function (nonTerminalId) {
        return self.nonTerminalObject[self.getIndexByNonTerminalId(nonTerminalId)];
    };
    
    /**
     * Returns the terminal with the given id.
     * @param nonTerminalId
     * @returns {object} Returns the objectReference of the production undefined if not found
     */
    self.getByTerminalId = function (nonTerminalId) {
        return self.terminalObject[self.getIndexByTerminalId(nonTerminalId)];
    };

    /**
     * Get the array index from the production with the given id.
     * @param nonTerminalId
     * @returns  {Boolean} Returns the index and -1 when production with nonTerminalId not found
     */
    self.getIndexByNonTerminalId = function (nonTerminalId) {
        return _.findIndex(self.nonTerminalObject, function (production) {
            if (production.id === nonTerminalId) {
                return production;
            }
        });
    };
    
    /**
     * Get the array index from the production with the given id.
     * @param nonTerminalId
     * @returns  {Boolean} Returns the index and -1 when production with nonTerminalId not found
     */
    self.getIndexByTerminalId = function (nonTerminalId) {
        return _.findIndex(self.terminalObject, function (production) {
            if (production.id === nonTerminalId) {
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
        var newProduction = self.createWithId(self.nonTerminalId++, prLeft, prRight);
        $scope.langTransitions.checkNonTerminalTransitions();
        $scope.langTransitions.checkTerminalTranstition();
        return newProduction;
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

        var nonTerminal = new autoSim.nonTerminal(pId, prLeftUpper, prRight, self.posX, self.posY);

        var counter = 0;
        var x = 0;
        var y = self.posY + 100;
        self.posX = self.posX + 100;

        _.forEach(prRight, function (char) {

            if (char == angular.lowercase(char)) {
                if (counter > 0) {
                    x = x + 100;
                }
                var terminal = new autoSim.Terminal(self.terminalId++, x, y, char, pId);
                self.terminalObject.push(terminal);
                counter++;
            }
        });

        self.nonTerminalObject.push(nonTerminal);
        self.updateTerminals();
        self.updateNonTerminals();
        self.updateFollowingIds();
        return nonTerminal;
    };

    /**
     * Reinspect on functionality. <-----------------------------------------------------------------<
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
     * Set's and updates the non terminals.
     */
    self.updateNonTerminals = function () {

        _.forEach(self.nonTerminalObject, function (value) {

            if (value.left == angular.uppercase(value.left) && value.left !== undefined) {

                if (!self.checkVariableIfExist(value.left, self.nonTerminal)) {
                    self.nonTerminal.push(value.left);
                }
            }
        });
    };

    /**
     * Set's and updates the terminals.
     */
    self.updateTerminals = function () {

        _.forEach(self.nonTerminalObject, function (value) {

            _.forEach(value.right, function (right) {

                if (right == angular.lowercase(right)) {

                    if (!self.checkVariableIfExist(right, self.terminal)) {
                        self.terminal.push(right);
                    }
                }
            });
        });

    };

    /**
     * Checks if the permitted variable exist's in the array. 
     * @param   {[[Type]]} char     [[Description]]
     * @param   {[[Type]]} variable [[Description]]
     * @returns {boolean}  [[Description]]
     */
    self.checkVariableIfExist = function (char, array) {
        for (var i = 0; array[i] !== undefined; i++) {
            if (array[i] == char) {
                return true;
            }
        }
        return false;
    };

    // Called by the listener in the core.
    self.updateFunction = function () {
        self.nonTerminal = [];
        self.terminal = [];

        self.updateNonTerminals();
        self.updateTerminals();
    };

};
autoSim.Productions.prototype = Array.prototype;
