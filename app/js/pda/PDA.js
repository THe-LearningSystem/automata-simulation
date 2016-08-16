//PDA
function PDA($scope, $translate) {
    "use strict";
    DFA.apply(this, arguments);

    $scope.defaultConfig.stackAlphabet = [];

    //Config Object
    $scope.config = cloneObject($scope.defaultConfig);

    /**Overrides**/
    //the statediagram controlling the svg diagram
    $scope.simulator = new SimulationPDA($scope);
    //the statediagram controlling the svg diagram
    $scope.statediagram = new StateDiagramPDA($scope, "#diagram-svg");
    //the statetransitionfunction controlling the statetransitionfunction-table
    $scope.statetransitionfunction = new StatetransitionfunctionPDA($scope);
    //TRANSITION OVERRIDES
    /**
     * Adds a char to the input alphabet if the char is not available
     * @param   {object} value the char, which is to be added
     */
    $scope.addToStackAlphabet = function (value) {
        for (var i = 0; i < value.length; i++) {
            if (!_.some($scope.config.stackAlphabet, function (a) {
                    return a === value[i];
                }) && value !== "\u03b5") {
                $scope.config.stackAlphabet.push(value[i]);
            }
        }
    };

    $scope.removeFromStackAlphabetIfNotUsedFromOthers = function (transitionId) {
        var tmpTransition = $scope.getTransitionById(transitionId);
        //search if an other transition use the same readFromStack
        var i;
        var notFound = true;
        for (i = 0; i < $scope.config.transitions.length; i++) {
            if (tmpTransition.readFromStack === $scope.config.transitions[i].readFromStack && $scope.config.transitions[i].id !== transitionId) {
                notFound = false;
                break;
            }
        }
        if (notFound) {
            _.pull($scope.config.stackAlphabet, tmpTransition.readFromStack);
        }
        //search if an other transition use the same writeToStack
        if (tmpTransition.writeToStack.length > 1) {
            notFound = true;
            for (i = 0; i < $scope.config.transitions.length; i++) {
                if ($scope.config.transitions[i].writeToStack.indexOf(tmpTransition.writeToStack[0]) && $scope.config.transitions[i].id !== transitionId) {
                    notFound = false;
                    break;
                }
            }
            if (notFound)
                _.pull($scope.config.stackAlphabet, tmpTransition.writeToStack[0]);
            //second char
            notFound = true;
            for (i = 0; i < $scope.config.transitions.length; i++) {
                if ($scope.config.transitions[i].writeToStack.indexOf(tmpTransition.writeToStack[1]) && $scope.config.transitions[i].id !== transitionId) {
                    notFound = false;
                    break;
                }
            }
            if (notFound)
                _.pull($scope.config.stackAlphabet, tmpTransition.writeToStack[1]);
        } else {
            notFound = true;
            for (i = 0; i < $scope.config.transitions.length; i++) {
                if ($scope.config.transitions[i].writeToStack.indexOf(tmpTransition.writeToStack) && $scope.config.transitions[i].id !== transitionId) {
                    notFound = false;
                    break;
                }
            }
            if (notFound)
                _.pull($scope.config.stackAlphabet, tmpTransition.writeToStack);
        }
    };


    /**
     * Checks if a transition with the params already exists
     * @param  {number}  fromState      Id of the fromState
     * @param  {number}  toState        id from the toState
     * @param name
     * @param readFromStack
     * @param writeToStack
     * @param transitionId
     * @return {Boolean}
     */
    $scope.existsTransition = function (fromState, toState, name, readFromStack, writeToStack, transitionId) {
        var tmp = false;
        _.forEach($scope.config.transitions, function (transition) {
            if (transition.fromState == fromState && transition.toState == toState && transition.name == name && transition.readFromStack == readFromStack && transition.writeToStack == writeToStack && transitionId !== transition.id) {
                tmp = true;
                return false;
            }
        });
        return tmp;
    };

    $scope.getNextTransitionName = function (fromState) {
        var namesArray = [];
        for (var i = 0; i < $scope.config.transitions.length; i++) {
            if ($scope.config.transitions[i].fromState == fromState) {
                namesArray.push($scope.config.transitions[i].name);
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
     * Adds a transition at the end of the transitions array
     * @param {number} fromState      The id from the fromState
     * @param {number} toState        The id from the toState
     * @param char
     * @param readFromStack
     * @param writeToStack
     */
    $scope.addTransition = function (fromState, toState, char, readFromStack, writeToStack) {
        //can only create the transition if it is unique-> not for the ndfa
        //there must be a fromState and toState, before adding a transition
        if (!$scope.existsTransition(fromState, toState, char) && $scope.existsStateWithId(fromState) && $scope.existsStateWithId(toState)) {
            $scope.addToAlphabet(char);
            //Add to the stackAlphabet
            $scope.addToStackAlphabet(readFromStack);
            $scope.addToStackAlphabet(writeToStack);

            return $scope.addTransitionWithId($scope.config.countTransitionId++, fromState, toState, char, readFromStack, writeToStack);

        } else {
            //TODO: BETTER DEBUG
        }
    };

    /**
     * Adds a transition at the end of the transitions array -> for import
     * !!!don't use at other places!!!!! ONLY FOR IMPORT
     * @param transitionId
     * @param {number} fromState      The id from the fromState
     * @param {number} toState        The id from the toState
     * @param char
     * @param readFromStack
     * @param writeToStack
     */
    $scope.addTransitionWithId = function (transitionId, fromState, toState, char, readFromStack, writeToStack) {
        $scope.config.transitions.push(new TransitionPDA(transitionId, fromState, toState, char, readFromStack, writeToStack));
        //drawTransition
        $scope.statediagram.drawTransition(transitionId);
        $scope.updateListener();
        //fix changes wont update after addTransition from the statediagram
        $scope.safeApply();
        return $scope.getTransitionById(transitionId);
    };

    /**
     * Get the array index from the transition with the given transitionId
     * @param  {number} transitionId
     * @return {number}         Returns the index and -1 when state with transitionId not found
     */
    $scope.getArrayTransitionIdByTransitionId = function (transitionId) {
        return _.findIndex($scope.config.transitions, function (transition) {
            if (transition.id == transitionId) {
                return transition;
            }
        });
    };

    /**
     * Returns the transition of the given transitionId
     * @param  {number} transitionId
     * @return {object}        Returns the objectReference of the state
     */
    $scope.getTransitionById = function (transitionId) {
        return $scope.config.transitions[$scope.getArrayTransitionIdByTransitionId(transitionId)];
    };

    /**
     * Returns a transition
     * @param  {number}  fromState      Id of the fromState
     * @param  {number}  toState        id from the toState
     * @param char
     * @param readFromStack
     * @param writeToStack
     * @return {Object}
     */
    $scope.getTransition = function (fromState, toState, char, readFromStack, writeToStack) {
        for (var i = 0; i < $scope.config.transitions.length; i++) {
            var transition = $scope.config.transitions[i];
            if (transition.fromState == fromState && transition.toState == toState && transition.name == char && transition.readFromStack == readFromStack && transition.writeToStack == writeToStack) {
                return transition;
            }
        }
        return undefined;
    };

    /**
     * Removes the transition
     * @param {number} transitionId      The id from the transition
     */
    $scope.removeTransition = function (transitionId) {
        //remove old transition from alphabet if this transition only used this char
        $scope.removeFromAlphabetIfNotUsedFromOthers(transitionId);
        //first remove the element from the svg after that remove it from the array
        $scope.statediagram.removeTransition(transitionId);
        $scope.config.transitions.splice($scope.getArrayTransitionIdByTransitionId(transitionId), 1);
        //update other listeners when remove is finished
        $scope.updateListener();
    };

    /**
     * Modify a transition if is unique with the new name
     * @param  {number} transitionId
     * @param newChar
     * @param newReadFromStack
     * @param newWriteToStack
     */
    $scope.modifyTransition = function (transitionId, newChar, newReadFromStack, newWriteToStack) {
        var transition = $scope.getTransitionById(transitionId);
        if (!$scope.existsTransition(transition.fromState, transition.toState, newChar, newReadFromStack, newWriteToStack, transitionId)) {
            //remove old transition from alphabet if this transition only used this char
            $scope.removeFromAlphabetIfNotUsedFromOthers(transitionId);
            //add new transitionName to the alphabet
            $scope.addToAlphabet(newChar);
            //remove old transition from stackAlphabet if this transition only used this char
            $scope.removeFromStackAlphabetIfNotUsedFromOthers(transitionId);
            //add to stackAlphabet
            $scope.addToStackAlphabet(newReadFromStack);
            $scope.addToStackAlphabet(newWriteToStack);
            //save the new transitionName
            transition.name = newChar;
            transition.readFromStack = newReadFromStack;
            transition.writeToStack = newWriteToStack;
            //Rename the state on the statediagram
            $scope.statediagram.modifyTransition(transition, newChar, newReadFromStack, newWriteToStack);
            $scope.updateListener();
            return true;
        } else {
            //TODO: BETTER DEBUG
            return false;
        }
    };
}