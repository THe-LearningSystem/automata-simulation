autoSim.TransitionMenusPDA = function ($scope) {
    var self = this;

    autoSim.TransitionMenus.apply(this, arguments);


    self.prepareTransitionMenuData = function (transitionGroup) {
        self.edit.transitionGroup = _.cloneDeep(transitionGroup);
        _.forEach(self.edit.transitionGroup, function (transition) {
            var tmpInputSymbol = transition.inputSymbol;
            transition.inputSymbol = {};
            transition.inputSymbol.value = tmpInputSymbol;
            transition.inputSymbol.error = false;
            var tmpReadFromStack = transition.readFromStack;
            transition.readFromStack = {};
            transition.readFromStack.value = tmpReadFromStack;
            transition.readFromStack.error = false;
            var tmpWriteToStack = transition.writeToStack;
            transition.writeToStack = {};
            transition.writeToStack.value = tmpWriteToStack;
            transition.writeToStack.error = false;
        })
    };


    self.edit.addWatcher = function () {
        for (var i = 0; i < self.edit.transitionGroup.length; i++) {
            self.edit.watcher.push($scope.$watch("transitions.menu.edit.transitionGroup['" + i + "']", function (newValue, oldValue) {
                var nameErrorFound = false, readFromStackErrorFound = false, writeToStackErrorFound = false;
                if (newValue.inputSymbol.value !== oldValue.inputSymbol.value) {
                    newValue.inputSymbol.error = false;
                    if (newValue.inputSymbol.value !== "" && !$scope.transitions.exists($scope.states.getById(newValue.fromState.id), $scope.states.getById(newValue.toState.id), newValue.inputSymbol.value)) {
                        $scope.transitions.modify($scope.transitions.getById(newValue.id), newValue.inputSymbol.value, newValue.readFromStack.value, newValue.writeToStack.value);
                    } else if (newValue.inputSymbol.value === "") {
                        newValue.inputSymbol.error = true;
                        nameErrorFound = true;
                    }
                }
                if (newValue.readFromStack.value !== oldValue.readFromStack.value) {
                    newValue.readFromStack.error = false;
                    if (newValue.readFromStack.value !== "" && !$scope.transitions.exists($scope.states.getById(newValue.fromState.id), $scope.states.getById(newValue.toState.id), newValue.inputSymbol.value, newValue.readFromStack.value, newValue.writeToStack.value)) {
                        $scope.transitions.modify($scope.transitions.getById(newValue.id), newValue.inputSymbol.value, newValue.readFromStack.value, newValue.writeToStack.value);
                    } else if (newValue.readFromStack.value === "") {
                        newValue.readFromStack.error = true;
                        readFromStackErrorFound = true;
                    }

                }
                if (newValue.writeToStack.value !== oldValue.writeToStack.value) {
                    newValue.writeToStack.error = false;
                    if (newValue.writeToStack.value !== "" && !$scope.transitions.exists($scope.states.getById(newValue.fromState.id), $scope.states.getById(newValue.toState.id), newValue.inputSymbol.value, newValue.readFromStack.value, newValue.writeToStack.value)) {
                        $scope.transitions.modify($scope.transitions.getById(newValue.id), newValue.inputSymbol.value, newValue.readFromStack.value, newValue.writeToStack.value);
                    } else if (newValue.writeToStack.value === "") {
                        newValue.writeToStack.error = true;
                        writeToStackErrorFound = true;
                    }

                }
                if ($scope.transitions.exists($scope.states.getById(newValue.fromState.id), $scope.states.getById(newValue.toState.id), newValue.inputSymbol.value, newValue.readFromStack.value, newValue.writeToStack.value, newValue.id)) {
                    newValue.isUnique = false;
                    newValue.inputSymbol.error = true;
                    newValue.readFromStack.error = true;
                    newValue.writeToStack.error = true;
                } else {
                    if (!newValue.isUnique) {
                        newValue.inputSymbol.error = nameErrorFound;
                        newValue.readFromStack.error = readFromStackErrorFound;
                        newValue.writeToStack.error = writeToStackErrorFound;
                    }
                    newValue.isUnique = true;

                }
            }, true));
        }

    };
};
