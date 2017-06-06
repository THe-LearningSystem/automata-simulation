/**
 * Constructor for the transitionGroup
 * @param fromState
 * @param toState
 * @constructor
 */
autoSim.TransitionGroupTM = function(fromState, toState) {
    var self = this;
    autoSim.TransitionGroup.apply(this, arguments);

    /**
     * Creates a new Transition for override
     * @param id
     * @param inputSymbol
     */
    self.create = function(id, inputSymbol, outputSymbol, movingDirection) {
        return self[self.push(new autoSim.TransitionObjectTM(id, self.fromState, self.toState, inputSymbol, outputSymbol, movingDirection)) - 1];
    };
};
autoSim.TransitionGroupTM.prototype = Array.prototype;

/**
 * The transition object
 * @param id
 * @param fromState
 * @param toState
 * @param inputSymbol
 * @param outputSymbol
 * @param movingDirection
 * @constructor
 */
autoSim.TransitionObjectTM = function(id, fromState, toState, inputSymbol, outputSymbol, movingDirection) {
    var self = this;
    self.id = id;
    self.fromState = fromState;
    self.toState = toState;
    self.inputSymbol = inputSymbol;
    self.outputSymbol = outputSymbol;
    self.movingDirection = movingDirection;
};

/**
 * Constructor for a transitionInputAlphabet
 * @param $scope
 * @constructor
 */
