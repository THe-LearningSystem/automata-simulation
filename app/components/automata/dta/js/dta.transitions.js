/**
 * Constructor for the DTA transitions object
 * @param $scope
 * @constructor
 */
autoSim.TransitionsDTA = function ($scope) {
    var self = this;
    autoSim.Transitions.apply(this, arguments);
    self.tapeAlphabet = new autoSim.TransitionTapeAlphabet($scope);
    self.stackAlphabet = new autoSim.TransitionStackAlphabet($scope);
    self.textLength = 40;
    self.selfTransitionTextLength = 24;


    /**
     * Checks if a transition with the params already exists, excepts the given transition
     * @param fromState
     * @param toState
     * @param readSymbol
     * @param writeSymbol
     * @param movingDirection
     * @param transitionId
     * @returns {boolean}
     */
    self.exists = function (fromState, toState, readSymbol, writeSymbol, movingDirection, transitionId) {
        var tmp = false;
        _.forEach(self, function (transitionGroup) {
            if (fromState === transitionGroup.fromState) {
                _.forEach(transitionGroup, function (transition) {
                    if (transition.fromState === fromState && transition.readSymbol === readSymbol &&
                        transition.writeSymbol === writeSymbol && transition.movingDirection === movingDirection
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
        return self.create(fromState, toState, self.getNextInputSymbol(fromState), "b", "→");
    };

    /**
     * Creates a transition at the end of the transitions array
     * @param fromState
     * @param toState
     * @param readSymbol
     * @param writeSymbol
     * @param movingDirection
     * @return {object}
     */
    self.create = function (fromState, toState, readSymbol, writeSymbol, movingDirection) {
        if (!self.exists(fromState, toState, readSymbol, writeSymbol, movingDirection)) {
            self.inputSymbolAlphabet.addIfNotExists(readSymbol);
            self.tapeAlphabet.addIfNotExists(readSymbol);
            self.tapeAlphabet.addIfNotExists(writeSymbol);
            return self.createWithId(self.transitionsId++, fromState, toState, readSymbol, writeSymbol, movingDirection);
        } else {
            console.error("Can't create transition. It already exists.", self.exists(fromState, toState, readSymbol, writeSymbol, movingDirection));
        }
    };

    /**
     * Creates a transition at the end of the transitions array -> for import
     * !!!don't use at other places!!!!! ONLY FOR IMPORT
     * @param transitionId
     * @param fromState
     * @param toState
     * @param readSymbol
     * @param writeSymbol
     * @param movingDirection
     * @return {object}
     */
    self.createWithId = function (transitionId, fromState, toState, readSymbol, writeSymbol, movingDirection) {
        var transitionGroup = self.getTransitionGroup(fromState, toState);
        var transition = undefined;
        if (transitionGroup === undefined) {
            transitionGroup = new autoSim.TransitionGroupDTA(fromState, toState);
            transition = transitionGroup.create(transitionId, readSymbol, writeSymbol, movingDirection);
            self.push(transitionGroup);
        } else {
            transition = transitionGroup.create(transitionId, readSymbol, writeSymbol, movingDirection);

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
     * @param newReadSymbol
     * @param newWriteSymbol
     * @param newMovingDirection
     */
    self.modify = function (transition, newReadSymbol, newWriteSymbol, newMovingDirection) {
        if (!self.exists(transition.fromState, transition.toState, newReadSymbol, newWriteSymbol, newMovingDirection, transition.id)) {
            self.inputSymbolAlphabet.removeIfNotUsedFromOthers(transition);
            self.inputSymbolAlphabet.addIfNotExists(newReadSymbol);
            self.tapeAlphabet.addIfNotExists(newReadSymbol);
            self.tapeAlphabet.addIfNotExists(newWriteSymbol);
            transition.readSymbol = newReadSymbol;
            transition.writeSymbol = newReadFromStack;
            transition.movingDirection = newMovingDirection;
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
        exportData.tapeAlphabet = self.tapeAlphabet.export();
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
                self.create($scope.states.getById(transition.fromState.id), $scope.states.getById(transition.toState.id), transition.readSymbol, transition.writeSymbol, transition.movingDirection);
            });
        });
        self.transitionsId = importData.transitionsId;
        self.inputSymbolAlphabet.import(importData.inputSymbolAlphabet);
        self.tapeAlphabet.import(importData.tapeAlphabet);
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
        self.tapeAlphabet.clear();
    };
};
autoSim.TransitionsPDA.prototype = Array.prototype;
