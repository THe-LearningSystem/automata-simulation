autoSim.DerivationSequence = function ($scope) {
    var self = this;

    self.dSequenceId = 0;

    $scope.langCore.langUpdateListeners.push(self);

    /**
     * Creates the complete derivation sequence.
     */
    self.createDerivationSequence = function () {
        var counter = 0;
        var endCounter = 10;
        var firstStep = false;
        var toAdd;

        var current = $scope.productions.getByNonTerminalId($scope.productions.findStartRuleId());

        while (counter < endCounter) {

            if (!firstStep) {
                firstStep = true;
                toAdd = self.buildSequence(current);

            } else {
                toAdd = _.replace(self[self.length - 1].sequence, current.left, self.buildSequence(current));
            }
            self.addSequence(toAdd, current);

            current = $scope.productions.getByNonTerminalId(self.setNextFollower(current));
            counter++;
        }
        self.checkEndOfSequence();
    };

    /**
     * Sets the next Value, to calculate the next derivation step.
     * @param   {object}   current [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.setNextFollower = function (current) {
        var amount = self.checkFollowerAmount(current);

        if (amount > 1) {
            //Rework for better algorithm, but works for now.
            var random = Math.floor((Math.random() * amount) + 0);

            return current.follower[random];

        } else {

            return current.follower[0];
        }
    };

    /**
     * Counts the follower of an non terminal.
     * @param   {object}   current [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.checkFollowerAmount = function (current) {
        var count = 0;

        _.forEach(current.follower, function (value) {
            count++;
        });

        return count;
    };

    /**
     * Builds the string, with terminal and non terminal.
     * @param   {[[Type]]} current [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.buildSequence = function (current) {
        var string = self.getNextTerminal(current);
        string = string.concat(self.getNextNonTerminal(current));

        return string;
    };

    /**
     * Creates an Object aóf derivation sequence and adds it to itself.
     * @param {[[Type]]} string [[Description]]
     */
    self.addSequence = function (string) {
        var sequence = new autoSim.DerivationSequenceObject(self.dSequenceId++, string);
        self.push(sequence);
    };

    /**
     * Checks, that the end of the derivation sequence is the end sign, and change it to them.
     */
    self.checkEndOfSequence = function () {

        for (var i = self.length - 1; i > 0; i--) {
            var toCheck = self[i].sequence;
            var newString = "";

            _.forEach($scope.productions.nonTerminalObject, function (value) {

                if (toCheck.slice(-1) == value.left) {

                    if (value.isEnd) {
                        i = 0;
                        newString = _.replace(toCheck, value.left, "");
                    }
                }
            });

            if (i > 0) {
                self.pop();
            }
        }
        self.addSequence(newString);
    };

    /**
     * Gets the next terminal, based on the non terminal.
     * @param   {object}   current [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.getNextTerminal = function (current) {
        var result;

        _.forEach($scope.productions.terminalObject, function (terminal) {

            if (current.followerTerminal == terminal.id) {
                result = terminal.char;
            }
        });

        return result;
    };

    /**
     * Gets the next non terminal, based on the current non terminal.
     * @param   {object}   current [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.getNextNonTerminal = function (current) {
        var result;

        _.forEach($scope.productions.nonTerminalObject, function (value) {

            if (current.follower[0] == value.id) {
                result = value.left;
            }
        });

        return result;
    };

    // Called by the listener in the core.
    self.updateFunction = function () {

        while (self.pop() !== undefined) {}
        self.createDerivationSequence();
    };

};
autoSim.DerivationSequence.prototype = Array.prototype;
