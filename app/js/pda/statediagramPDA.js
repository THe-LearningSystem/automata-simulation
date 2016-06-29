//statediagram for the PDA
function StateDiagramPDA($scope, svgSelector) {
	"use strict";

	var self = this;
	StateDiagramDFA.apply(self, arguments);

	self.drawStack = function() {

	};

	/**
	 * Modify a transition
	 * @param {number} fromState         the fromStateId
	 * @param {number} toState           the toStateID
	 * @param {number} transitionId      the transitionid
	 * @param {char}   newTransitionName the new transitionname
	 */
	self.modifyTransition = function(fromState, toState, transitionId, newTransitionName, newReadFromStack,newWriteToStack) {
		//change it in drawnTransition
		var drawnTransition = self.getDrawnTransition(fromState, toState);
		var drawnTransitionName = _.find(drawnTransition.names, {
			"id" : transitionId
		});
		drawnTransitionName.name = newTransitionName;
		drawnTransitionName.readFromStack = newReadFromStack;
		drawnTransitionName.writeToStack = newWriteToStack;

		//change it on the svg
		self.writeTransitionText(drawnTransition.objReference.select(".transition-text"), drawnTransition.names);
	};

	/**
	 * Adds the transition names to the text of a transition
	 * @param {object} textObj the transition textObjReference
	 * @param {array}  names   the names array of the transition
	 */
	self.writeTransitionText = function(textObj, names) {
		textObj.selectAll("*").remove();
		for (var i = 0; i < names.length; i++) {
			//fix when creating new transition when in animation
			if ($scope.simulator.animated.transition !== null && names[i].id === $scope.simulator.animated.transition.id) {
				textObj.append('tspan').attr('transition-id', names[i].id).text(names[i].name).classed("animated-transition-text", true);
			} else {
				textObj.append('tspan').attr('transition-id', names[i].id).text(names[i].name + ', ' + names[i].readFromStack + ';' + names[i].writeToStack);
			}

			if (i < names.length - 1)
				textObj.append('tspan').text(' |A ');
		}

	};

	/**For better overriting**/
	self.createDrawnTransitionNameObject = function(transition) {
		return {
			"id" : transition.id,
			"name" : transition.name,
			"readFromStack" : transition.readFromStack,
			"writeToStack" : transition.writeToStack
		};
	};

	/**
	 * opens the transitionmenu
	 * @param {number} transitionId when there is a transitionId we open the transitionmenu with the given id
	 */
	self.openTransitionMenu = function(transitionId) {
		self.closeStateMenu();
		self.closeTransitionMenu();
		self.preventSvgOuterClick = true;
		self.showTransitionMenu = true;

		var fromState,
		    toState;
		if (transitionId === undefined) {
			fromState = d3.select(this).attr('from-state-id');
			toState = d3.select(this).attr('to-state-id');
			self.selectedTransition = self.getDrawnTransition(fromState, toState);
		} else {
			var tmpTransition = $scope.getTransitionById(transitionId);
			fromState = tmpTransition.fromState;
			toState = tmpTransition.toState;
			self.selectedTransition = self.getDrawnTransition(fromState, toState);
		}

		self.selectedTransition.objReference.classed("active", true);

		self.input = {};
		self.input.fromState = $scope.getStateById(fromState);
		self.input.toState = $scope.getStateById(toState);
		self.input.transitions = [];

		_.forEach(self.selectedTransition.names, function(value, key) {
			var tmpObject = {};
			tmpObject = cloneObject(value);

			if (transitionId !== undefined) {
				if (value.id == transitionId) {
					tmpObject.isFocus = true;
				}
			} else if (self.selectedTransition.names.length - 1 === key) {
				tmpObject.isFocus = true;

			}
			//add other variables
			tmpObject.ttt = "";
			tmpObject.tttisopen = false;
			self.input.transitions.push(tmpObject);
		});

		self.transitionMenuListener = [];

		/*jshint -W083 */
		for (var i = 0; i < self.input.transitions.length; i++) {
			self.transitionMenuListener.push($scope.$watchCollection("statediagram.input.transitions['" + i + "']", function(newValue, oldValue) {
				if (newValue.name !== oldValue.name) {
					newValue.tttisopen = false;
					if (newValue.name !== "" && !$scope.existsTransition(fromState, toState, newValue.name)) {
						$scope.modifyTransition(newValue.id, newValue.name, newValue.readFromStack, newValue.writeToStack);
					} else if (newValue.name === "") {
						newValue.tttisopen = true;
						newValue.ttt = 'TRANS_MENU.NAME_TOO_SHORT';
					} else if ($scope.existsTransition(fromState, toState, newValue.name, newValue.id)) {
						newValue.tttisopen = true;
						newValue.ttt = 'TRANS_MENU.NAME_ALREAD_EXISTS';
					}
				}
				if (newValue.readFromStack !== oldValue.readFromStack) {
					console.log("change readGromStack");
					if (newValue.readFromStack !== "" && !$scope.existsTransition(fromState, toState, newValue.name, newValue.readFromStack, newValue.writeToStack)) {
						$scope.modifyTransition(newValue.id, newValue.name, newValue.readFromStack, newValue.writeToStack);
					}

				}
				if (newValue.writeToStack !== oldValue.writeToStack) {
					if (newValue.writeToStack !== "" && !$scope.existsTransition(fromState, toState, newValue.name, newValue.readFromStack, newValue.writeToStack)) {
						console.log("IM IN");
						$scope.modifyTransition(newValue.id, newValue.name, newValue.readFromStack, newValue.writeToStack);
					}
				}
			}));
		}

		$scope.safeApply();

	};
}