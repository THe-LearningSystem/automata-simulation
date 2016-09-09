//statediagram for the PDA
function StatetransitionfunctionPDA($scope) {
    "use strict";

    var self = this;
    StatetransitionfunctionDFA.apply(self, arguments);

    self.updateStateTransitionFunctions = function () {
        self.data.statetransitionfunction = [];
        //we go through every state and check if there is a transition and then we save them in the statetransitionfunction array
        _.forEach($scope.config.states, function (state) {
            _.forEach($scope.config.transitions, function (transition) {
                var tmpObject = {};
                if (transition.fromState === state.id) {
                    var stateTransition = transition;
                    tmpObject.selected = ($scope.statediagram.selectedTransition !== null && _.find($scope.statediagram.selectedTransition.names, {
                        id: transition.id
                    }) !== undefined) ? 'selected' : '';

                    tmpObject.animated = ($scope.simulator.animated.transition && $scope.simulator.animated.transition.id === stateTransition.id) ? 'animated-transition' : '';

                    tmpObject.fromState = $scope.getStateById(stateTransition.fromState).name;
                    tmpObject.toState = $scope.getStateById(stateTransition.toState).name;
                    tmpObject.char = stateTransition.name;
                    tmpObject.readFromStack = stateTransition.readFromStack;
                    tmpObject.writeToStack = stateTransition.writeToStack;

                    self.data.statetransitionfunction.push(tmpObject);
                }
            });
        });
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
                } else if (key == 2) {
                    tmpObj.readFromStack = value;
                } else if (key == 3) {
                    tmpObj.toState = value;
                } else {
                    tmpObj.writeToStack = value
                }
            } else
                return undefined;
        });
        return tmpObj;
    };

    /**
     * creates the transition for overriding
     * @param transition
     */
    self.createTransition = function (transition) {
        $scope.addTransition($scope.getStateByName(transition.fromState).id, $scope.getStateByName(transition.toState).id, transition.name, transition.readFromStack, transition.writeToStack);
    };

    /**
     * load the editSTFDAta
     */
    self.loadEditSTFData = function () {
        self.editSTF = "";

        _.forEach(self.data.statetransitionfunction, function (stf, key) {
            self.editSTF += "(" + stf.fromState + ", " + stf.char + ", " + stf.readFromStack + ", " + stf.toState + ", " + stf.writeToStack + ")";
            if (key + 1 !== self.data.statetransitionfunction.length) {
                self.editSTF += ", "
            }
        });
    };


}