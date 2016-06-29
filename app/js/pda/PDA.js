//PDA
function PDA($scope, $translate) {
	"use strict";

	var self = this;
	DFA.apply(this, arguments);

	$scope.defaultConfig.stackFirstSymbol = "#";
	$scope.defaultConfig.stack = [$scope.defaultConfig.stackFirstSymbol];
	$scope.defaultConfig.stackAlphabet = [];

	//Config Object
	$scope.config = cloneObject($scope.defaultConfig);

	/**Overrides**/
	//the statediagram controlling the svg diagramm
	$scope.simulator = new SimulationPDA($scope);
	// the table where states and transitions are shown
	$scope.table = new TablePDA($scope);
	//the statediagram controlling the svg diagramm
	$scope.statediagram = new StateDiagramPDA($scope, "#diagramm-svg");
	//the statetransitionfunction controlling the statetransitionfunction-table
	$scope.statetransitionfunction = new StatetransitionfunctionPDA($scope);
	// the table where states and transitions are shown
	$scope.table = new TablePDA($scope);

	$scope.pushOnStack = function(char) {
		$scope.config.stack.push(char);

	};

	$scope.popFromStack = function(char) {

	};

	//TRANSITION OVERRIDES
	/**
	 * Adds a char to the input alphabet if the char is not available
	 * @param   {value} value the char, which is to be added
	 */
	$scope.addToStackAlphabet = function(value) {
		for (var i = 0; i < value.length; i++) {
			if (!_.some($scope.config.stackAlphabet, function(a) {
				return a === value[i];
			})) {
				$scope.config.stackAlphabet.push(value[i]);
			}
		}
	};


/**
 * Checks if a transition with the params already exists
 * @param  {number}  fromState      Id of the fromstate
 * @param  {number}  toState        id from the toState
 * @param  {Strin}  transitonName The name of the transition
 * @return {Boolean}
 */
$scope.existsTransition = function(fromState, toState, name, readFromStack, writeToStack, transitionId) {
	var tmp = false;
	_.forEach($scope.config.transitions, function(transition, key) {
		if (transition.fromState == fromState && transition.toState == toState && transition.name == name && transition.readFromStack == readFromStack && transition.writeToStack == writeToStack && transitionId !== transition.id) {
			tmp = true;
			console.log(transition);
			return;
		}
	});
	return tmp;
};

$scope.getNextTransitionName = function(fromState) {
	var namesArray = [];
	for (var i = 0; i < $scope.config.transitions.length; i++) {
		if ($scope.config.transitions[i].fromState == fromState) {
			namesArray.push($scope.config.transitions[i].name);
		}
	}
	var foundNextName = false;
	var tryChar = "a";
	while (!foundNextName) {
		var value = _.indexOf(namesArray, tryChar);
		if (value === -1) {
			foundNextName = true;
		} else {
			tryChar = String.fromCharCode(tryChar.charCodeAt() + 1);
		}
	}
	return tryChar;

};

/**
 * Adds a transition at the end of the transitions array
 * @param {number} fromState      The id from the fromState
 * @param {number} toState        The id from the toState
 * @param {String} transistonName The name of the Transition
 */
$scope.addTransition = function(fromState, toState, char, readFromStack, writeToStack) {
	//can only create the transition if it is unique-> not for the ndfa
	//there must be a fromState and toState, before adding a transition
	if (!$scope.existsTransition(fromState, toState, char) && $scope.existsStateWithId(fromState) && $scope.existsStateWithId(toState)) {
		$scope.addToAlphabet(char);
		//Add to the stackalphabet
		$scope.addToStackAlphabet(readFromStack);
		$scope.addToStackAlphabet(writeToStack);

		return $scope.addTransitionWithId($scope.config.countTransitionId++, fromState, toState, char, readFromStack, writeToStack);

	} else {
		//TODO: BETTER DEBUG
	}
};

/**
 * Adds a transition at the end of the transitions array -> for import
 * !!!dont use at other places!!!!! ONLY FOR IMPORT
 * @param {number} fromState      The id from the fromState
 * @param {number} toState        The id from the toState
 * @param {String} transistonName The name of the Transition
 */
$scope.addTransitionWithId = function(transitionId, fromState, toState, char, readFromStack, writeToStack) {
	$scope.config.transitions.push(new TransitionPDA(transitionId, fromState, toState, char, readFromStack, writeToStack));
	//drawTransistion
	$scope.statediagram.drawTransition(transitionId);
	$scope.updateListener();
	//fix changes wont update after addTransisiton from the statediagram
	$scope.safeApply();
	return $scope.getTransitionById(transitionId);
};

/**
 * Get the array index from the transition with the given transitionId
 * @param  {number} transitionId
 * @return {number}         Returns the index and -1 when state with transistionId not found
 */
$scope.getArrayTransitionIdByTransitionId = function(transitionId) {
	return _.findIndex($scope.config.transitions, function(transition) {
		if (transition.id == transitionId) {
			return transition;
		}
	});
};

/**
 * Returns the transition of the given transitionId
 * @param  {number} transitionId
 * @return {object}        Returns the objectreference of the state
 */
$scope.getTransitionById = function(transitionId) {
	return $scope.config.transitions[$scope.getArrayTransitionIdByTransitionId(transitionId)];
};

/**
 * Checks if a transition with the params already exists
 * @param  {number}  fromState      Id of the fromstate
 * @param  {number}  toState        id from the toState
 * @param  {Strin}  transitonName The name of the transition
 * @return {Boolean}
 */
$scope.getTransition = function(fromState, toState, char, readFromStack, writeToStack) {
	for (var i = 0; i < $scope.config.transitions.length; i++) {
		var transition = $scope.config.transitions[i];
		if (transition.fromState == fromState && transition.toState == toState && transition.name == char && transition.readFromStack == readFromStack && transition.writeToStack == writeToStack) {
			return transition;
		}
	}
	return undefined;
};

/**
 * Removes the transistion
 * @param {number} transitionId      The id from the transition
 */
$scope.removeTransition = function(transitionId) {
	//remove old transition from alphabet if this transition only used this char
	$scope.removeFromAlphabetIfNotUsedFromOthers(transitionId);
	//first remove the element from the svg after that remove it from the array
	$scope.statediagram.removeTransition(transitionId);
	$scope.config.transitions.splice($scope.getArrayTransitionIdByTransitionId(transitionId), 1);
	//update other listeners when remove is finished
	$scope.updateListener();
};

/**
 * Modify a transition if is uniqe with the new name
 * @param  {number} transitionId
 * @param  {String} newTransitionName
 */
$scope.modifyTransition = function(transitionId, newChar, newReadFromStack, newWriteToStack) {
	var transition = $scope.getTransitionById(transitionId);
	if (!$scope.existsTransition(transition.fromState, transition.toState, newChar, newReadFromStack, newWriteToStack, transitionId)) {
		var tmpTransition = $scope.getTransitionById(transitionId);
		console.log("want to change");
		//remove old transition from alphabet if this transition only used this char
		$scope.removeFromAlphabetIfNotUsedFromOthers(transitionId);
		//add new transitionname to the alphabet
		$scope.addToAlphabet(newChar);
		//remove old transition from stackalphabet if this transition only used this char
		$scope.removeFromStackAlphabetIfNotUsedFromOthers(transitionId);
		//add to stackAlphabet
		$scope.addToStackAlphabet(newReadFromStack);
		$scope.addToStackAlphabet(newWriteToStack);
		//save the new transitionname
		var transition = $scope.getTransitionById(transitionId);
		transition.name = newChar;
		transition.readFromStack = newReadFromStack;
		transition.writeToStack = newWriteToStack;
		//Rename the state on the statediagram
		$scope.statediagram.modifyTransition(transition.fromState, transition.toState, transitionId, newChar, newReadFromStack, newWriteToStack);
		$scope.updateListener();
		console.log("changed");
		return true;
	} else {
		//TODO: BETTER DEBUG
		return false;
	}
};
}