//Deterministic Turing Automaton
function DTA($scope, $translate) {
    "use strict";
    DFA.apply(this, arguments);
    
    $scope.defaultConfig.type = "DTA";
    $scope.defaultConfig.tapeAlphabet = [];
    $scope.defaultConfig.blankSymbol = "☐";
    
    //Config Object
    $scope.config = _.cloneDeep($scope.defaultConfig);
    
    /**Overrides**/
    //the simulator controlling the svg-diagram
    $scope.simulator = new SimulationDTA($scope);
    //the statediagram controlling the svg-diagram
    $scope.statediagram = new StateDiagramDTA($scope, "#diagram-svg");
    //the table where states and transitions are shown
    $scope.table = new TableDTA($scope);
    
    /*
     * Checks if a transition with the params already exists
     * @param {number}  fromState       id of the fromState
     * @param {string} readSymbol       Symbol readed from tape
     * @param {number} toState          The id from the toState
     * @param {string} writeSymbol      Symbol to write on tape
     * @param {string} directionToMove  direction where the Reading-/     *                                  Writinghead moves
     * @param transitionId
     * @return {Boolean}
     */
    $scope.existsTransition = function (fromState, readSymbol, toState, writeSymbol, directionToMove, transitionId) {
        var tmp = false;
        _.forEach($scope.config.transitions, function (transition) {
            if (transition.fromState == fromState && transition.readSymbol == readSymbol && transition.toState == toState && transition.writeSymbol == writeSymbol && transition.dircetionToMove == directionToMove && transitionId !== transition.id) {
                tmp = true;
                return false;
            }
        });
        return tmp;
    };
    
    /**
     * Adds a transition at the end of the transitions array
     * @param {number} fromState        The id from the fromState
     * @param {string} readSymbol       Symbol readed from tape
     * @param {number} toState          The id from the toState
     * @param {string} writeSymbol      Symbol to write on tape
     * @param {string} directionToMove  direction where the Reading-/     *                                  Writinghead moves
     */
    $scope.addTransition = function (fromState, readSymbol, toState, writeSymbol, directionToMove) {
        // can only create the transition if it is unique
        //there must be a fromState and toState, before adding a transtition
        if (!$scope.existsTransition(fromState, readSymbol, toState) && $scope.existsStateWithId(fromState) && $scope.existsStateWithId(toState)) {
            $scope.addToAlphabet(readSymbol);
            $scope.addToAlphabet(writeSymbol);

            return $scope.addTransitionWithId($scope.config.countTransitionId++,fromState, readSymbol, toState, writeSymbol, directionToMove);

        } else {
            //TODO: BETTER DEBUG
        } 
    };
}