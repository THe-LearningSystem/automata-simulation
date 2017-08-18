autoSim.LangWordChecker = function ($scope) {
    var self = this;

    self.inputAccepted = false;
    self.foundCandidate = undefined;
    self.counter = 0;

    $scope.langCore.langUpdateListeners.push(self);

    /**
     * Function, that tries to create the Wort, entered in the input field.
     * @returns {[[Type]]} [[Description]]
     */
    self.searchInputWord = function () {
        var firstStep = true;
        var noSolution = false;

        if ($scope.langProductionRules.getStartRule() === undefined) {
            return false;
        }

        while (!noSolution) {

            if (self.length === 0 && firstStep) {
                var startRule = $scope.langProductionRules.getStartRule();
                var checkInformation = new autoSim.LangCheckInformationObject(startRule.right, [startRule.id]);
                self.push(checkInformation);
                firstStep = false;

            } else {
                var nextCheck = undefined;

                if (self.length === 0) {
                    noSolution = true;
                } else {
                    nextCheck = self.shift();
                    self.createNextInfoObject(nextCheck);

                    if (self.checkString(nextCheck)) {
                        self.inputAccepted = true;
                        self.foundCandidate = nextCheck;

                        return true;
                    }
                }
            }
        }
    };

    /**
     * Creates the next string and steps and saves it as an InformationObject.
     * @param {object} nCheck [[Description]]
     */
    self.createNextInfoObject = function (nCheck) {
        _.forEach($scope.langProductionRules.getFollowerRuleIds(nCheck.steps[nCheck.steps.length - 1]), function (value) {
            var current = $scope.langProductionRules.getByRuleId(value);

            var tmpString = self.cloneString(nCheck.string);

            if (current.right === "ε") {
                //current.right = "";
            }
            var string = _.replace(tmpString, current.left, current.right);
            var array = self.cloneArray(nCheck);

            array.push(current.id);

            var newInfoObject = new autoSim.LangCheckInformationObject(string, array);

            if (self.checkStringTerminalLength(newInfoObject.string) <= $scope.languageData.inputWord.length + 1) {
                self.push(newInfoObject);
            }
        });
    };

    /**
     * Searches the transferred production id, and returns the follower of it.
     * @param   {[[Type]]} object [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.getNextStep = function (index) {

        return self.foundCandidate[index + 1];
    };

    /**
     * Clone an String, for working with copies of them.
     * @param   {[[Type]]} string [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.cloneString = function (string) {
        var tmp = "";
        //console.log(string, self.counter++);

        _.forEach(string, function (char) {
            tmp += char;
        });

        return tmp;
    };

    /**
     * Clone an Array, for working with copies of them.
     * @param   {object}   array [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.cloneArray = function (array) {
        var tmp = [];

        _.forEach(array.steps, function (value) {
            tmp.push(value);
        });

        return tmp;
    };

    self.prepareInputWord = function (string) {

        return string + 'ε';
    };

    /**
     * Checks, if the current check string is the input word.
     * @param {[[Type]]} infoObject [[Description]]
     */
    self.checkString = function (removedInfoObject) {
        var result = false;

        if (removedInfoObject.string == self.prepareInputWord($scope.languageData.inputWord)) {
            result = true;
        }

        return result;
    };

    /**
     * Checks the given string for terminals and returns the count of them.
     * @param   {[[Type]]} string [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.checkStringTerminalLength = function (string) {
        var count = 0;

        _.forEach(string, function (char) {

            if (char == angular.lowercase(char)) {
                count++;
            }
        });

        return count;
    };

    // Called by the listener in the core.
    self.updateFunction = function () {
        self.inputAccepted = false;
        self.counter = 0;

        while (self.pop() !== undefined) {}

        self.searchInputWord();
    };
};
autoSim.LangWordChecker.prototype = Array.prototype;
