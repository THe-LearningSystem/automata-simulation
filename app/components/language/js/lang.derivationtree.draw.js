autoSim.LangDerivationtreeDraw = function ($scope) {
    var self = this;

    self.orderId = 0;

    $scope.langCore.langUpdateListeners.push(self);

    /**
     * Calculates the positions of all rule elements and stores them in the order object.
     */
    self.calculatePositionsAndFollower = function () {
        var posX = 0;
        var posY = 100;
        var animationGroup = 0;
        var steps = null;

        if ($scope.langWordChecker.foundCandidate !== undefined) {
            steps = $scope.langWordChecker.foundCandidate.steps;
        }

        if ($scope.langWordChecker.inputAccepted) {
            var follower = -1;

            _.forEach(steps, function (value) {
                var rule = $scope.langProductionRules.getByRuleId(value);
                posX += 100;

                if (follower !== -1) {
                    self.getById(follower).follower.push(self.orderId);
                }
                var test = new autoSim.LangDerivationtreeOrder(self.orderId++, rule.left, posX, posY, animationGroup);
                follower = self.orderId;
                follower -= 1;
                self.push(test);
                posY += 100;

                _.forEach(rule.right, function (char) {

                    if (char == angular.lowercase(char)) {
                        self.getById(follower).follower.push(self.orderId);
                        var test = new autoSim.LangDerivationtreeOrder(self.orderId++, char, posX, posY, animationGroup);
                        self.push(test);
                    }
                });
                posY -= 100;
                animationGroup++;
            });
        }
    };

    /**
     * Searches the transferred derivationtree group, and returns the follower group of it.
     * @param   {[[Type]]} object [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.getAnimationGroup = function (groupId, next) {
        var value = 1;
        
        if (!next) {
            value = - 1;
        }
        
        for (var i = 0; i < self.length; i++) {

            if (self[i].animationGroup === groupId && self[i + value].animationGroup !== groupId) {
                
                return self[i + value].animationGroup;
            }
        }
    };

    /**
     * Returns the rule with the given id.
     * @param nonTerminalId
     * @returns {object} Returns the objectReference of the production undefined if not found
     */
    self.getById = function (id) {

        return self[self.getIndexById(id)];
    };

    /**
     * Get the array position of the given rule.
     * @param   {[[Type]]} nonTerminalId [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.getIndexById = function (id) {
        return _.findIndex(self, function (value) {
            if (value.id === id) {

                return value;
            }
        });
    };

    // Called by the listener in the core.
    self.updateFunction = function () {
        while (self.pop() !== undefined) {}

        self.calculatePositionsAndFollower();
    };
};
autoSim.LangDerivationtreeDraw.prototype = Array.prototype;
