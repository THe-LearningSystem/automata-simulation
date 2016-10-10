/**
 * Constructor for the transitionGroup
 * @param fromState
 * @param toState
 * @constructor
 */
autoSim.TransitionGroupPDA = function (fromState, toState) {
    var self = this;
    autoSim.TransitionGroup.apply(this, arguments);

    /**
     * Creates a new Transition for override
     * @param id
     * @param inputSymbol
     */
    self.create = function (id, inputSymbol, readFromStack, writeToStack) {
        return self[self.push(new autoSim.TransitionObjectPDA(id, self.fromState, self.toState, inputSymbol, readFromStack, writeToStack)) - 1];
    };
};
autoSim.TransitionGroupPDA.prototype = Array.prototype;

/**
 * The transition object
 * @param id
 * @param fromState
 * @param toState
 * @param inputSymbol
 * @constructor
 */
autoSim.TransitionObjectPDA = function (id, fromState, toState, inputSymbol, readFromStack, writeToStack) {
    var self = this;
    self.id = id;
    self.fromState = fromState;
    self.toState = toState;
    self.inputSymbol = inputSymbol;
    self.readFromStack = readFromStack;
    self.writeToStack = writeToStack;
};

/**
 * Constructor for a transitionInputAlphabet
 * @param $scope
 * @constructor
 */
autoSim.TransitionStackAlphabet = function ($scope) {
    var self = this;
    self.stackFirstSymbol = "⊥";
    /**
     * Adds the newInputSymbol to the input alphabet if the char does not already exist
     * @param newInputSymbol
     */
    self.addIfNotExists = function (newStackSymbol) {
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
                if (tmpTransition.readFromStack === transition.readFromStack && tmpTransition.id !== transition.id) {
                    notFound = false;
                    return false;
                }
                if (!notFound)
                    return false;
            });
        });
        if (notFound) {
            _.pull(self, transition.readFromStack);
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


autoSim.PDAStack = function (stackArray) {
    var self = this;
    self.stackFirstSymbol = "⊥";
    if (stackArray === undefined)
        self.stackContainer = ["⊥"];
    else
        self.stackContainer = _.cloneDeep(stackArray);

    self.push = function (char) {
        if (char === "\u03b5") {
        } else {
            for (var i = 0; i < char.length; i++) {
                self.stackContainer.push(char[i]);
            }
        }

    };
    self.pop = function () {
        return self.stackContainer.pop();
    };

    self.tryToPop = function (char) {
        if (char === "\u03b5") {
        } else {
            for (var i = 0; i < char.length; i++) {
                self.stackContainer.pop();
            }
        }
    };
};