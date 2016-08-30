//statetransitionfunction for the DTA
function StatetransitionfunctionDTA($scope) {
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
                    tmpObject.name = stateTransition.name;
                    tmpObject.writeSymbol = stateTransition.writeSymbol;
                    tmpObject.moveDirection = stateTransition.moveDirection;

                    self.data.statetransitionfunction.push(tmpObject);
                }
            });
        });
    };
}