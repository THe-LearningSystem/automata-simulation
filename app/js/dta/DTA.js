//Deterministic Turing Automaton
function DTA($scope, $translate) {
    "use strict";
    DFA.apply(this, arguments);
    
    $scope.defaultConfig.type = "DTA";
    $scope.defaultConfig.tapeAlphabet = [];
    $scope.defaultConfig.blankSymbol = "☐";
    $scope.defaultConfig.tapeAlphabet[0] = $scope.defaultConfig.blankSymbol;
    
    //Config Object
    $scope.config = _.cloneDeep($scope.defaultConfig);
    
    /**Overrides**/
    //the simulator controlling the svg-diagram
    $scope.simulator = new SimulationDTA($scope);
    //the statediagram controlling the svg-diagram
    $scope.statediagram = new StateDiagramDTA($scope, "#diagram-svg");
    //the statetransitionfunction controlling the statetransitionfunction-table
    $scope.statetransitionfunction = new StatetransitionfunctionDTA($scope);
    //the table where states and transitions are shown
    $scope.table = new TableDTA($scope);
    
    /**
     * Adds a char to the input alphabet if the char is not available
     * @param   {value} value the char, which is to be added
     */
    $scope.addToTapeAlphabet = function (value) {
        if (!_.some($scope.config.tapeAlphabet, function (a) {
                return a === value;
            })) {
            $scope.config.tapeAlphabet.push(value);
        } else {

        }
    };
    
    /*
     * Checks if a transition with the params already exists
     * @param {number}  fromState       id of the fromState
     * @param {number}  toState         The id from the toState
     * @param {string}  name            Symbol readed from tape
     * @param {string}  writeSymbol     Symbol to write on tape
     * @param {string}  moveDirection   direction where the Reading-/Writinghead moves
     * @param transitionId
     * @return {Boolean}
     */
    $scope.existsTransition = function (fromState, toState, name, writeSymbol, moveDirection, transitionId) {
        var tmp = false;
        _.forEach($scope.config.transitions, function (transition) {
            if (transition.fromState == fromState && transition.toState == toState && transition.name == name && transition.writeSymbol == writeSymbol && transition.moveDirection == moveDirection && transitionId !== transition.id) {
                tmp = true;
                return false;
            }
        });
        return tmp;
    };
    
    /**
     * Adds a transition at the end of the transitions array
     * @param {number} fromState        The id from the fromState
     * @param {number} toState          The id from the toState
     * @param {string} readSymbol       Symbol readed from tape
     * @param {string} writeSymbol      Symbol to write on tape
     * @param {string} moveDirection    direction where the Reading-/Writinghead moves
     */
    $scope.addTransition = function (fromState, toState, readSymbol, writeSymbol, moveDirection) {
        // can only create the transition if it is unique
        //there must be a fromState and toState, before adding a transtition
        if (!$scope.existsTransition(fromState, toState, readSymbol) && $scope.existsStateWithId(fromState) && $scope.existsStateWithId(toState)) {
            $scope.addToTapeAlphabet(readSymbol);
            $scope.addToTapeAlphabet(writeSymbol);

            return $scope.addTransitionWithId($scope.config.countTransitionId++,fromState, toState, readSymbol, writeSymbol, moveDirection);

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
     * @param {string} readSymbol     The symbol readed from the tape
     * @param {string} writeSymbol    Symbol to write on tape
     * @param {string} moveDirection  direction where the Reading-/Writinghead moves
     */
    $scope.addTransitionWithId = function (transitionId, fromState, toState, readSymbol, writeSymbol, moveDirection) {
        $scope.config.transitions.push(new TransitionDTA(transitionId, fromState, toState, readSymbol, writeSymbol, moveDirection));
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
     * @return {number} Returns the index and -1 when state with transitionId not found
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
     * @return {object} Returns the objectReference of the state
     */
    $scope.getTransitionById = function (transitionId) {
        return $scope.config.transitions[$scope.getArrayTransitionIdByTransitionId(transitionId)];
    };

    /**
     * Returns a transition
     * @param  {number}  fromState      Id of the fromState
     * @param  {number}  toState        id from the toState
     * @param  {string} readSymbol      The symbol readed from the tape
     * @param  {string} writeSymbol     Symbol to write on tape
     * @param  {string} moveDirection   direction where the Reading-/Writinghead moves
     * @return {Object}
     */
    $scope.getTransition = function (fromState, toState, readSymbol, writeSymbol, moveDirection) {
        for (var i = 0; i < $scope.config.transitions.length; i++) {
            var transition = $scope.config.transitions[i];
            if (transition.fromState == fromState && transition.toState == toState && transition.readSymbol == readSymbol && transition.writeSymbol == writeSymbol && transition.moveDirection == moveDirection) {
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
     * @param  {string} newReadSymbol
     * @param  {string} newWriteSymbol
     * @param  {string} newMoveDirection
     */
    $scope.modifyTransition = function (transitionId, newReadSymbol, newWriteSymbol, newMoveDirection) {
        var transition = $scope.getTransitionById(transitionId);
        if (!$scope.existsTransition(transition.fromState, transition.toState, newReadSymbol, newWriteSymbol, newMoveDirection, transitionId)) {
            //remove old transition from alphabet if this transition only used this char
            $scope.removeFromAlphabetIfNotUsedFromOthers(transitionId);
            //add new transitionName to the alphabet
            $scope.addToAlphabet(newReadSymbol);
            //save the new transitionName
            transition.name = newReadSymbol;
            transition.writeSymbol = newWriteSymbol;
            transition.moveDirection = newMoveDirection;
            //Rename the state on the statediagram
            $scope.statediagram.modifyTransition(transition, newReadSymbol, newWriteSymbol, newMoveDirection);
            $scope.updateListener();
            return true;
        } else {
            //TODO: BETTER DEBUG
            return false;
        }
    };
}