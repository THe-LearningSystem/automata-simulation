autoSim.LangDerivationSequence = function ($scope) {
    var self = this;

    self.derivationSequenceId = 0;

    $scope.langCore.langUpdateListeners.push(self);

    /**
     * Searches the transferred derivationSequence, and returns the follower of it.
     * @param   {[[Type]]} object [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.getAnimationStep = function (sequence, next) {
        var value = 1;
        
        if (!next) {
            value = - 1;
        }
        
        for(var i = 0; i < self.length; i++) {
            
            if (self[i].sequence === sequence){

                return self[i + value];
            }
        }
    };
    
    /**
     * Calls the "buildString" method, for every id in steps array.
     */
    self.createSequence = function () {

        if ($scope.langWordChecker.inputAccepted) {

            _.forEach($scope.langWordChecker.foundCandidate.steps, function (value) {
                var currentRule = $scope.langProductionRules.getByRuleId(value);
                self.buildString(currentRule);
            });
        }
    };

    /**
     * Builds the string from the transferred rule.
     * @param {object} current [[Description]]
     */
    self.buildString = function (current) {

        if (self.length === 0) {
            var newFirstDerivationSequence = new autoSim.LangDerivationSequenceObject(self.derivationSequenceId++, current.right);
            self.push(newFirstDerivationSequence);

        } else {
            var lastString = self[self.length - 1].sequence;
            var string = _.replace(lastString, current.left, current.right);
            var newDerivationSequence = new autoSim.LangDerivationSequenceObject(self.derivationSequenceId++, string);
            self.push(newDerivationSequence);
        }
    };

    // Called by the listener in the core.
    self.updateFunction = function () {
        while (self.pop() !== undefined) {}

        self.createSequence();
    };
};
autoSim.LangDerivationSequence.prototype = Array.prototype;
