/**
 * Constructor for the states object
 * @param $scope
 * @constructor
 */
autoSim.States = function ($scope) {
    var self = this;

    self.statePrefix = 'S';
    self.startState = null;
    self.final = new autoSim.FinalStates($scope);
    self.selected = null;
    self.statesId = 0;
    self.radius = 25;


    /**
     * Checks if a state exists with the given name
     * @param stateName
     * @param stateId stateId (optionally -> excluded from search)
     * @returns {boolean}
     */
    self.existsWithName = function (stateName, stateId) {
        var tmp = false;
        _.forEach(self, function (state) {
            if (state.name == stateName && ( stateId === undefined || state.id !== stateId)) {
                tmp = true;
                return false;
            }
        });
        return tmp;
    };

    /**
     * Checks if a state exists with the given id
     * @param stateId
     * @returns {Boolean}
     */
    self.existsWithId = function (stateId) {
        for (var i = 0; i < self.length; i++) {
            if (self[i].id == stateId)
                return true;
        }
        return false;
    };

    /**
     * Checks if the state has transitions
     * @param state
     * @returns {Boolean}
     */
    self.hasTransitions = function (state) {
        var tmp = false;
        _.forEach($scope.transitions, function (transition) {
            if (transition.fromState === state || transition.toState === state) {
                tmp = true;
                return true;
            }
        });
        return tmp;
    };

    /**
     * Get the array index from the state with the given stateId
     * @param stateId
     * @returns  {Boolean} Returns the index and -1 when state with stateId not found
     */
    self.getIndexByStateId = function (stateId) {
        return _.findIndex(self, function (state) {
            if (state.id === stateId) {
                return state;
            }
        });
    };

    /**
     * Returns the State with the given stateId
     * @param stateId
     * @returns {object} Returns the objectReference of the state undefined if not found
     */
    self.getById = function (stateId) {
        return self[self.getIndexByStateId(stateId)];
    };

    /**
     * Returns the found state with the given stateName
     * @param stateName
     * @returns {object}
     */
    self.getByName = function (stateName) {
        var tmp = -1;
        _.forEach(self, function (value) {
            if (stateName === value.name) {
                tmp = value.id;
                return false;
            }
        });
        return tmp === -1 ? undefined : self[self.getIndexByStateId(tmp)];
    };

    /**
     * Create a state with default name
     * @param x
     * @param y
     * @returns {object} the created object
     */
    self.createWithPresets = function (x, y) {
        var stateNameNumber = self.length;
        while (self.existsWithName((self.statePrefix + stateNameNumber))) {
            stateNameNumber++;
        }
        var obj = self.create((self.statePrefix + stateNameNumber), x, y);
        if (self.startState == null) {
            self.changeStartState(obj);
        }
        return obj;
    };

    /**
     * Creates a state at the end of the states array
     * @param stateName
     * @param x
     * @param y
     * @returns {object} the created object or undefined
     */
    self.create = function (stateName, x, y) {
        if (!self.existsWithName(stateName)) {
            return self.createWithId(self.statesId++, stateName, x, y);
        } else {
            console.error("State with name already exists!", self.getByName(stateName));
            return undefined;
        }
    };

    /**
     * Creates a state ( use this function if state already exists)
     * Wrapper for createWithId
     * @param state
     */
    self.createWithObject = function (state) {
        self.createWithId(state.id, state.name, state.x, state.y);
    };

    /**
     * Creates a state at the end of the states array with a variable id
     * !!!don't use at other places!!!!
     * @param stateId
     * @param stateName
     * @param x
     * @param y
     * @returns {object} the created object
     */
    self.createWithId = function (stateId, stateName, x, y) {
        var state = new autoSim.State(stateId, stateName, x, y);
        self.push(state);
        $scope.core.updateListener();
        $scope.saveApply();


        return state;
    };

    /**
     * Removes the state with the given id
     * @param state
     * @returns {Boolean}
     */
    self.remove = function (state) {
        if (self.hasTransitions(state)) {
            $scope.showModalWithMessage('STATE_MENU.DELETE_MODAL_TITLE', 'STATE_MENU.DELETE_MODAL_DESC', 'states.forcedRemoveWithId(' + state.id + ')', 'MODAL_BUTTON.DELETE');
            return false;
        } else {
            if (self.final.isFinalState(state)) {
                self.final.remove(state);
            }
            if ($scope.automatonData.startState == state) {
                self.removeStartState();
            }
            self.splice(self.getIndexByStateId(state.id), 1);
            $scope.core.updateListener();
            return true;
        }
    };

    /**
     * Wrapper Function
     * @param stateId
     */
    self.forcedRemoveWithId = function (stateId) {
        self.forcedRemove(self.getById(stateId));
    };

    /**
     * Removes the state with all dependent transitions
     * @param state
     */
    self.forcedRemove = function (state) {
        for (var i = 0; i < $scope.transitions.length; i++) {
            var tmpTransition = $scope.transitions[i];
            if (tmpTransition.fromState === state || tmpTransition.toState === state) {
                $scope.transitions.remove(tmpTransition);
                i--;
            }
        }
        self.remove(state);
    };

    /**
     * Rename a state if the newStateName isn't already used
     * @param state
     * @param newStateName
     * @returns {boolean} true if success false if no success
     */
    self.rename = function (state, newStateName) {
        if (self.existsWithName(newStateName)) {
            console.error("State with name already exists!", self.getByName(newStateName));
            return false;
        } else {
            state.name = newStateName;
            $scope.core.updateListener();
            return true;
        }
    };

    /**
     * Changes the start state to the given state id
     */
    self.changeStartState = function (state) {
        self.startState = state;
        $scope.core.updateListener();
    };

    /**
     * Removes the startState if possible
     * @returns {boolean}
     */
    self.removeStartState = function () {
        if (self.startState !== null) {
            self.startState = null;
            $scope.core.updateListener();
            return true;
        }
        return false;
    };


    self.toggleStartState = function (state) {
        if (state === self.startState)
            self.removeStartState();
        else {
            self.changeStartState(state);
        }
    };

    /**
     * Moves a state to the given position
     * @param state
     * @param newX
     * @param newY
     */
    self.moveState = function (state, newX, newY) {
        state.x = newX;
        state.y = newY;
        $scope.transitions.updateTransitionSvgConfig(state);
    };


    /**
     * Exports the states
     * @returns {object}
     */
    self.export = function () {
        var exportedObj = {};
        exportedObj.array = [];
        _.forEach(self, function (state) {
            exportedObj.array.push(_.cloneDeep(state));
        });
        exportedObj.final = self.final.export();
        exportedObj.startState = _.cloneDeep(self.startState);
        exportedObj.statesId = self.statesId;
        return exportedObj;
    };

    /**
     * Import the states
     * @param importedData
     */
    self.import = function (importedData) {
        self.clear();
        _.forEach(importedData.array, function (state) {
            self.createWithObject(state);
        });
        if (importedData.startState !== null)
            self.startState = self.getById(importedData.startState.id);
        self.statesId = importedData.statesId;
        self.final.import(importedData.final);
    };

    /**
     * Clear the stateArray
     */
    self.clear = function () {
        _.forEach(self, function () {
            self.pop();
        });
        self.startState = null;
        self.statesId = 0;
    };
};
autoSim.States.prototype = Array.prototype;