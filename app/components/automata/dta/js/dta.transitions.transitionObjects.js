/**
 * Constructor for the transitionGroup
 * @param fromState
 * @param toState
 * @constructor
 */
autoSim.TransitionGroupDTA = function(fromState, toState) {
    var self = this;
    autoSim.TransitionGroup.apply(this, arguments);

    /**
     * Creates a new Transition for override
     * @param id
     * @param inputSymbol
     */
    self.create = function(id, readSymbol, writeSymbol, movingDirection) {
        return self[self.push(new autoSim.TransitionObjectDTA(id, self.fromState, self.toState, readSymbol, writeSymbol, movingDirection)) - 1];
    };
};
autoSim.TransitionGroupDTA.prototype = Array.prototype;

/**
 * The transition object
 * @param id
 * @param fromState
 * @param toState
 * @param readSymbol
 * @param writeSymbol
 * @param movingDirection
 * @constructor
 */
autoSim.TransitionObjectDTA = function(id, fromState, toState, readSymbol, writeSymbol, movingDirection) {
    var self = this;
    self.id = id;
    self.fromState = fromState;
    self.toState = toState;
    self.readSymbol = readSymbol;
    self.witeSymbol = writeSymbol;
    self.movingDirection = movingDirection;
};

/**
 * Constructor for a transitionInputAlphabet
 * @param $scope
 * @constructor
 */
autoSim.TransitionTapeAlphabet = function ($scope) {
    var self = this;
    self.blankSymbol = "☐";
    /**
     * Adds the newInputSymbol to the input alphabet if the char does not already exist
     * @param newInputSymbol
     */
    self.addIfNotExists = function (newTapeSymbol) {
        for (var i = 0; i < newStackSymbol.length; i++) {
            if (!_.some(self, function (savedStackSymbol) {
                    return savedStackSymbol === newStackSymbol[i];
                }) && newStackSymbol[i] !== "\u03b5") {
                self.push(newStackSymbol[i]);
                return true;
            }
            return false;
        }
    };

    /**
     * Removes a char from the alphabet if this char is only used from the given transition
     * @param  transition
     * @returns {boolean} true if it was removed false if not removed
     */
    self.removeIfNotUsedFromOthers = function (transition) {
        //search if an other transition use the same readFromStack
        var i;
        var notFound = true;
        _.forEach($scope.transitions, function (transitionGroup) {
            _.forEach(transitionGroup, function (tmpTransition) {
                if (tmpTransition.writeSymbol === transition.writeSymbol && tmpTransition.id !== transition.id) {
                    notFound = false;
                    return false;
                }
                if (!notFound)
                    return false;
            });
        });
        if (notFound) {
            _.pull(self, transition.writeSymbol);
        }

    };

    /**
     * exports the transitionInputAlphabet
     * @returns {object}
     */
    self.export = function () {
        var exportData = {};
        exportData.array = [];
        _.forEach(self, function (stackSymbol) {
            exportData.array.push(stackSymbol);
        });
        return exportData;
    };

    /**
     * Imports the data
     * @param importData
     */
    self.import = function (importData) {
        self.clear();
        _.forEach(importData.array, function (stackSymbol) {
            self.addIfNotExists(stackSymbol);
        });
    };

    /**
     * Clears the InputAlphabet
     */
    self.clear = function () {
        _.forEach(self, function () {
            self.pop();
        });
    };
};
autoSim.TransitionStackAlphabet.prototype = Array.prototype;
