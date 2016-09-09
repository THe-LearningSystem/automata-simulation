/**
 * Constructor for the transitionGroup
 * @param fromState
 * @param toState
 * @constructor
 */
autoSim.TransitionGroup = function (fromState, toState) {
    var self = this;
    self.fromState = fromState;
    self.toState = toState;
    self.svgConfig = undefined;

    /**
     * Creates a new Transition for override
     * @param id
     * @param inputSymbol
     */
    self.create = function (id, inputSymbol) {
        return self[self.push(new autoSim.TransitionObject(id, self.fromState, self.toState, inputSymbol)) - 1];
    };

    self.getById = function (id) {
        return self[_.findIndex(self, function (transition) {
            if (transition.id == id) {
                return transition;
            }
        })];
    };
};
autoSim.TransitionGroup.prototype = Array.prototype;


/**
 * The transition object
 * @param id
 * @param fromState
 * @param toState
 * @param inputSymbol
 * @constructor
 */
autoSim.TransitionObject = function (id, fromState, toState, inputSymbol) {
    var self = this;
    self.id = id;
    self.fromState = fromState;
    self.toState = toState;
    self.inputSymbol = inputSymbol;
};


/**
 * Constructor for a transitionInputAlphabet
 * @param $scope
 * @constructor
 */
autoSim.TransitionInputAlphabet = function ($scope) {
    var self = this;

    /**
     * Adds the newInputSymbol to the input alphabet if the char does not already exist
     * @param newInputSymbol
     */
    self.addIfNotExists = function (newInputSymbol) {
        if (!_.some(self, function (savedInputSymbol) {
                return savedInputSymbol === newInputSymbol;
            })) {
            self.push(newInputSymbol);
            return true;
        }
        return false;
    };

    /**
     * Removes a char from the alphabet if this char is only used from the given transition
     * @param  transition
     * @returns {boolean} true if it was removed false if not removed
     */
    self.removeIfNotUsedFromOthers = function (transition) {
        for (var i = 0; i < $scope.transitions.length; i++) {
            if (transition.inputSymbol === $scope.transitions[i].name && $scope.transitions[i].id !== transition.id) {
                return false;
            }
        }
        _.pull(self, transition.inputSymbol);
        return true;
    };

    /**
     * exports the transitionInputAlphabet
     * @returns {object}
     */
    self.export = function () {
        var exportData = {};
        exportData.array = [];
        _.forEach(self, function (inputSymbol) {
            exportData.array.push(inputSymbol);
        });
        return exportData;
    };

    /**
     * Imports the data
     * @param importData
     */
    self.import = function (importData) {
        self.clear();
        _.forEach(importData.array, function (inputSymbol) {
            self.addIfNotExists(inputSymbol);
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
autoSim.TransitionInputAlphabet.prototype = Array.prototype;

/**
 * Constructor for the svgConfig
 * @param path
 * @param textPositionX
 * @param textPositionY
 * @constructor
 */
autoSim.SvgConfig = function (path, textPositionX, textPositionY) {
    var self = this;
    self.path = path;
    self.textPosition = {};
    self.textPosition.x = textPositionX;
    self.textPosition.y = textPositionY;
};