angular
    .module('myApp')
    .controller('DFACtrl', DFACtrl);


function DFACtrl($scope) {
    //TODO: Better name for the config of the automaton
    $scope.config = {};
    $scope.config.countId = 0;
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
    $scope.graphdesigner = new graphdesignerDFA($scope.config, "#diagramm");

    //Creates Test Data
    $scope.test = function() {
        $scope.addState("test", 40, 40);
        $scope.addState("test2", 100, 100);
        $scope.addState("test1", 200, 200);

        $scope.addState("final", 150, 150);


        $scope.config.startState = 1;
        $scope.config.finalStates = 3;

        $scope.addTransition(1, 2, "b");
        $scope.addTransition(1, 3, "a");

        $scope.graphdesigner.drawStates();
        $scope.graphdesigner.drawTransitions();

        $scope.graphdesigner.callStateListener();


    }

    /**
     * Adds a state at the end of the states array
     * @param {String} stateName 
     * @param {Float} x         
     * @param {Float} y         
     */
    $scope.addState = function(stateName, x, y) {
        $scope.config.states.push({
            id: $scope.config.countId++,
            name: stateName,
            x: x,
            y: y
        });
    }
    /**
     * Adds a transition at the end of the transitions array
     * @param {Int} fromState      The id from the fromState
     * @param {Int} toState        The id from the toState
     * @param {String} transistonName The name of the Transition
     */
    $scope.addTransition = function(fromState, toState, transistonName) {
        $scope.config.transitions.push({
            fromState: fromState,
            toState: toState,
            name: transistonName
        });
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
        exportData.countId = $scope.config.countId;
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
