autoSim.LangProductionRules = function ($scope) {
    var self = this;

    self.productionId = 0;

    $scope.langCore.langUpdateListeners.push(self);

    /**
     * Calls the createWithId function, with ascending productionId.
     * @param {[[Type]]} left  [[Description]]
     * @param {[[Type]]} right [[Description]]
     */
    self.create = function (left, right) {
        self.menuLeft = undefined;
        self.menuRight = undefined;

        return self.createWithId(self.productionId++, left, right);
    };

    /**
     * Creates the production and adds it to itself.
     * @param {[[Type]]} id    [[Description]]
     * @param {[[Type]]} left  [[Description]]
     * @param {[[Type]]} right [[Description]]
     */
    self.createWithId = function (id, left, right) {
        //var rightArray = self.createRightArray(right);
        var production = new autoSim.LangProductionRuleObject(id, left, right);
        self.push(production);

        self.updateFollowerRules();
        $scope.langCore.langUpdateListener();

        return production;
    };

    /**
     * Deletes the given production rules and calls the other tab methods.
     * @param {[[Type]]} prId [[Description]]
     */
    self.removeWithId = function (prId) {

        if (self.getByRuleId(prId) == self.getStartRule()) {
            self.changeStart(-1);
        }

        self.splice(self.getIndexByRuleId(prId), 1);
        $scope.langCore.langUpdateListener();
    };

    /**
     * Set's the follower of each production rule.
     */
    self.updateFollowerRules = function () {

        _.forEach(self, function (tmp) {

            _.forEach(self, function (production) {

                _.forEach(production.right, function (right) {

                    if (tmp.left == right) {

                        if (!self.checkIfValueExists(production.followerRuleId, tmp.id)) {
                            production.followerRuleId.push(tmp.id);
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
    self.checkIfValueExists = function (array, toCheck) {
        var check = false;

        _.forEach(array, function (value) {

            if (value == toCheck) {
                check = true;
            }
        });

        return check;
    };

    /**
     * Returns the start rule.
     * @param   {[[Type]]} left [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.getStartRule = function () {
        var result;

        _.forEach(self, function (value) {

            if (value.isStart) {
                result = value;
            }
        });

        return result;
    };

    /**
     * Returns the rule with the given id.
     * @param nonTerminalId
     * @returns {object} Returns the objectReference of the production undefined if not found
     */
    self.getByRuleId = function (ruleId) {

        return self[self.getIndexByRuleId(ruleId)];
    };

    /**
     * Get the array position of the given rule.
     * @param   {[[Type]]} nonTerminalId [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.getIndexByRuleId = function (ruleId) {

        return _.findIndex(self, function (value) {
            if (value.id === ruleId) {

                return value;
            }
        });
    };

    /**
     * Searches and returns the follower array of the given rule id.
     * @param   {[[Type]]} id [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.getFollowerRuleIds = function (id) {
        var result = [-1];

        _.forEach(self, function (value) {

            if (value.id == id) {
                result = value.followerRuleId;
            }
        });

        return result;
    };

    /**
     * Changes the start values of the production rules.
     * @param {[[Type]]} left [[Description]]
     */
    self.changeStart = function (rule) {

        _.forEach(self, function (value) {

            if (value.isStart === true) {
                value.isStart = false;
            }

            if (rule.id == value.id) {
                value.isStart = true;
            }
        });
        $scope.langCore.langUpdateListener();
    };

    // Called by the listener in the core.
    self.updateFunction = function () {

        _.forEach(self, function (value) {
            while (value.followerRuleId.pop() !== undefined) {}
        });

        self.updateFollowerRules();
        $scope.langProductionRules.change.checkStartRuleDropdown();
    };

};
autoSim.LangProductionRules.prototype = Array.prototype;
