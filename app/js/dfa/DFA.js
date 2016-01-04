angular
    .module('myApp')
    .controller('DFACtrl', DFACtrl);


function DFACtrl($scope) {
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
    //the simulation
    $scope.simulator = new simulationDFA($scope.config);
    //the graphdesigner
    $scope.graphdesigner = new graphdesignerDFA($scope.config, "#diagramm");

    //TEst
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


    $scope.addState = function(stateName, x, y) {
        $scope.config.states.push({
            id: $scope.config.countId++,
            name: stateName,
            x: x,
            y: y
        });
    }

    $scope.addTransition = function(fromState, toState, transistonName) {
        $scope.config.transitions.push({
            fromState: fromState,
            toState: toState,
            name: transistonName
        });
    }



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

    $scope.download = function() {
        console.log();
       var blob = new Blob([window.JSON.stringify({"states":$scope.config.states,"transitions":$scope.config.transitions})], {
            type: "text/plain;charset=utf-8;",
        });
        saveAs(blob, "dfa.json");
    }

    $scope.upload = function() {
        console.log("todo")
    }

    /*
    window.onbeforeunload = function() {
        return "Make sure to save your graph locally before leaving :)";
    };

    */
}
