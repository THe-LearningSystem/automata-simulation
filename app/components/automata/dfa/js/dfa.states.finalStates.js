/**
 * Constructor for the final States
 * @param $scope
 * @constructor
 */
autoSim.FinalStates = function ($scope) {
    var self = this;

    /**
     * Returns the Index of the saved FinalState
     * @param state
     * @returns {number}
     */
    self.getIndexByState = function (state) {
        for (var i = 0; i < self.length; i++) {
            if (self[i] === state)
                return i;
        }
        return -1;
    };

    /**
     * Returns if the state is a finalState
     * @param state
     * @returns {Boolean}
     */
    self.isFinalState = function (state) {
        for (var i = 0; i < self.length; i++) {
            if (self[i] === state)
                return true;
        }
        return false;
    };

    /**
     * Create a state as final State if it isn't already created and if their is a state with such a id
     * @returns {Boolean}
     */
    self.create = function (state) {
        if (!self.isFinalState(state)) {
            self.push(state);
            $scope.core.updateListener();
            return true;
        } else {
            console.error("State is already a finalState!", state, self);
            return false;
        }
    };

    /**
     * Remove a state from the final states
     * @param state
     * @returns {boolean}
     */
    self.remove = function (state) {
        if (self.isFinalState(state)) {
            self.splice(self.getIndexByState(state), 1);
            $scope.core.updateListener();
            return true;
        } else {
            console.error("Can't remove state from finalStates,state isn't a finalState!", state, self);
            return false;
        }
    };

    /**
     * Toggle if the state is a finalstate or not
     * @param state
     */
    self.toggle = function (state) {
        if (self.isFinalState(state)) {
            self.remove(state);
        } else {
            self.create(state);
        }
    };

    /**
     * Exports the finalStates
     * @returns {object}
     */
    self.export = function () {
        var exportedObj = {};
        exportedObj.array = [];
        _.forEach(self, function (finalState) {
            exportedObj.array.push(_.cloneDeep(finalState));
        });
        return exportedObj;
    };

    /**
     * Imports the importedData
     * @param importedData
     */
    self.import = function (importedData) {
        self.clear();
        _.forEach(importedData.array, function (finalState) {
            self.create($scope.states.getById(finalState.id));
        });
    };

    /**
     * Clear the array
     */
    self.clear = function () {
        _.forEach(self, function () {
            self.pop();
        });
    };
};
autoSim.FinalStates.prototype = Array.prototype;