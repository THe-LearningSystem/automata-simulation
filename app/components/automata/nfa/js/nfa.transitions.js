autoSim.TransitionsNPDA = function ($scope) {
    var self = this;
    autoSim.TransitionsPDA.apply(this, arguments);

    /**
     * Checks if a transition with the params already exists, excepts the given transition
     * @param fromState
     * @param toState
     * @param inputSymbol
     * @param transitionId
     * @returns {boolean}
     */
    self.exists = function (fromState, toState, inputSymbol, readFromStack, writeToStack, transitionId) {
        var tmp = false;
        _.forEach(self, function (transitionGroup) {
            if (fromState === transitionGroup.fromState) {
                _.forEach(transitionGroup, function (transition) {
                    if (transition.fromState === fromState && transition.toState === toState && transition.inputSymbol === inputSymbol &&
                        transition.readFromStack === readFromStack && transition.writeToStack === writeToStack
                        && transitionId !== transition.id) {
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
autoSim.TransitionsNPDA.prototype = Array.prototype;