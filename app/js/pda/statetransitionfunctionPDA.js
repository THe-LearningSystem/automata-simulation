//statediagram for the PDA
function StatetransitionfunctionPDA($scope) {
	"use strict";

	var self = this;
	StatetransitionfunctionDFA.apply(self, arguments);

	self.update = function() {
		parentRun.apply(this);
	};

	self.updateStateTransitionFunctions = function() {
		self.data.statetransitionfunction = [];
		//we go through every state and check if there is a transition and then we save them in the statetransitionfunction array
		_.forEach($scope.config.states, function(state, keyOuter) {
			_.forEach($scope.config.transitions, function(transition, key) {
				var tmpObject = {};
				if (transition.fromState === state.id) {
					var stateTransition = transition;
					var selectedTransition = false;
					tmpObject.selected = ($scope.statediagram.selectedTransition !== null && _.find($scope.statediagram.selectedTransition.names, {
						id : transition.id
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

}