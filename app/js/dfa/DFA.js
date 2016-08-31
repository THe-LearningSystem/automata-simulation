/**
 * DFA constructor, creates the DFA with all needed subComponents
 * @param $scope
 * @constructor
 */
function DFACore($scope) {
    "use strict";
    var self = this;

    //Array of all update Listeners
    self.updateListeners = [];

    self.inNameEdit = false;

    /**
     * Removes the current automata and the inputWord
     */
    self.resetAutomaton = function () {
        //clear the svgContent
        $scope.statediagram ? $scope.statediagram.clearSvgContent() : '';
        $scope.simulator.reset();
        $scope.automatonData = new AutomatonDataDFA();
        self.updateListener();
        self.config.unSavedChanges = false;
        $scope.safeApply();
    };

    /**
     * This function calls the method updateFunction of every element in $scope.core.updateListeners
     */
    self.updateListener = function () {
        _.forEach($scope.core.updateListeners, function (value) {
            value.updateFunction();
        });
        $scope.automatonData.unSavedChanges = true;
    };
}


function States($scope) {
    var self = this;

    self.config = {};
    self.config.statePrefix = 'S';
    self.startState = null;
    self.final = new FinalStates($scope);

    /**
     * Checks if a state exists with the given name
     * @param stateName
     * @param stateId stateId (optionally -> excluded from search)
     * @returns {boolean}
     */
    self.existsWithName = function (stateName, stateId) {
        var tmp = false;
        _.forEach(self, function (state) {
            if (state.name == stateName && state.id !== stateId) {
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
        var obj = self.create((self.statePrefix + self.length), x, y);
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
            return self.createWithId(self.length, stateName, x, y);
        } else {
            console.error("State with name already exists!", self.getByName(stateName));
            return undefined;
        }
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
        var state = new State(stateId, stateName, x, y);
        self.push(state);
        $scope.statediagram ? $scope.statediagram.drawState(state) : '';
        $scope.safeApply();
        $scope.core.updateListener();
        return state;
    };

    /**
     * Removes the state with the given id
     * @param state
     * @returns {Boolean}
     */
    self.remove = function (state) {
        if (self.hasTransitions(state)) {
            $scope.showModalWithMessage('STATE_MENU.DELETE_MODAL_TITLE', 'STATE_MENU.DELETE_MODAL_DESC', 'states.forcedRemove(' + state + ')', 'MODAL_BUTTON.DELETE');
            return false;
        } else {
            if (self.final.isFinalState(state)) {
                self.removeFinalState(state);
            }
            if ($scope.automatonData.startState == state) {
                self.removeStartState();
            }
            $scope.statediagram ? $scope.statediagram.remove(state) : '';
            self.splice(self.getIndexByStateId(state), 1);
            //update the other listeners when remove is finished
            $scope.core.updateListener();
            return true;
        }
    };

    /**
     * Removes the state with all dependent transitions
     * @param state
     */
    self.forcedRemove = function (state) {
        for (var i = 0; i < $scope.transitions.length; i++) {
            var tmpTransition = $scope.transitions[i];
            if (tmpTransition.fromState === state || tmpTransition.toState === state) {
                self.remove(tmpTransition.id);
                i--;
            }
        }
        $scope.remove(state);
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
            $scope.statediagram ? $scope.statediagram.rename(state, newStateName) : '';
            $scope.core.updateListener();
            return true;
        }
    };

    /**
     * Changes the start state to the given state id
     */
    self.changeStartState = function (state) {
        $scope.statediagram ? $scope.statediagram.changeStartState(state) : '';
        $scope.states.startState = state;
        $scope.core.updateListener();
    };

    /**
     * Removes the startState if possible
     * @returns {boolean}
     */
    self.removeStartState = function () {
        if ($scope.automatonData.startState !== null) {
            $scope.statediagram ? $scope.statediagram.removeStartState() : '';
            $scope.automatonData.startState = null;
            $scope.core.updateListener();
            return true;
        }
        return false;
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
        state.objReference.attr("transform", "translate(" + newX + "," + newY + ")");
        $scope.statediagram ? $scope.statediagram.updateTransitionsAfterStateDrag(state) : '';
    };
}
States.prototype = Array.prototype;


function FinalStates($scope) {
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
     * Create a state as final State if it isn't already createed and if their is a state with such a id
     * @returns {Boolean}
     */
    self.create = function (state) {
        if (!self.isFinalState(state)) {
            self.push(state);
            $scope.statediagram ? $scope.statediagram.create(state) : '';
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
            $scope.statediagram ? $scope.statediagram.removeFinalState(state) : '';
            self.splice(self.getIndexByState(state), 1);
            $scope.core.updateListener();
            return true;
        } else {
            console.error("Can't remove state from finalStates,state isn't a finalState!", state, self);
            return false;
        }
    };
}
FinalStates.prototype = Array.prototype;

function Transitions($scope) {
    var self = this;
    self.inputSymbolAlphabet = new TransitionInputAlphabet($scope);

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
        _.forEach(self, function (transition) {
            if (fromState === transition.fromState && toState === transition.toState && newInputSymbol === transition.inputSymbol && transitionId !== transition.id) {
                tmp = true;
                return false;
            }
        });
        return tmp;
    };

    /**
     * Return the next possible inputSymbol (a,b,c already used -> returns d)
     * @param fromState
     * @returns {string}
     */
    self.getNextInputSymbol = function (fromState) {
        var namesArray = [];
        for (var i = 0; i < self.length; i++) {
            if (self[i].fromState == fromState) {
                namesArray.push(self[i].name);
            }
        }
        var foundNextName = false;
        var tryChar = "a";
        while (!foundNextName) {
            var value = _.indexOf(namesArray, tryChar);
            if (value === -1) {
                foundNextName = true;
            } else {
                tryChar = String.fromCharCode(tryChar.charCodeAt() + 1);
            }
        }
        return tryChar;

    };

    /**
     * Creates a transition at the end of the transitions array
     * @param fromState
     * @param toState
     * @param inputSymbol
     */
    self.create = function (fromState, toState, inputSymbol) {
        if (!self.exists(fromState, toState, inputSymbol)) {
            self.inputSymbolAlphabet.addIfNotExists(inputSymbol);
            return self.createWithId($scope.automatonData.countTransitionId++, fromState, toState, inputSymbol);
        } else {
            console.error("Cant create transition,exists", self.exists(fromState, toState, inputSymbol));
        }
    };

    /**
     * Creates a transition at the end of the transitions array -> for import
     * !!!don't use at other places!!!!! ONLY FOR IMPORT
     * @param transitionId
     * @param fromState
     * @param toState
     * @param inputSymbol
     */
    self.createWithId = function (transitionId, fromState, toState, inputSymbol) {
        var transition = new TransitionDFA(transitionId, fromState, toState, inputSymbol);
        self.push(transition);
        $scope.statediagram ? $scope.statediagram.drawTransition(transition) : '';
        //fix changes wont update after create from the statediagram
        $scope.safeApply();
        $scope.core.updateListener();
        return transition;
    };

    /**
     * Get the array index from the transition with the given transitionId
     * @param transitionId
     * @returns        Returns the index and -1 when state with transitionId not found
     */
    self.getIndexByTransitionId = function (transitionId) {
        return _.findIndex(self, function (transition) {
            if (transition.id == transitionId) {
                return transition;
            }
        });
    };

    /**
     * Returns the transition of the given transitionId
     * @param transitionId
     * @returns {object}        Returns the objectReference of the state
     */
    self.getById = function (transitionId) {
        return self[self.getIndexByTransitionId(transitionId)];
    };

    /**
     * Returns the transition with the given information
     * @param fromState      Id of the fromState
     * @param toState        id from the toState
     * @param inputSymbol The name of the transition
     * @returns {Object}
     */
    self.get = function (fromState, toState, inputSymbol) {
        for (var i = 0; i < self.length; i++) {
            var transition = self[i];
            if (transition.fromState == fromState && transition.toState == toState && transition.inputSymbol == inputSymbol) {
                return transition;
            }
        }
        return undefined;
    };

    /**
     * Removes the transition
     * @param transition      The id from the transition
     */
    self.remove = function (transition) {
        self.inputSymbolAlphabet.removeIfNotUsedFromOthers(transition);
        $scope.statediagram ? $scope.statediagram.remove(transition) : '';
        self.splice(self.getIndexByTransitionId(transition), 1);
        $scope.core.updateListener();
    };

    /**
     * Modify a transition if is unique with the new name
     * @param transition
     * @param newInputSymbol
     */
    self.modify = function (transition, newInputSymbol) {
        if (!self.exists(transition.fromState, transition.toState, newInputSymbol, transition.id)) {
            self.inputSymbolAlphabet.removeIfNotUsedFromOthers(transition);
            self.inputSymbolAlphabet.addIfNotExists(newInputSymbol);
            transition.inputSymbol = newInputSymbol;
            $scope.statediagram ? $scope.statediagram.modify(transition, newInputSymbol) : '';
            $scope.core.updateListener();
        }
    };
}
Transitions.prototype = Array.prototype;


function TransitionInputAlphabet($scope) {
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
}
TransitionInputAlphabet.prototype = Array.prototype;