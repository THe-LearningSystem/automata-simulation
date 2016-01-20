"use strict";

angular
    .module('myApp')
    .controller('DFACtrl', DFACtrl);


function DFACtrl($scope) {
    //for debug puposes better way for acessing in console?
    window.debugScope = $scope;
    //Default Values
    $scope.default = {};
    //the default prefix for autonaming for example S0,S1,... after the prefix it saves the id
    $scope.default.statePrefix = 'S';

    //AUTOMATA CONFIG START

    //TODO: Better name for the config of the automaton
    $scope.config = {};
    //Settings for the diagramm
    $scope.config.diagrammScale = 1;
    $scope.config.diagrammX = 0;
    $scope.config.diagrammY = 0;
    //Number of statesIds given to states
    $scope.config.countStateId = 0;
    //Number of transitionIds given to transitions
    $scope.config.countTransitionId = 0;
    //The States are saved like {id:stateId,name:"nameoftheState",x:50,y:50}
    $scope.config.states = [];
    //Only a number representing the id of the state
    $scope.config.startState = null;
    //An array of numbers representing the ids of the finalStates
    $scope.config.finalStates = [];
    //the transitions are saved like{fromState:stateId, toState:stateId, name:"transitionName"}
    $scope.config.transitions = [];

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

    $scope.graphdesigner = new graphdesignerDFA($scope, "#diagramm");
    //for the testdata
    $scope.testData = new testData($scope);
    //the statetransitionfunction controlling the statetransitionfunction-table
    $scope.statetransitionfunction = new statetransitionfunctionDFA($scope);

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
     * [addStateWithPresets description]
     * @param {[type]} x [description]
     * @param {[type]} y [description]
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
        var id = $scope.config.countStateId++;

        $scope.addStateWithId(id, stateName, x, y);

        //makes an update of the Statetransitionsfunction and its contents
        $scope.statetransitionfunction.update();
    }

    /**
     * Changes the start state to the given state id
     * 
     * @return {[type]} [description]
     */
    $scope.changeStartState = function(stateId) {
        //change on graphdesigner and others
        $scope.graphdesigner.changeStartState(stateId);
        $scope.config.startState = stateId;
    }

    /**
     * Add a state as final State
     */
    $scope.addFinalState = function(stateId) {
        //wenn noch nicht vorhanden
        
        $scope.config.finalStates.push(stateId);

    }

    /**
     * Remove a state from the final states
     * @return {[type]} [description]
     */
    $scope.removeFinalState = function(stateId) {
        //remove from graphdesigner
        $scope.config.states.push({
            id: id,
            name: stateName,
            x: x,
            y: y
        });
        //draw the State after the State is added
        $scope.graphdesigner.drawState($scope.getArrayStateIdByStateId(id));
        //the listener is always called after a new node was created
        $scope.graphdesigner.callStateListener();
        //makes an update of the Statetransitionsfunction and its contents
        $scope.statetransitionfunction.update();
    }

    /**
     * Adds a state at the end of the states array with a variable id -> used for import
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
    }

    /**
     * Removes the state with the given id
     * @param  {Int} stateId 
     */
    $scope.removeState = function(stateId) {
        if ($scope.hasStateTransitions(stateId)) {
            console.log("cant delete state with transitions!");
        } else {
            //first remove the element from the svg after that remove it from the array
            $scope.graphdesigner.removeState(stateId);

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
            console.log("Their is already a state with the given name");
        } else {
            $scope.getStateById(stateId).name = newStateName;

            //Rename the state on the graphdesigner
            $scope.graphdesigner.renameState(stateId, newStateName);
        }


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
     * @return {ObjectReference}         Returns the objectreference of the state
     */
    $scope.getStateById = function(stateId) {

        return $scope.config.states[$scope.getArrayStateIdByStateId(stateId)];
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


    //TRANSITIONS

    /**
     * Checks if a transition with the params already exist
     * @param  {Int}  fromState      Id of the fromstate
     * @param  {Int}  toState        id from the toState
     * @param  {Strin}  transitonName The name of the transition
     * @return {Boolean}                
     */
    $scope.isTransitionUnique = function(fromState, toState, transitonName) {
        var tmp = true;
        _.forEach($scope.config.transitions, function(transition) {
            if (transition.fromState == fromState && transition.toState == toState && transistion.name == transistonName) {
                tmp = false;
            }
        })
        return tmp;
    }


    /**
     * Adds a transition at the end of the transitions array
     * @param {Int} fromState      The id from the fromState
     * @param {Int} toState        The id from the toState
     * @param {String} transistonName The name of the Transition
     */
    $scope.addTransition = function(fromState, toState, transitonName) {
        var id = $scope.config.countTransitionId++;
        $scope.config.transitions.push({
            id: id,
            fromState: fromState,
            toState: toState,
            name: transitonName
        });
        //drawTransistion
        $scope.graphdesigner.drawTransition(id);
        //makes an update of the Statetransitionsfunction and its contents
        $scope.statetransitionfunction.update();
        //fix changes wont update after addTransisiton from the graphdesigner
        $scope.safeApply();
        
    }

    /**
     * Adds a transition at the end of the transitions array -> for import
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
     * @param {Int} fromState      The id from the fromState
     * @param {Int} toState        The id from the toState
     * @param {String} transistonName The name of the Transition
     */
    $scope.removeTransition = function(fromState, toState, transistonName) {
        var id = -1;
        _.forEach($scope.config.transitions, function(transition, key) {
            if (transition.fromState == fromState && transition.toState == toState && transition.name == transistonName) {
                id = key;
            }
        })
        if (id != -1) {
            $scope.config.transitions.splice(id, 1);
        } else {
            console.log("Transistion not found");
        }
    }
}
