//Simulator for the simulation of the automata
function DFA($scope) {
    "use strict";
    //selfReference
    //for debug puposes better way for acessing in console?
    window.debugScope = $scope;
    //define scope

    //Default Config for the automaton
    $scope.defaultConfig = {};
    //the default prefix for autonaming for example S0,S1,... after the prefix it saves the id
    $scope.defaultConfig.statePrefix = 'S';
    //Suffix after a transition name on the graphdesigner
    $scope.defaultConfig.transitionNameSuffix = '|';
    $scope.defaultConfig.diagramm = {
        x: 0,
        y: 0,
        scale: 1,
        updatedWithZoomBehavior:false
    };
    //Number of statesIds given to states
    $scope.defaultConfig.countStateId = 0;
    //Number of transitionIds given to transitions
    $scope.defaultConfig.countTransitionId = 0;
    //The States are saved like {id:stateId,name:"nameoftheState",x:50,y:50}
    $scope.defaultConfig.states = [];
    //Only a number representing the id of the state
    $scope.defaultConfig.startState = null;
    //An array of numbers representing the ids of the finalStates
    $scope.defaultConfig.finalStates = [];
    //the transitions are saved like{fromState:stateId, toState:stateId, name:"transitionName"}
    $scope.defaultConfig.transitions = [];



    //Config Object
    $scope.config = cloneObject($scope.defaultConfig);
    $scope.config.name = "NewName";

    //AUTOMATA CONFIG END

    //the name of the inputWord
    $scope.inputWord = '';

    //alerts
    $scope.alertDanger = 'NO ALERT';

    //Create a dbug objects for better dbugs(info, alert, danger)
    $scope.dbug = new Dbug($scope);
    //the simulator controlling the simulation
    $scope.simulator = new SimulationDFA($scope);
    //the graphdesigner controlling the svg diagramm
    $scope.graphdesigner = new GraphdesignerDFA($scope, "#diagramm-svg");
    //the statetransitionfunction controlling the statetransitionfunction-table
    $scope.statetransitionfunction = new StatetransitionfunctionDFA($scope);

    //for the testdata
    $scope.testData = new TestData($scope);

    //from https://coderwall.com/p/ngisma/safe-apply-in-angular-js
    //fix for $apply already in progress
    $scope.safeApply = function (fn) {
        var phase = this.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            if (fn && (typeof (fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

    /**
     * Removes the current automata and the inputWord
     */
    $scope.removeConfig = function () {
        //get the new config
        $scope.config = cloneObject($scope.defaultConfig);
        //clear the svgContent
        $scope.graphdesigner.clearSvgContent();

    };




    //STATE FUNCTIONS START

    /**
     * Checks if a state exist with the given name
     * @param  {String} stateName 
     * @return {Boolean}           
     */
    $scope.existStateWithName = function (stateName) {
        var tmp = false;
        _.forEach($scope.config.states, function (state) {
            if (state.name == stateName)
                return true;
        });
        return tmp;
    };

    /**
     * Checks if a state exist with the given id
     * @param  {Id} stateId 
     * @return {Boolean}           
     */
    $scope.existStateWithId = function (stateId) {
        for (var i = 0; i < $scope.config.states.length; i++) {
            if ($scope.config.states[i].id == stateId)
                return true;
        }
        return false;
    };

    /**
     * returns if the node has transitions
     * @param  {number}  stateId 
     * @return {Boolean}         
     */
    $scope.hasStateTransitions = function (stateId) {
        var tmp = false;
        _.forEach($scope.config.transitions, function (transition) {
            if (transition.fromState == stateId || transition.toState == stateId) {
                tmp = true;
            }
        });
        return tmp;
    };

    /**
     * Get the array index from the state with the given stateId
     * @param  {number} stateId 
     * @return {number}         Returns the index and -1 when state with stateId not found
     */
    $scope.getArrayStateIdByStateId = function (stateId) {
        return _.findIndex($scope.config.states, function (state) {
            if (state.id == stateId) {
                return state;
            }
        });
    };

    /**
     * Returns the State with the given stateId
     * @param  {number} stateId 
     * @return {object}        Returns the objectreference of the state undefined if not found
     */
    $scope.getStateById = function (stateId) {

        return $scope.config.states[$scope.getArrayStateIdByStateId(stateId)];
    };

    /**
     * Returns the State with the given stateName
     * @param  {number} stateId 
     * @return {object}        Returns the objectreference of the state undefined if not found
     */
    $scope.getStateByName = function (stateName) {

        return $scope.config.states[$scope.getArrayStateIdByStateId(function (stateName) {

        })];
    };
    /**
     * Add a state with default name
     * @param {number} x 
     * @param {number} y 
     * @returns {object} the created object
     */
    $scope.addStateWithPresets = function (x, y) {
        var obj = $scope.addState($scope.config.statePrefix + $scope.config.countStateId, x, y);
        //if u created a state then make the first state as startState ( default)
        if ($scope.config.countStateId == 1) {
            $scope.changeStartState(0);
        }
        return obj;
    };

    /**
     * Adds a state at the end of the states array
     * @param {String} stateName 
     * @param {number} x         
     * @param {number} y         
     * @returns {object} the created object
     */
    $scope.addState = function (stateName, x, y) {
        if (!$scope.existStateWithName(stateName)) {
            return $scope.addStateWithId($scope.config.countStateId++, stateName, x, y);
        } else {
            //TODO: BETTER DEBUG  
            return null;
        }
    };

    /**
     * Adds a state at the end of the states array with a variable id -> used for import
     * !!!dont use at other places!!!!! ONLY FOR IMPORT
     * @param {String} stateName 
     * @param {number} x         
     * @param {number} y   
     * @returns {object} the created object
     */
    $scope.addStateWithId = function (stateId, stateName, x, y) {
        var addedStateId = $scope.config.states.push({
            id: stateId,
            name: stateName,
            x: x,
            y: y
        });
        //draw the State after the State is added
        $scope.graphdesigner.drawState($scope.getArrayStateIdByStateId(stateId));
        //fix changes wont update after addTransisiton from the graphdesigner
        $scope.safeApply();
        return $scope.getStateById(addedStateId - 1);
    };

    /**
     * Removes the state with the given id
     * @param  {number} stateId 
     */
    $scope.removeState = function (stateId) {
        if ($scope.hasStateTransitions(stateId)) {
            //TODO: BETTER DEBUG
        } else {
            //if the state is a final state move this state from the final states
            if ($scope.isStateAFinalState(stateId)) {
                $scope.removeFinalState(stateId);
            }
            //if state is a start State remove the state from the startState
            if ($scope.config.startState == stateId) {
                $scope.config.startState = null;
            }
            //first remove the element from the svg after that remove it from the array
            $scope.graphdesigner.removeState(stateId);
            $scope.config.countStateId--;
            $scope.config.states.splice($scope.getArrayStateIdByStateId(stateId), 1);
        }
    };

    /**
     * Rename a state if the newStatename isnt already used
     * @param  {number} stateId      
     * @param  {State} newStateName 
     */
    $scope.renameState = function (stateId, newStateName) {
        if ($scope.existStateWithName(newStateName)) {
            //TODO: BETTER DEBUG
        } else {
            $scope.getStateById(stateId).name = newStateName;
            //Rename the state on the graphdesigner
            $scope.graphdesigner.renameState(stateId, newStateName);
        }
    };

    /**
     * Changes the start state to the given state id
     */
    $scope.changeStartState = function (stateId) {
        if ($scope.existStateWithId(stateId)) {
            //change on graphdesigner and others
            $scope.graphdesigner.changeStartState(stateId);
            //change the startState then
            $scope.config.startState = stateId;
        } else {
            //TODO: BETTER DEBUG
        }
    };

    /**
     * Removes the start state 
     */
    $scope.removeStartState = function () {
        //TODO What is dis
        if ($scope.config.startState !== null) {
            //change on graphdesigner and others
            $scope.graphdesigner.removeStartState();
            //change the startState
            $scope.config.startState = null;
        }

    };

    /**
     * Returns the Index of the saved FinalState
     * @param  {number} stateId 
     * @return {number}
     */
    $scope.getFinalStateIndexByStateId = function (stateId) {
        return _.indexOf($scope.config.finalStates, stateId);
    };

    /**
     * Returns if the state is a finalState
     * @param  {number} stateId 
     * @return {Boolean}         
     */
    $scope.isStateAFinalState = function (stateId) {
        for (var i = 0; i < $scope.config.finalStates.length; i++) {
            if ($scope.config.finalStates[i] == stateId)
                return true;
        }
        return false;
    };

    /**
     * Add a state as final State if it isnt already added and if their is a state with such a id
     */
    $scope.addFinalState = function (stateId) {
        if (!$scope.isStateAFinalState(stateId)) {
            $scope.config.finalStates.push(stateId);
            //add to the graphdesigner
            $scope.graphdesigner.addFinalState(stateId);
        } else {
            //TODO: BETTER DEBUG
        }
    };

    /**
     * Remove a state from the final states
     * @return {[type]} [description]
     */
    $scope.removeFinalState = function (stateId) {
        //remove from graphdesigner
        $scope.graphdesigner.removeFinalState(stateId);
        $scope.config.finalStates.splice($scope.getFinalStateIndexByStateId(stateId), 1);

    };

    //TRANSITIONS

    /**
     * Checks if a transition with the params already exist
     * @param  {number}  fromState      Id of the fromstate
     * @param  {number}  toState        id from the toState
     * @param  {Strin}  transitonName The name of the transition
     * @return {Boolean}                
     */
    $scope.existTransition = function (fromState, toState, transitonName) {
        var tmp = false;
        for (var i = 0; i < $scope.config.transitions.length; i++) {
            var transition = $scope.config.transitions[i];
            if (transition.fromState == fromState && transition.toState == toState && transition.name == transitonName) {
                tmp = true;
            }
        }
        return tmp;
    };

    /**
     * Adds a transition at the end of the transitions array
     * @param {number} fromState      The id from the fromState
     * @param {number} toState        The id from the toState
     * @param {String} transistonName The name of the Transition
     */
    $scope.addTransition = function (fromState, toState, transitonName) {
        //can only create the transition if it is unique-> not for the ndfa
        //there must be a fromState and toState, before adding a transition
        if (!$scope.existTransition(fromState, toState, transitonName) && $scope.existStateWithId(fromState) &&
            $scope.existStateWithId(toState)) {
            $scope.addTransitionWithId($scope.config.countTransitionId++, fromState, toState, transitonName);
        } else {
            //TODO: BETTER DEBUG
        }
    };

    /**
     * Adds a transition at the end of the transitions array -> for import 
     * !!!dont use at other places!!!!! ONLY FOR IMPORT
     * @param {number} fromState      The id from the fromState
     * @param {number} toState        The id from the toState
     * @param {String} transistonName The name of the Transition
     */
    $scope.addTransitionWithId = function (transitionId, fromState, toState, transitonName) {
        $scope.config.transitions.push({
            id: transitionId,
            fromState: fromState,
            toState: toState,
            name: transitonName
        });
        //drawTransistion
        $scope.graphdesigner.drawTransition(transitionId);
        //fix changes wont update after addTransisiton from the graphdesigner
        $scope.safeApply();
    };

    /**
     * Get the array index from the transition with the given transitionId
     * @param  {number} transitionId 
     * @return {number}         Returns the index and -1 when state with transistionId not found
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
     * @return {object}        Returns the objectreference of the state
     */
    $scope.getTransitionById = function (transitionId) {
        return $scope.config.transitions[$scope.getArrayTransitionIdByTransitionId(transitionId)];
    };

    /**
     * Removes the transistion
     * @param {number} transitionId      The id from the transition
     */
    $scope.removeTransition = function (transitionId) {
        //first remove the element from the svg after that remove it from the array
        $scope.graphdesigner.removeTransition(transitionId);
        $scope.config.countTransitionId--;
        $scope.config.transitions.splice($scope.getArrayTransitionIdByTransitionId(transitionId), 1);
    };

    /**
     * Renames a transition if is uniqe with the new name
     * @param  {number} transitionId     
     * @param  {String} newTransitionName 
     */
    $scope.renameTransition = function (transitionId, newTransitionName) {
        var transition = $scope.getTransitionById(transitionId);
        if (!$scope.existTransition(transition.fromState, transition.toState, newTransitionName)) {
            $scope.getTransitionById(transitionId).name = newTransitionName;
            //Rename the state on the graphdesigner
            $scope.graphdesigner.renameTransition(transitionId, newTransitionName);
        } else {
            //TODO: BETTER DEBUG
        }
    };
}
