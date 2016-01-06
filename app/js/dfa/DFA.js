"use strict";

angular
    .module('myApp')
    .controller('DFACtrl', DFACtrl);


function DFACtrl($scope) {
    //TODO: Better name for the config of the automaton
    $scope.config = {};
    $scope.config.countStateId = 0;
    $scope.config.countTransitionId = 0;
    //The States are saved like {id:stateId,name:"nameoftheState",x:50,y:50}
    $scope.config.states = [];
    //Only a number representing the id of the state
    $scope.config.startState = null;
    //An array of numbers representing the ids of the finalStates
    $scope.config.finalStates = [];
    //the transitions are saved like{fromState:stateId, toState:stateId, name:"transitionName"}
    $scope.config.transitions = [];
    //the name of the inputWord
    $scope.inputWord = '';


    //the simulator controlling the simulation
    $scope.simulator = new simulationDFA($scope.config);
    //the graphdesigner controlling the svg diagramm
    $scope.graphdesigner = new graphdesignerDFA($scope.config, "#diagramm", $scope);


    //Creates Test Data
    $scope.test = function() {
        $scope.addState("test", 40, 40);
        $scope.addState("test2", 100, 100);
        $scope.addState("Yeah", 200, 200);
        $scope.addState("final", 150, 150);


        $scope.config.startState = 1;
        $scope.config.finalStates = 3;

        $scope.addTransition(1, 2, "b");
        $scope.addTransition(1, 3, "a");


        $scope.graphdesigner.callStateListener();
        //console.log($scope.hasStateTransitions(100));
        //console.log($scope.existStateWithName("Yeah"));
        //console.log($scope.getArrayStateIdByStateId(100));
        //console.log($scope.getStateById(100));
        //console.log($scope.config.states);
        $scope.removeState(1);
        // console.log($scope.config.states);
        //  console.log($scope.getStateById(3));

        $scope.renameState(1, "Yeah");
        ///  console.log($scope.getStateById(3));
        // console.log($scope.config.transitions);
        // $scope.removeTransition(5, 2, "b");
        // console.log($scope.config.transitions);
    }

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
     * Adds a state at the end of the states array
     * @param {String} stateName 
     * @param {Float} x         
     * @param {Float} y         
     */
    $scope.addState = function(stateName, x, y) {
        var id = $scope.config.countStateId++;

        $scope.config.states.push({
            id: id,
            name: stateName,
            x: x,
            y: y
        });
        //draw the State after the State is added
        $scope.graphdesigner.drawState($scope.getArrayStateIdByStateId(id));

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
    $scope.addTransition = function(fromState, toState, transistonName) {
        var id = $scope.config.countTransitionId++;
        $scope.config.transitions.push({
            id: id,
            fromState: fromState,
            toState: toState,
            name: transistonName
        });
        //drawTransistion
        $scope.graphdesigner.drawTransition(id);
    }

    /**
     * Get the array index from the transition with the given transistionId
     * @param  {Int} transistionId 
     * @return {Int}         Returns the index and -1 when state with transistionId not found
     */
    $scope.getArrayTransitionIdByTransitionId = function(transistionId) {
        return _.findIndex($scope.config.transitions, function(transition) {
            if (transition.id == transistionId) {
                return transition;
            }
        });
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

    //Simulation;

    $scope.run = function() {
        $scope.simulator.setInput($scope.inputWord);
        $scope.simulator.run();
    }

    $scope.step = function() {
        validateInput();
        $scope.simulator.step();
    }

    $scope.undo = function() {
        validateInput();
        $scope.simulator.undo();
    }

    $scope.reset = function() {
        validateInput();
        $scope.simulator.reset();
    }

    function validateInput() {
        if ($scope.simulator.input != $scope.inputWord) {
            $scope.simulator.setInput($scope.inputWord);
            $scope.simulator.reset();
        }
    }

    /**
     * Exports the automaton
     * @return {File} Returns a json file
     */
    $scope.export = function() {

        var exportData = {};
        exportData.countStateId = $scope.config.countStateId;
        exportData.states = $scope.config.states;
        exportData.startState = $scope.config.startState;
        exportData.finalStates = $scope.config.finalStates;
        exportData.transitions = getTransitions();
        var data = window.JSON.stringify(exportData);
        var blob = new Blob([data], {
            type: "text/plain;charset=utf-8;",
        });
        saveAs(blob, "dfa.json");
    }

    /**
     * Returns all transistion without the objReference
     * @return {Array} array of transistion objects
     */
    function getTransitions() {
        var allTransitions = [];
        _.forEach($scope.config.transitions, function(transition, key) {
            var tmpTransition = {
                fromState: transition.fromState,
                toState: transition.toState,
                name: transition.name
            };
            allTransitions.push(tmpTransition);
        });
        return allTransitions;
    }


    //Called when the user clicks on the import Button and opens the hidden-file-input
    d3.select(".import").on("click", function() {
        document.getElementById("hidden-file-upload").click();
    });
    //called when the user uploads a file
    d3.select("#hidden-file-upload").on("change", function() {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            var uploadFile = this.files[0];
            var filereader = new window.FileReader();
            filereader.onload = function() {
                var txtRes = filereader.result;
                // TODO better error handling
                try {
                    var data = JSON.parse(txtRes);
                    if (data != undefined) {
                        console.log(data);
                        $scope.$apply(function() {
                            $scope.config = {}
                            $scope.config = data;
                            $scope.graphdesigner.drawStates();
                            $scope.graphdesigner.drawTransitions();
                            console.log("asd");
                        });

                    }
                } catch (err) {
                    console.log("Error parsing uploaded file\nerror message: " + err.message);
                    return;
                }
            };
            filereader.readAsText(uploadFile);

        } else {
            alert("Your browser won't let you save this graph -- try upgrading your browser to IE 10+ or Chrome or Firefox.");
        }

    });

    //called before the user is quitting the page, that he should save his work
    /*
    window.onbeforeunload = function() {
        return "Make sure to save our work!";
    };
    */
}
