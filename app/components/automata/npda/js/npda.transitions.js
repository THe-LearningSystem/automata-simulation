autoSim.TransitionsNFA = function ($scope) {
    var self = this;
    autoSim.Transitions.apply(this, arguments);

    /**
     * Checks if a transition with the params already exists, excepts the given transition
     * @param fromState
     * @param toState
     * @param newInputSymbol
     * @param transitionId
     * @returns {boolean}
     */
    self.exists = function (fromState, toState, newInputSymbol, transitionId) {
        var tmp = false;
        _.forEach(self, function (transitionGroup) {
            if (fromState === transitionGroup.fromState && toState === transitionGroup.toState) {
                _.forEach(transitionGroup, function (transition) {
                    if (fromState === transitionGroup.fromState && toState === transitionGroup.toState
                        && transition.inputSymbol === newInputSymbol && transitionId !== transition.id) {
                        tmp = true;
                        return false;
                    }
                });
                if (tmp === true)
                    return false;
            }
        });
        return tmp;
    };
};
autoSim.TransitionsNFA.prototype = Array.prototype;