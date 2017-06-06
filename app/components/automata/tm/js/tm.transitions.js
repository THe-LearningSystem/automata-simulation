/**
 * Constructor for the TM transitions object
 * @param $scope
 * @constructor
 */
autoSim.TransitionsTM = function($scope) {
    var self = this;
    autoSim.Transitions.apply(this, arguments);
    self.inputSymbolAlphabet = new autoSim.TransitionInputAlphabet($scope);
    self.tapeAlphabet = new autoSim.TransitionTapeAlphabet($scope);
    self.transitionAlphabet = new autoSim.TransitionAlphabet($scope);
    self.textLength = 40;
    self.selfTransitionTextLength = 24;
    self.tapeAlphabet.addIfNotExists("☐");


    /**
     * Checks if a transition with the params already exists, excepts the given transition
     * @param fromState
     * @param toState
     * @param inputSymbol
     * @param outputSymbol
     * @param movingDirection
     * @param transitionId
     * @returns {boolean}
     */
    self.exists = function(fromState, toState, inputSymbol, outputSymbol, movingDirection, transitionId) {
        var tmp = false;
        _.forEach(self, function(transitionGroup) {
            if (fromState === transitionGroup.fromState) {
                _.forEach(transitionGroup, function(transition) {
                    if (transition.fromState === fromState && transition.inputSymbol === inputSymbol &&
                        transition.outputSymbol === outputSymbol && transition.movingDirection === movingDirection &&
                        transitionId !== transition.id) {
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

    /**
     * Return the next possible inputSymbol (a,b,c already used -> returns d)
     * @param fromState
     * @returns {string}
     */
    self.getNextOutputSymbol = function(fromState) {
        var inputSymbols = [];
        for (var i = 0; i < self.length; i++) {
            if (self[i].fromState == fromState) {
                _.forEach(self[i], function(transition) {
                    inputSymbols.push(transition.inputSymbol);
                })
            }
        }
        var foundNextName = false;
        var tryChar = "b";
        while (!foundNextName) {
            var value = _.indexOf(inputSymbols, tryChar);
            if (value === -1) {
                foundNextName = true;
            } else {
                tryChar = String.fromCharCode(tryChar.charCodeAt() + 1);
            }
        }
        return tryChar;
    };

    /**
     * Creates a transition with the DefaultValues
     * @param fromState
     * @param toState
     * @returns {fromState}
     */
    self.createWithDefaults = function(fromState, toState) {
        return self.create(fromState, toState, self.getNextInputSymbol(fromState), self.getNextOutputSymbol(fromState), "→");
    };

    /**
     * Creates a transition at the end of the transitions array
     * @param fromState
     * @param toState
     * @param inputSymbol
     * @param outputSymbol
     * @param movingDirection
     * @return {object}
     */
    self.create = function(fromState, toState, inputSymbol, outputSymbol, movingDirection) {
        if (!self.exists(fromState, toState, inputSymbol, outputSymbol, movingDirection)) {
            self.transitionAlphabet.addIfNotExists(inputSymbol);
            self.tapeAlphabet.addIfNotExists(inputSymbol);
            self.tapeAlphabet.addIfNotExists(outputSymbol);
            return self.createWithId(self.transitionsId++, fromState, toState, inputSymbol, outputSymbol, movingDirection);
        } else {
            console.error("Can't create transition. It already exists.", self.exists(fromState, toState, inputSymbol, outputSymbol, movingDirection));
        }
    };

    /**
     * Creates a transition at the end of the transitions array -> for import
     * !!!don't use at other places!!!!! ONLY FOR IMPORT
     * @param transitionId
     * @param fromState
     * @param toState
     * @param inputSymbol
     * @param outputSymbol
     * @param movingDirection
     * @return {object}
     */
    self.createWithId = function(transitionId, fromState, toState, inputSymbol, outputSymbol, movingDirection) {
        var transitionGroup = self.getTransitionGroup(fromState, toState);
        var transition = undefined;
        if (transitionGroup === undefined) {
            transitionGroup = new autoSim.TransitionGroupTM(fromState, toState);
            transition = transitionGroup.create(transitionId, inputSymbol, outputSymbol, movingDirection);
            self.push(transitionGroup);
        } else {
            transition = transitionGroup.create(transitionId, inputSymbol, outputSymbol, movingDirection);

        }
        //update the approach transition if there is one
        if (self.getTransitionGroup(transitionGroup.toState, transitionGroup.fromState) !== undefined) {
            var approachTransitionGroup = self.getTransitionGroup(transitionGroup.toState, transitionGroup.fromState);
            approachTransitionGroup.svgConfig = self.getTransitionSvgConfig(approachTransitionGroup, true);
        }
        $scope.core.updateListener();
        return transition;
    };

    /**
     * Removes the transition
     * @param transition      The id from the transition
     */
    self.remove = function(transition) {
        self.tapeAlphabet.removeIfNotUsedFromOthers(transition);
        self.transitionAlphabet.removeIfNotUsedFromOthers(transition);
        var transitionGroup = self.getTransitionGroup(transition.fromState, transition.toState);
        if (transitionGroup.length === 1) {
            _.remove(self, function(transitionGroup) {
                return transitionGroup.toState === transition.toState && transitionGroup.fromState === transition.fromState;
            });
            if (self.getTransitionGroup(transition.toState, transition.fromState) !== undefined) {
                var approachTransitionGroup = self.getTransitionGroup(transition.toState, transition.fromState);
                approachTransitionGroup.svgConfig = self.getTransitionSvgConfig(approachTransitionGroup);
            }
        } else {
            _.remove(transitionGroup, function(tmpTransition) {
                return transition.id === tmpTransition.id;
            })
        }
        $scope.core.updateListener();
    };

    /**
     * Modify a transition if is unique with the new name
     * @param transition
     * @param newInputSymbol
     * @param newOutputSymbol
     * @param newMovingDirection
     */
    self.modify = function(transition, newInputSymbol, newOutputSymbol, newMovingDirection) {
        if (!self.exists(transition.fromState, transition.toState, newInputSymbol, newOutputSymbol, newMovingDirection, transition.id)) {
            self.tapeAlphabet.removeIfNotUsed(transition);
            self.tapeAlphabet.addIfNotExists(newInputSymbol);
            self.tapeAlphabet.addIfNotExists(newOutputSymbol);
            self.transitionAlphabet.removeIfNotUsedFromOthers(transition);
            self.transitionAlphabet.addIfNotExists(newInputSymbol);

            // self.inputSymbolAlphabet.removeIfNotUsed(transition);
            // self.inputSymbolAlphabet.addIfNotExists(newInputSymbol);

            transition.inputSymbol = newInputSymbol;
            transition.outputSymbol = newOutputSymbol;
            transition.movingDirection = newMovingDirection;
            $scope.core.updateListener();
        }
    };


    /**
     * Export the transitionData
     * @returns {object}
     */
    self.export = function() {
        var exportData = {};
        exportData.array = [];
        _.forEach(self, function(transitionGroup) {
            exportData.array.push(_.cloneDeep(transitionGroup));
        });
        exportData.transitionsId = self.transitionsId;
        exportData.inputSymbolAlphabet = self.inputSymbolAlphabet.export();
        exportData.tapeAlphabet = self.tapeAlphabet.export();
        exportData.transitionAlphabet = self.transitionAlphabet.export();
        return exportData;
    };

    /**
     * Imports transitions
     * @param importData
     */
    self.import = function(importData) {
        self.clear();
        _.forEach(importData.array, function(transitionGroup) {
            _.forEach(transitionGroup, function(transition) {
                self.create($scope.states.getById(transition.fromState.id), $scope.states.getById(transition.toState.id), transition.inputSymbol, transition.outputSymbol, transition.movingDirection);
            });
        });
        self.transitionsId = importData.transitionsId;
        self.inputSymbolAlphabet.import(importData.inputSymbolAlphabet);
        self.tapeAlphabet.import(importData.tapeAlphabet);
        self.transitionAlphabet.import(importData.transitionAlphabet);
    };

    /**
     * Clears the transitions
     */
    self.clear = function() {
        _.forEach(self, function() {
            self.pop();
        });
        self.transitionsId = 0;
        self.inputSymbolAlphabet.clear();
        self.tapeAlphabet.clear();
        self.transitionAlphabet.clear();
    };
};
autoSim.TransitionsTM.prototype = Array.prototype;
