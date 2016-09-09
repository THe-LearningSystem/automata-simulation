function StatetransitionfunctionDFA($scope) {
    "use strict";

    var self = this;
    self.data = {};

    /**
     * Update the automaton, when the user pressed save
     */
    self.updateAutomaton = function () {
        $scope.resetAutomaton();
        var transitions = self.parseSTF(self.editSTF.replaceAll(" ", ""));
        _.forEach(transitions, function (transition) {
            var x = 300 + Math.floor(Math.random() * 100);
            var y = 300 + Math.floor(Math.random() * 100);
            if (!$scope.existsStateWithName(transition.fromState))
                $scope.addState(transition.fromState, x, y);
            x = 300 + Math.floor(Math.random() * 100);
            y = 300 + Math.floor(Math.random() * 100);
            if (!$scope.existsStateWithName(transition.toState))
                $scope.addState(transition.toState, x, y);
            self.createTransition(transition);

        });

        $scope.changeStartState($scope.getStateByName(self.editStartState).id);
        var tmpEditFinalSTates = self.editFinalStates.replaceAll(" ", "").split(",");
        _.forEach(tmpEditFinalSTates, function (state) {
            if (state !== "")
                $scope.addFinalState($scope.getStateByName(state).id);

        });

        self.simulatePhysic();

    };

    self.simulatePhysic = function () {
        console.log("simulate physic");

        _.forEach($scope.automatonDatastates, function (state, key) {
            _.forEach($scope.automatonDatastates, function (secondState, secondKey) {
                if (key !== secondKey) {
                    while (secondState.x < state.x + 100 && secondState.x > state.x - 100 && secondState.y < state.y + 100 && secondState.y > state.y - 100) {
                        var directionVector = {
                            y: secondState.y - state.y,
                            x: secondState.x - state.x
                        };
                        var test = fixVectorLength(directionVector);
                        $scope.moveState(secondState.id, secondState.x + test.x * 10, secondState.y + test.y * 10);
                    }
                }

            });

        });
        //go through all trans connected to this state
        _.forEach($scope.automatonDatastates, function (state, key) {
            _.forEach($scope.config.transitions, function (transition, secondKey) {
                if (transition.fromState === state.id || transition.toState === state.id) {
                    var fromState = $scope.getStateById(transition.fromState);
                    var toState = $scope.getStateById(transition.toState);
                    var directionVector = {
                        y: fromState.y - toState.y,
                        x: fromState.x - toState.x
                    };
                    var fixedVectorLength = fixVectorLength(directionVector);
                    var directionVectorLength = Math.sqrt(directionVector.x * directionVector.x + directionVector.y * directionVector.y);
                    //when to near -> push
                    console.log(fromState, toState, directionVector, directionVectorLength);
                    if (directionVectorLength < 500) {
                        console.log("haha");
                        if (transition.fromState == state.id) {
                            $scope.moveState(transition.toState, toState.x + fixedVectorLength.x * 50, toState.y + fixedVectorLength.y * 50);
                        } else {
                            $scope.moveState(transition.fromState, fromState.x + fixedVectorLength.x * 50, fromState.y + fixedVectorLength.y * 50);
                        }
                    }
                    //when to far -> pull

                }

            });

        });
    };

    /**
     * creates the transition for overriding
     * @param transition
     */
    self.createTransition = function (transition) {
        $scope.addTransition($scope.getStateByName(transition.fromState).id, $scope.getStateByName(transition.toState).id, transition.name);
    };

    /**
     * parse the entered STF and output an array of transitions
     * @param input
     * @returns {Array}
     */
    self.parseSTF = function (input) {
        var tmpArray = [];
        for (var i = 0; i < input.length; i++) {
            if (input[i] == "(") {
                for (var x = i; x < input.length; x++) {
                    if (input[x] == ")") {
                        tmpArray.push(self.parseTransition(input.substring(i + 1, x)));
                        i = x + 1;
                        break;
                    }
                }
            }
        }
        return tmpArray;
    };

    /**
     * parse the entered editSTFInput
     * @param string
     * @returns {{}}
     */
    self.parseTransition = function (string) {
        var tmpObj = {};
        var tmpArray = string.split(",");

        _.forEach(tmpArray, function (value, key) {
            if (string !== "") {
                if (key == 0) {
                    tmpObj.fromState = value;
                } else if (key == 1) {
                    tmpObj.name = value;
                } else {
                    tmpObj.toState = value;
                }
            } else
                return undefined;
        });
        return tmpObj;
    };


    /**
     * show the STFModal
     */
    self.showSTFEditModal = function () {
        //change it to angular function
        $("#stf-edit-modal").modal();
        if ($scope.existsStateWithId($scope.config.startState))
            self.editStartState = $scope.getStateById($scope.config.startState).name;
        self.editFinalStates = "";
        _.forEach($scope.config.finalStates, function (state, key) {
            self.editFinalStates += $scope.getStateById(state).name;
            if (key + 1 !== $scope.config.finalStates.length) {
                self.editFinalStates += ", "
            }
        });
        self.loadEditSTFData();

    };

    /**
     * load the editSTFDAta
     */
    self.loadEditSTFData = function () {
        self.editSTF = "";

        _.forEach(self.data.statetransitionfunction, function (stf, key) {
            self.editSTF += "(" + stf.fromState + ", " + stf.char + ", " + stf.toState + ")";
            if (key + 1 !== self.data.statetransitionfunction.length) {
                self.editSTF += ", "
            }
        });
    };

}