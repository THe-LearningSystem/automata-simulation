"use strict";

//Simulator for the simulation of the automata
var DFA = function($scope) {
    //for debug puposes better way for acessing in console?
    window.debugScope = $scope;
    //Default Values
    $scope.default = {};
    //the default prefix for autonaming for example S0,S1,... after the prefix it saves the id
    $scope.default.statePrefix = 'S';

    //AUTOMATA CONFIG START
    //TODO: Better name for the config of the automaton

    //Default Config for the automaton
    $scope.default.config = {};
    //Settings for the diagramm
    $scope.default.config.diagrammScale = 1;
    $scope.default.config.diagrammX = 0;
    $scope.default.config.diagrammY = 0;
    //Number of statesIds given to states
    $scope.default.config.countStateId = 0;
    //Number of transitionIds given to transitions
    $scope.default.config.countTransitionId = 0;
    //The States are saved like {id:stateId,name:"nameoftheState",x:50,y:50}
    $scope.default.config.states = [];
    //Only a number representing the id of the state
    $scope.default.config.startState = null;
    //An array of numbers representing the ids of the finalStates
    $scope.default.config.finalStates = [];
    //the transitions are saved like{fromState:stateId, toState:stateId, name:"transitionName"}
    $scope.default.config.transitions = [];



    //Config Object
    $scope.config = cloneObject($scope.default.config);

    //AUTOMATA CONFIG END

    //the name of the inputWord
    $scope.inputWord = '';

    //alerts
    $scope.alertDanger = 'NO ALERT';

    //Create a dbug objects for better dbugs(info, alert, danger)
    $scope.dbug = new dbug($scope);
    //the simulator controlling the simulation
    $scope.simulator = new simulationDFA($scope);
    //the graphdesigner controlling the svg diagramm
    $scope.graphdesigner = new graphdesignerDFA($scope, "#diagramm-svg");
    //the statetransitionfunction controlling the statetransitionfunction-table
    $scope.statetransitionfunction = new statetransitionfunctionDFA($scope);

    //for the testdata
    $scope.testData = new testData($scope);

    //from https://coderwall.com/p/ngisma/safe-apply-in-angular-js
    //fix for $apply already in progress
    $scope.safeApply = function(fn) {
        var phase = this.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

    /**
     * Removes the current automata and the inputWord
     */
    $scope.removeConfig = function() {
        $scope.graphdesigner.clearSvgContent();
        $scope.config = cloneObject($scope.default.config);
    }


    //STATE FUNCTIONS START

    /**
     * Checks if a state exist with the given name
     * @param  {String} stateName 
     * @return {Boolean}           
     */
    $scope.existStateWithName = function(stateName) {
        var tmp = false;
        _.forEach($scope.config.states, function(state) {
            if (state.name == stateName)
                return tmp = true;
        });
        return tmp;
    }

    /**
     * Checks if a state exist with the given id
     * @param  {Id} stateId 
     * @return {Boolean}           
     */
    $scope.existStateWithId = function(stateId) {
        for (var i = 0; i < $scope.config.states.length; i++) {
            if ($scope.config.states[i].id == stateId)
                return true;
        }
        return false;
    }

    /**
     * returns if the node has transitions
     * @param  {Int}  stateId 
     * @return {Boolean}         
     */
    $scope.hasStateTransitions = function(stateId) {
        var tmp = false;
        _.forEach($scope.config.transitions, function(transition) {
            if (transition.fromState == stateId || transition.toState == stateId) {
                tmp = true;
            }
        })
        return tmp;
    }

    /**
     * Get the array index from the state with the given stateId
     * @param  {Int} stateId 
     * @return {Int}         Returns the index and -1 when state with stateId not found
     */
    $scope.getArrayStateIdByStateId = function(stateId) {
        return _.findIndex($scope.config.states, function(state) {
            if (state.id == stateId) {
                return state;
            }
        });
    }

    /**
     * Returns the State with the given stateId
     * @param  {Int} stateId 
     * @return {ObjectReference}         Returns the objectreference of the state undefined if not found
     */
    $scope.getStateById = function(stateId) {

        return $scope.config.states[$scope.getArrayStateIdByStateId(stateId)];
    }

    /**
     * Add a state with default name
     * @param {Float} x         
     * @param {Float} y  
     */
    $scope.addStateWithPresets = function(x, y) {
        $scope.addState($scope.default.statePrefix + $scope.config.countStateId, x, y);
        //if u created a state then make the first state as startState ( default)
        if ($scope.config.countStateId == 1) {
            $scope.changeStartState(0);
        }
    }

    /**
     * Adds a state at the end of the states array
     * @param {String} stateName 
     * @param {Float} x         
     * @param {Float} y         
     */
    $scope.addState = function(stateName, x, y) {
        if (!$scope.existStateWithName(stateName)) {
            $scope.addStateWithId($scope.config.countStateId++, stateName, x, y);
        } else {
            //TODO: BETTER DEBUG     
        }
    }

    /**
     * Adds a state at the end of the states array with a variable id -> used for import
     * !!!dont use at other places!!!!! ONLY FOR IMPORT
     * @param {String} stateName 
     * @param {Float} x         
     * @param {Float} y         
     */
    $scope.addStateWithId = function(stateId, stateName, x, y) {
        $scope.config.states.push({
            id: stateId,
            name: stateName,
            x: x,
            y: y
        });
        //draw the State after the State is added
        $scope.graphdesigner.drawState($scope.getArrayStateIdByStateId(stateId));
        //the listener is always called after a new node was created
        $scope.graphdesigner.callStateListener();
        //fix changes wont update after addTransisiton from the graphdesigner
        $scope.safeApply();
    }

    /**
     * Removes the state with the given id
     * @param  {Int} stateId 
     */
    $scope.removeState = function(stateId) {
        if ($scope.hasStateTransitions(stateId)) {
            //TODO: BETTER DEBUG
        } else {
            //first remove the element from the svg after that remove it from the array
            $scope.graphdesigner.removeState(stateId);
            $scope.config.countStateId--;
            $scope.config.states.splice($scope.getArrayStateIdByStateId(stateId), 1);
        }
    }

    /**
     * Rename a state if the newStatename isnt already used
     * @param  {Int} stateId      
     * @param  {State} newStateName 
     */
    $scope.renameState = function(stateId, newStateName) {
        if ($scope.existStateWithName(newStateName)) {
            //TODO: BETTER DEBUG
        } else {
            $scope.getStateById(stateId).name = newStateName;
            //Rename the state on the graphdesigner
            $scope.graphdesigner.renameState(stateId, newStateName);
        }
    }

    /**
     * Changes the start state to the given state id
     */
    $scope.changeStartState = function(stateId) {
        if ($scope.existStateWithId(stateId)) {
            //change on graphdesigner and others
            $scope.graphdesigner.changeStartState(stateId);
            //change the startState then
            $scope.config.startState = stateId;
        } else {
            //TODO: BETTER DEBUG
        }
    }

    /**
     * Returns the Index of the saved FinalState
     * @param  {Int} stateId 
     * @return {Int}
     */
    $scope.getFinalStateIndexByStateId = function(stateId) {
        return _.indexOf($scope.config.finalStates, stateId);
    }

    /**
     * Returns if the state is a finalState
     * @param  {Int} stateId 
     * @return {Boolean}         
     */
    $scope.isStateAFinalState = function(stateId) {
        for (var i = 0; i < $scope.config.finalStates.length; i++) {
            if ($scope.config.finalStates[i] == stateId)
                return true;
        }
        return false;
    }

    /**
     * Add a state as final State if it isnt already added and if their is a state with such a id
     */
    $scope.addFinalState = function(stateId) {
        if (!$scope.isStateAFinalState(stateId)) {
            $scope.config.finalStates.push(stateId);
        } else {
            //TODO: BETTER DEBUG
        }
    }

    /**
     * Remove a state from the final states
     * @return {[type]} [description]
     */
    $scope.removeFinalState = function(stateId) {
        $scope.config.finalStates.splice($scope.getFinalStateIndexByStateId(stateId), 1);
    }

    //TRANSITIONS

    /**
     * Checks if a transition with the params already exist
     * @param  {Int}  fromState      Id of the fromstate
     * @param  {Int}  toState        id from the toState
     * @param  {Strin}  transitonName The name of the transition
     * @return {Boolean}                
     */
    $scope.existTransition = function(fromState, toState, transitonName) {
        var tmp = false;
        for (var i = 0; i < $scope.config.transitions.length; i++) {
            var transition = $scope.config.transitions[i];
            if (transition.fromState == fromState && transition.toState == toState && transition.name == transitonName) {
                tmp = true;
            }
        }
        return tmp;
    }

    /**
     * Adds a transition at the end of the transitions array
     * @param {Int} fromState      The id from the fromState
     * @param {Int} toState        The id from the toState
     * @param {String} transistonName The name of the Transition
     */
    $scope.addTransition = function(fromState, toState, transitonName) {
        //can only create the transition if it is unique-> not for the ndfa
        //there must be a fromState and toState, before adding a transition
        if (!$scope.existTransition(fromState, toState, transitonName) && $scope.existStateWithId(fromState) &&
            $scope.existStateWithId(toState)) {
            $scope.addTransitionWithId($scope.config.countTransitionId++, fromState, toState, transitonName);
        } else {
            //TODO: BETTER DEBUG
        }
    }

    /**
     * Adds a transition at the end of the transitions array -> for import 
     * !!!dont use at other places!!!!! ONLY FOR IMPORT
     * @param {Int} fromState      The id from the fromState
     * @param {Int} toState        The id from the toState
     * @param {String} transistonName The name of the Transition
     */
    $scope.addTransitionWithId = function(transitionId, fromState, toState, transitonName) {
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
    }

    /**
     * Get the array index from the transition with the given transitionId
     * @param  {Int} transitionId 
     * @return {Int}         Returns the index and -1 when state with transistionId not found
     */
    $scope.getArrayTransitionIdByTransitionId = function(transitionId) {
        return _.findIndex($scope.config.transitions, function(transition) {
            if (transition.id == transitionId) {
                return transition;
            }
        });
    }

    /**
     * Returns the transition of the given transitionId
     * @param  {Int} transitionId 
     * @return {ObjectReference}         Returns the objectreference of the state
     */
    $scope.getTransitionById = function(transitionId) {
        return $scope.config.transitions[$scope.getArrayTransitionIdByTransitionId(transitionId)];
    }

    /**
     * Removes the transistion
     * @param {Int} transitionId      The id from the transition
     */
    $scope.removeTransition = function(transitionId) {
        //first remove the element from the svg after that remove it from the array
        $scope.graphdesigner.removeTransition(transitionId);
        $scope.config.countTransitionId--;
        $scope.config.transitions.splice($scope.getArrayTransitionIdByTransitionId(transitionId), 1);
    }

    /**
     * Renames a transition if is uniqe with the new name
     * @param  {Int} transitionId     
     * @param  {String} newTransitionName 
     */
    $scope.renameTransition = function(transitionId, newTransitionName) {
        var transition = $scope.getTransitionById(transitionId);
        if (!$scope.existTransition(transition.fromState, transition.toState, newTransitionName)) {
            $scope.getTransitionById(transitionId).name = newTransitionName;
            //Rename the state on the graphdesigner
            $scope.graphdesigner.renameTransition(transitionId, newTransitionName);
        } else {
            //TODO: BETTER DEBUG
        }
    }
}