autoSim.TransitionAlphabet = function($scope) {
    var self = this;

    /**
     * Adds the newInputSymbol to the input alphabet if the char does not already exist
     * @param newInputSymbol
     */
    self.addIfNotExists = function(newInputSymbol) {
        if (!_.some(self, function(savedInputSymbol) {
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
    self.removeIfNotUsedFromOthers = function(transition) {
        for (var i = 0; i < $scope.transitions.length; i++) {
            var notFound = true;
            var notFound2 = true;
            _.forEach($scope.transitions, function(transitionGroup) {
                _.forEach(transitionGroup, function(tmpTransition) {
                    if (tmpTransition.inputSymbol === transition.inputSymbol && tmpTransition.id !== transition.id) {
                        notFound = false;
                    }
                });
            });
            if (notFound) {
                _.pull(self, transition.inputSymbol);
                return true;
            }
        }
    };

    /**
     * exports the transitionInputAlphabet
     * @returns {object}
     */
    self.export = function() {
        var exportData = {};
        exportData.array = [];
        _.forEach(self, function(inputSymbol) {
            exportData.array.push(inputSymbol);
        });
        return exportData;
    };

    /**
     * Imports the data
     * @param importData
     */
    self.import = function(importData) {
        self.clear();
        _.forEach(importData.array, function(inputSymbol) {
            self.addIfNotExists(inputSymbol);
        });
    };

    /**
     * Clears the InputAlphabet
     */
    self.clear = function() {
        _.forEach(self, function() {
            self.pop();
        });
    };
};
autoSim.TransitionAlphabet.prototype = Array.prototype;

/**
 * Constructor for a transitionInputAlphabet
 * @param $scope
 * @constructor
 */
autoSim.TransitionInputAlphabet = function($scope) {
    var self = this;
    $scope.core.updateListeners.push(self);

    /**
     * Adds the newInputSymbol to the input alphabet if the char does not already exist
     * @param newInputWord
     */
    self.addIfNotExists = function(newInputWord) {
        for (var i = 0; i < newInputWord.length; i++) {
            if (!_.some(self, function(savedInputSymbol) {
                    return savedInputSymbol === newInputWord[i];
                })) {
                self.push(newInputWord[i]);
                return true;
            }
        }
    };

    /**
     * Removes a character from the inputSymbolAlphabet if the character is not used in the inputWord
     * @param  inputWord
     */
    self.removeIfNotUsed = function(inputWord) {
        for (var i = 0; i < $scope.transitions.inputSymbolAlphabet.length; i++) {
            tmpObj = false;
            for (var j = 0; j < inputWord.length; j++) {
                if (inputWord[j] === $scope.transitions.inputSymbolAlphabet[i]) {
                    tmpObj = true;
                }
            }
            if (tmpObj == false) {
                _.pull(self, $scope.transitions.inputSymbolAlphabet[i]);
            }
        }
    };

    /**
     * exports the transitionInputAlphabet
     * @returns {object}
     */
    self.export = function() {
        var exportData = {};
        exportData.array = [];
        _.forEach(self, function(inputWordSymbol) {
            exportData.array.push(inputWordSymbol);
        });
        return exportData;
    };

    /**
     * Imports the data of the inputSymbolAlphabet
     * @param importData
     */
    self.import = function(importData) {
        self.clear();
        _.forEach(importData.array, function(inputWordSymbol) {
            self.addIfNotExists(inputWordSymbol);
        });
    };

    /**
     * Clears the InputAlphabet
     */
    self.clear = function() {
        _.forEach(self, function() {
            self.pop();
        });
    };

    self.updateFunction = function() {
        //prepare alphabet
        self.addIfNotExists($scope.automatonData.inputWord);
        self.removeIfNotUsed($scope.automatonData.inputWord);
    };

    /**
     * Watcher schießt zweimal. Warum?
     * TODO: Fixen!
     */
    $scope.$watch('automatonData.inputWord', function(newValue, oldValue) {
        if (newValue !== oldValue) {
            self.updateFunction();
        }
    });
};

autoSim.TransitionInputAlphabet.prototype = Array.prototype;

/**
 * Constructor for a transitionInputAlphabet
 * @param $scope
 * @constructor
 */
autoSim.TransitionTapeAlphabet = function($scope) {
    var self = this;
    self.blankSymbol = "☐";
    self.push(self.blankSymbol);
    // self.push("w");
    // self.push("x");
    // console.log(self);
    /**
     * Adds the newTapeSymbol to the tapeAlphabet if the char does not already exist
     * @param newTapeSymbol
     */
    self.addIfNotExists = function(newTapeSymbol) {
        //console.log(newTapeSymbol);
        if (newTapeSymbol !== 'undefined' && newTapeSymbol !== null) {
            for (var i = 0; i < newTapeSymbol.length; i++) {
                if (!_.some(self, function(savedTapeSymbol) {
                        //          console.log(savedTapeSymbol === newTapeSymbol[i]);
                        return savedTapeSymbol === newTapeSymbol[i];
                    })) {
                    //      console.log("Push");
                    self.push(newTapeSymbol[i]);
                }
            }
        }
    };

    /**
     * Removes a char from the alphabet if this char is only used from the given transition
     * @param  transition
     * @returns {boolean} true if it was removed false if not removed
     */
    self.removeIfNotUsedFromOthers = function(transition) {
        //search if an other transition use the same readFromStack
        var i;
        var notFound = true;
        var j;
        var notFound2 = true;
        _.forEach($scope.transitions, function(transitionGroup) {
            _.forEach(transitionGroup, function(tmpTransition) {
                if (tmpTransition.outputSymbol === transition.outputSymbol && tmpTransition.id !== transition.id) {
                    notFound2 = false;
                    return false;
                }
                if (!notFound2) {
                    return false;
                }
            });
        });
        _.forEach($scope.transitions, function(transitionGroup) {
            _.forEach(transitionGroup, function(tmpTransition) {
                if (tmpTransition.inputSymbol === transition.inputSymbol && tmpTransition.id !== transition.id) {
                    notFound = false;
                    return false;
                }
                if (!notFound)
                    return false;
            });
        });
        if (notFound) {
            _.pull(self, transition.inputSymbol);
        }
        if (notFound2) {
            _.pull(self, transition.outputSymbol);
        }
    };

    /**
     * Removes a char from the alphabet if this char is only used from the given transition
     * @param  transition
     * @returns {boolean} true if it was removed
     * @returns {boolean} false if not removed
     */
    self.removeIfNotUsed = function(char) {
        for (var i = 1; i < self.length; i++) {
            found = false;
            found2 = false;
            found3 = false;
            //Search in transitionAlphabet for char
            for (var j = 0; j < $scope.transitions.transitionAlphabet.length; j++) {
                if ($scope.transitions.transitionAlphabet[j] === self[i]) {
                    found = true;
                }
            }
            //Search in inputWord for char
            for (var k = 0; k < $scope.automatonData.inputWord.length; k++) {
                if (self[i] === $scope.automatonData.inputWord[k]) {
                    found2 = true;
                }
            }
            //Search in transitions and outputSymbols for inputCharacter
            _.forEach($scope.transitions, function(transitionGroup) {
                _.forEach(transitionGroup, function(tmpTransition) {
                    if (tmpTransition.outputSymbol === self[i]) {
                        found3 = true;
                    }
                });
            });
            if (found == false && found2 == false && found3 == false) {
                _.pull(self, self[i]);
            }
        }
    };

    /**
     * exports the transitionInputAlphabet
     * @returns {object}
     */
    self.export = function() {
        var exportData = {};
        exportData.array = [];
        _.forEach(self, function(tapeSymbol) {
            exportData.array.push(tapeSymbol);
        });
        return exportData;
    };

    /**
     * Imports the data
     * @param importData
     */
    self.import = function(importData) {
        self.clear();
        _.forEach(importData.array, function(tapeSymbol) {
            self.addIfNotExists(tapeSymbol);
        });
    };

    /**
     * Clears the InputAlphabet
     */
    self.clear = function() {
        _.forEach(self, function() {
            self.pop();
        });
    };

    self.updateFunction = function() {
        //prepare alphabet
        self.addIfNotExists($scope.automatonData.inputWord);
        self.removeIfNotUsed($scope.automatonData.inputWord);
    };

    /**
     * Watcher schießt zweimal. Warum?
     * TODO: Fixen!
     */
    $scope.$watch('automatonData.inputWord', function(newValue, oldValue) {
        if (newValue !== oldValue) {
            self.updateFunction();
        }
    });
};
autoSim.TransitionTapeAlphabet.prototype = Array.prototype;


autoSim.TMTape = function($scope) {
    var self = this;
    self.blankSymbol = "☐";
    self.tapeSize = 25;
    self.numOfChar = 0;
    var tapeArray = new Array();
    self.tapeArray = tapeArray;
    self.pointer = (Math.round(self.tapeArray.length / 2) - 1);
    self.pointerStartRight = false;


    self.setPointer = function() {
        var x = $scope.automatonData.inputWord.length;
        var y = $scope.automatonData.inputWord.length;

        if (x % 2 === 0 && x !== 0) {
            x = x - 1;
        }

        if (y !== 0) {
            y = y - 1;
        }

        if (self.pointerStartRight === false) {
            self.pointer = (Math.round(self.tapeArray.length / 2) - Math.floor(x / 2) - 1);
        } else {
            self.pointer = (Math.round(self.tapeArray.length / 2) - Math.floor(x / 2) - 1) + y;
        }
    };

    self.fillTape = function(inputWord) {
        var j = 0;
        self.numOfChar = 0;
        for (var i = (Math.round((self.tapeArray.length - inputWord.length) / 2)); i < (Math.round((self.tapeArray.length - inputWord.length) / 2) + inputWord.length); i++) {
            self.tapeArray[i] = inputWord[j];
            self.numOfChar++;
            j++;
        }
        self.setPointer();
    };

    self.refillTape = function() {
        var n = 0;
        while (n < self.tapeSize) {
            self.tapeArray[n] = "☐";
            n++;
        }
    };

    self.tapeSetup = function(inputWord) {
        self.refillTape();
        self.fillTape(inputWord);
    }

    self.writeOnTape = function(outputSymbol) {
        self.tapeArray[self.pointer] = outputSymbol;
    };

    self.pointerGoLeft = function() {
        self.pointer--;
    };

    self.pointerGoRight = function() {
        self.pointer++;
    };

    self.pointerStay = function() {
        self.pointer = self.pointer;
    };

    self.updateFunction = function() {
        self.refillTape();
        self.fillTape($scope.automatonData.inputWord);
    };

    self.isEmpty = function() {
        for (var i = 0; i < tapeArray.length; i++) {
            if (tapeArray[i] !== "☐") {
                return false;
            }
        }
        if ($scope.automatonData.inputWord === "") {
            return true;
        }
    }

    self.emptyTape = function() {
        var emptyTape = [self.tapeSize];
        for (var i = 0; i < self.tapeSize; i++) {
            emptyTape[i] = "☐";
            i++;
        }
        return emptyTape;
    }

    /**
     * Watcher schießt zweimal. Warum?
     * TODO: Fixen!
     */
    $scope.$watch('automatonData.inputWord', function(newValue, oldValue) {
        if (newValue !== oldValue) {
            self.updateFunction();
        }
    });

    $scope.$watch('simulator.tape.pointerStartRight', function(newValue, oldValue) {
        if (newValue !== oldValue) {
            self.setPointer();
            $scope.simulator.virtualTape.pointerStartRight = $scope.simulator.tape.pointerStartRight;
            $scope.simulator.virtualTape.setPointer();
        }
    });

    // self.push = function (char) {
    //     if (char === "\u03b5") {
    //     } else {
    //         for (var i = 0; i < char.length; i++) {
    //             self.stackContainer.push(char[i]);
    //         }
    //     }
    //
    // };
    // self.pop = function () {
    //     return self.stackContainer.pop();
    // };
    //
    // self.tryToPop = function (char) {
    //     if (char === "\u03b5") {
    //     } else {
    //         for (var i = 0; i < char.length; i++) {
    //             self.stackContainer.pop();
    //         }
    //     }
    // };
};
