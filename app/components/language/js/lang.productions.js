autoSim.Productions = function ($scope) {
    var self = this;

    console.log("langProduction");

    self.radius = 20;
    self.orderId = 0;

    self.nonTerminalId = 0;
    self.ntX = 100;
    self.ntY = 100;

    self.terminalId = 0;
    self.tX = 100;
    self.tY = 200;

    self.nonTerminalObject = [];
    self.nonTerminalOrder = [];
    self.nonTerminal = []; //to delete!
    self.terminalObject = [];
    self.terminalOrder = [];
    self.terminal = []; //To delete!

    self.start = undefined;
    self.end = undefined;
    self.firstVar = true;
    self.selected = null;
    self.beginInput = true;

    self.updateRule = function (prod) {
        console.log(prod, self.start, self.end);
        var startProd = self.getByNonTerminalId(self.start);

        if (self.start == prod.left) {
            self.changeStart(prod.id);

        } else if (self.end == prod.left) {
            self.changeEnd(prod.left);
        }
    };

    $scope.langCore.langUpdateListeners.push(self);

    /**
     * For checking, that the rule is a type 3 rule and holds the conventions.
     * @param   {[[Type]]} left  [[Description]]
     * @param   {[[Type]]} right [[Description]]
     * @returns {boolean}  [[Description]]
     */
    self.noErrorsInInput = function (left, right) {
        var leftLetter = false;
        var rightLetter = false;

        if (self.checkLeftForLetter(left)) {

            leftLetter = true;
        }

        if (self.checkRightForLetter(right)) {

            rightLetter = true;

        }

        if (leftLetter && rightLetter && !self.beginInput) {
            return true;
        }

        if (self.beginInput) {
            self.beginInput = false;
        }

        return false;
    };

    /**
     * Checks the left value of a production rule, for only letters.
     * @param   {[[Type]]} string [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.checkLeftForLetter = function (string) {

        if (string !== undefined) {

            return /^[A-Z]/.test(string);
        } else {

            self.beginInput = true;
            return true;
        }
    };

    /**
     * Checks the right value of a production rule, for only letters.
     * @param   {[[Type]]} string [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.checkRightForLetter = function (string) {

        if (string !== undefined) {

            return /^[a-z][A-Z]/.test(string);
        } else {

            self.beginInput = true;
            return true;
        }
    };

    /**
     * Adds the non terminal to the non terminal order array, that is shown in the grid.
     * @param {[[Type]]} terminal [[Description]]
     */
    self.addNonTerminalToOrder = function (nonTerminal) {
        //Not optimal togetherness of terminal order and non terminal order.
        if (self.firstVar === false) {
            self.orderId++;
        }

        self.nonTerminalOrder.push(new autoSim.nonTerminalOrder(self.orderId, nonTerminal, self.ntX, self.ntY));
        self.ntX = self.ntX + 100;
        //self.ntY = self.ntY + 100;
        self.firstVar = false;
    };

    /**
     * Adds the terminal to the terminal order array, that is shown in the grid.
     * @param {[[Type]]} terminal [[Description]]
     */
    self.addTerminalToOrder = function (terminal) {
        self.terminalOrder.push(new autoSim.terminalOrder(self.orderId, terminal, self.tX, self.tY));
        self.tX = self.tX + 100;
        //self.tY = self.tY + 100;
    };

    /**
     * Changes the start values of the productions.
     * @param {[[Type]]} left [[Description]]
     */
    self.changeStart = function (nT) {

        _.forEach(self.nonTerminalObject, function (value) {

            if (value.isStart === true) {
                value.isStart = false;
            }

            if (nT == value.id) {
                value.isStart = true;
                self.start = value.id;
            }

            if (nT == -1) {
                self.start = undefined;
            }
        });
        $scope.langCore.langUpdateListener();
    };

    /**
     * Changes the end values of the productions.
     * @param {[[Type]]} left [[Description]]
     */
    self.changeEnd = function (left) {

        _.forEach(self.nonTerminalObject, function (value) {

            if (value.isEnd === true) {
                value.isEnd = false;
            }

            if (left == value.left) {
                value.isEnd = true;
                self.end = value.left;
            }

            if (left == -1) {
                self.end = undefined;
            }
        });
        $scope.langCore.langUpdateListener();
    };

    /**
     * Deletes the given Production with its transitions.
     * @param {[[Type]]} prId [[Description]]
     */
    self.removeWithId = function (prId) {

        if (self.getByNonTerminalId(prId).left == self.end) {
            self.changeEnd(-1);
        }

        if (self.getByNonTerminalId(prId).left == self.start) {
            self.changeStart(-1);
        }

        self.nonTerminalObject.splice(self.getIndexByNonTerminalId(prId), 1);
        self.terminalObject.splice(self.getIndexByTerminalId(prId), 1);
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
     * Searches the start rule.
     * @param   {[[Type]]} left [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.findStartRuleId = function () {
        var result;

        _.forEach(self.nonTerminalObject, function (tmp) {

            if (tmp.isStart) {
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
     * Get the non terminal order with the given non terminal id;
     * @param   {[[Type]]} nonTerminalId [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.getByNonTerminalOrderId = function (nonTerminalId) {

        return self.nonTerminalOrder[self.getIndexByNonTerminalOrderId(nonTerminalId)];
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
     * Get the terminal order with the given terminal id;
     * @param   {[[Type]]} nonTerminalId [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.getByTerminalOrderId = function (terminalId) {

        return self.terminalOrder[self.getIndexByTerminalOrderId(terminalId)];
    };

    /**
     * Get the array position of the given non terminal.
     * @param   {[[Type]]} nonTerminalId [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.getIndexByNonTerminalId = function (nonTerminalId) {
        return _.findIndex(self.nonTerminalObject, function (production) {
            if (production.id === nonTerminalId) {

                return production;
            }
        });
    };

    /**
     * Get the array index from the non terminal order array with the given id.
     * @param   {[[Type]]} nonTerminalId [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.getIndexByNonTerminalOrderId = function (nonTerminalId) {
        return _.findIndex(self.nonTerminalOrder, function (value) {
            if (value.id === nonTerminalId) {

                return value;
            }
        });
    };

    /**
     * Get the array position of the given terminal.
     * @param   {[[Type]]} terminalId [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.getIndexByTerminalId = function (terminalId) {
        return _.findIndex(self.terminalObject, function (production) {
            if (production.id === terminalId) {

                return production;
            }
        });
    };

    /**
     * Get the array index from the terminal order array with the given id.
     * @param   {[[Type]]} terminalId [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.getIndexByTerminalOrderId = function (terminalId) {
        return _.findIndex(self.terminalOrder, function (value) {
            if (value.id === terminalId) {

                return value;
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
        var terminalId;

        _.forEach(prRight, function (char) {

            if (char == angular.lowercase(char)) {
                terminalId = self.createTerminal(char).id;
            }
        });

        var nonTerminal = new autoSim.nonTerminal(pId, prLeftUpper, prRight, terminalId);
        self.nonTerminalObject.push(nonTerminal);
        self.updateTerminals();
        self.updateNonTerminals();
        self.updateFollowingIds();

        //Clear the input field after submission of the data.
        self.menuLeft = undefined;
        self.menuRight = undefined;
        self.beginInput = true;

        return nonTerminal;
    };

    /**
     * Set's the follower of a terminal from the non terminal.
     * Add's the terminal to the terminal object array. !! No available check if there is an existing terminal !!
     */
    self.checkTerminalFollowerOfNonTerminal = function () {

        _.forEach(self.nonTerminalObject, function (nonTerminal) {

            _.forEach(nonTerminal.right, function (char) {

                _.forEach(self.terminalObject, function (terminal) {

                    //Only do, when the terminal is not in the terminal object array.
                    if (char == angular.lowercase(char)) {
                        var test = false;

                        _.forEach(self.terminalObject, function (value) {

                            if (value.char == char) {
                                test = true;
                            }
                        });

                        if (test === false) {
                            nonTerminal.followerTerminal = self.createTerminal(char).id;
                        }
                    }

                    if (char == terminal.char) {
                        nonTerminal.followerTerminal = terminal.id;
                    }
                });
            });
        });
    };

    /**
     * Creates a terminal and add's it to the terminal object array.
     * @param   {[[Type]]} char [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.createTerminal = function (char) {
        var terminal = new autoSim.Terminal(self.terminalId++, char);
        self.terminalObject.push(terminal);

        return terminal;
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

    self.removeTerminalIfNotUsed = function () {
        var check = false;

        _.forEach(self.terminalObject, function (terminal) {

            _.forEach(self.nonTerminalObject, function (nonTerminal) {

                if (terminal !== undefined && terminal.id == nonTerminal.followerTerminal) {
                    check = true;
                }
            });

            if (!check && terminal !== undefined) {
                self.terminalObject.splice(self.getIndexByTerminalId(terminal.id), 1);
            }
            check = false;
        });
    };

    // Called by the listener in the core.
    self.updateFunction = function () {
        self.nonTerminalOrder = [];
        self.nonTerminal = [];
        self.terminalOrder = [];
        self.terminal = [];

        self.beginInput = true;

        self.ntX = 100;
        self.ntY = 100;

        self.tX = 100;
        self.tY = 200;

        self.updateNonTerminals();
        self.updateTerminals();

        _.forEach(self.nonTerminalObject, function (value) {
            value.follower.pop();
            value.followerTerminal = -1;
        });

        self.checkTerminalFollowerOfNonTerminal();
        self.updateFollowingIds();
        self.removeTerminalIfNotUsed();
    };
};
autoSim.Productions.prototype = Array.prototype;
