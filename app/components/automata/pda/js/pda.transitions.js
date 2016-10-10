/**
 * Constructor for the PDA transitions object
 * @param $scope
 * @constructor
 */
autoSim.TransitionsPDA = function ($scope) {
    var self = this;
    autoSim.Transitions.apply(this, arguments);
    self.stackAlphabet = new autoSim.TransitionStackAlphabet($scope);
    self.textLength = 40;
    self.selfTransitionTextLength = 24;


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
                    if (transition.fromState === fromState && transition.inputSymbol === inputSymbol &&
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

    /**
     * Creates a transition with the DefaultValues
     * @param fromState
     * @param toState
     * @returns {fromState}
     */
    self.createWithDefaults = function (fromState, toState) {
        return self.create(fromState, toState, self.getNextInputSymbol(fromState), "X", "Y");
    };

    /**
     * Creates a transition at the end of the transitions array
     * @param fromState
     * @param toState
     * @param inputSymbol
     * @return {object}
     */
    self.create = function (fromState, toState, inputSymbol, readFromStack, writeToStack) {
        if (!self.exists(fromState, toState, inputSymbol, readFromStack, writeToStack)) {
            self.inputSymbolAlphabet.addIfNotExists(inputSymbol);
            self.stackAlphabet.addIfNotExists(readFromStack);
            self.stackAlphabet.addIfNotExists(writeToStack);
            return self.createWithId(self.transitionsId++, fromState, toState, inputSymbol, readFromStack, writeToStack);
        } else {
            console.error("Cant create transition,exists", self.exists(fromState, toState, inputSymbol, readFromStack, writeToStack));
        }
    };
    /**
     * Creates a transition at the end of the transitions array -> for import
     * !!!don't use at other places!!!!! ONLY FOR IMPORT
     * @param transitionId
     * @param fromState
     * @param toState
     * @param inputSymbol
     * @return {object}
     */
    self.createWithId = function (transitionId, fromState, toState, inputSymbol, readFromStack, writeToStack) {
        var transitionGroup = self.getTransitionGroup(fromState, toState);
        var transition = undefined;
        if (transitionGroup === undefined) {
            transitionGroup = new autoSim.TransitionGroupPDA(fromState, toState);
            transition = transitionGroup.create(transitionId, inputSymbol, readFromStack, writeToStack);
            self.push(transitionGroup);
        } else {
            transition = transitionGroup.create(transitionId, inputSymbol, readFromStack, writeToStack);

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
     * Modify a transition if is unique with the new name
     * @param transition
     * @param newInputSymbol
     */
    self.modify = function (transition, newInputSymbol, newReadFromStack, newWriteToStack) {
        if (!self.exists(transition.fromState, transition.toState, newInputSymbol, newReadFromStack, newWriteToStack, transition.id)) {
            self.inputSymbolAlphabet.removeIfNotUsedFromOthers(transition);
            self.inputSymbolAlphabet.addIfNotExists(newInputSymbol);
            self.stackAlphabet.removeIfNotUsedFromOthers(transition);
            self.stackAlphabet.addIfNotExists(newReadFromStack);
            self.stackAlphabet.addIfNotExists(newWriteToStack);
            transition.inputSymbol = newInputSymbol;
            transition.readFromStack = newReadFromStack;
            transition.writeToStack = newWriteToStack;
            $scope.core.updateListener();
        }
    };


    /**
     * Export the transitionData
     * @returns {object}
     */
    self.export = function () {
        var exportData = {};
        exportData.array = [];
        _.forEach(self, function (transitionGroup) {
            exportData.array.push(_.cloneDeep(transitionGroup));
        });
        exportData.transitionsId = self.transitionsId;
        exportData.inputSymbolAlphabet = self.inputSymbolAlphabet.export();
        exportData.stackAlphabet = self.stackAlphabet.export();
        return exportData;
    };

    /**
     * Imports transitions
     * @param importData
     */
    self.import = function (importData) {
        self.clear();
        _.forEach(importData.array, function (transitionGroup) {
            _.forEach(transitionGroup, function (transition) {
                self.create($scope.states.getById(transition.fromState.id), $scope.states.getById(transition.toState.id), transition.inputSymbol, transition.readFromStack, transition.writeToStack);
            });
        });
        self.transitionsId = importData.transitionsId;
        self.inputSymbolAlphabet.import(importData.inputSymbolAlphabet);
        self.stackAlphabet.import(importData.stackAlphabet);

    };

    /**
     * Clears the transitions
     */
    self.clear = function () {
        _.forEach(self, function () {
            self.pop();
        });
        self.transitionsId = 0;
        self.inputSymbolAlphabet.clear();
        self.stackAlphabet.clear();
    };
};
autoSim.TransitionsPDA.prototype = Array.prototype;
