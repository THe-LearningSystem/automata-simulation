autoSim.LangGrammar = function ($scope) {
    var self = this;

    self.nonTerminals = [];
    self.terminals = [];

    $scope.langCore.langUpdateListeners.push(self);

    /**
     * Stores all non terminals in the "nonTerminal" array.
     */
    self.getNonTerminals = function () {

        _.forEach($scope.langProductionRules, function (value) {

            if (!self.checkIfValueExists(self.nonTerminals, value.left)) {
                self.nonTerminals.push(value.left);
            }

            _.forEach(value.right, function (char) {

                if (!self.checkIfValueExists(self.nonTerminals, char) && char === angular.uppercase(char)) {
                    self.nonTerminals.push(char);
                }
            });
        });
    };

    /**
     * Stores all terminals in the "terminal" array.
     */
    self.getTerminals = function () {

        _.forEach($scope.langProductionRules, function (value) {

            _.forEach(value.right, function (char) {

                if (!self.checkIfValueExists(self.terminals, char) && char === angular.lowercase(char)) {
                    self.terminals.push(char);
                }
            });
        });
    };

    /**
     * Gets the next terminal and saves it in the animate object.
     * @returns {[[Type]]} [[Description]]
     */
    self.getTerminalStep = function () {
        var result = null;

        _.forEach($scope.langDerivationtree.draw, function (value) {

            if (value.animationGroup === $scope.langSimulator.animated.currentDerivationTreeGroup) {

                _.forEach(self.terminals, function (terminal) {

                    if (value.char === terminal) {
                        result = terminal;
                    }
                });
            }
        });
        return result;
    };

    /**
     * Checks, if a transferred value exists in the transferred array.
     * @param   {[[Type]]} array [[Description]]
     * @param   {[[Type]]} value [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.checkIfValueExists = function (array, value) {
        var result = false;

        _.forEach(array, function (tmpValue) {

            if (tmpValue === value) {
                result = true;
            }
        });

        return result;
    };

    // Called by the listener in the core.
    self.updateFunction = function () {
        self.nonTerminals = [];
        self.terminals = [];

        self.getNonTerminals();
        self.getTerminals();
    };
};
