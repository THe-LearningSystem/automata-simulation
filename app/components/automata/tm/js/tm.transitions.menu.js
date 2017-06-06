autoSim.TransitionMenusTM = function($scope) {
    var self = this;

    autoSim.TransitionMenus.apply(this, arguments);


    self.prepareTransitionMenuData = function(transitionGroup) {
        self.edit.transitionGroup = _.cloneDeep(transitionGroup);
        _.forEach(self.edit.transitionGroup, function(transition) {
            var tmpInputSymbol = transition.inputSymbol;
            transition.inputSymbol = {};
            transition.inputSymbol.value = tmpInputSymbol;
            transition.inputSymbol.error = false;
            var tmpOutputSymbol = transition.outputSymbol;
            transition.outputSymbol = {};
            transition.outputSymbol.value = tmpOutputSymbol;
            transition.outputSymbol.error = false;
            var tmpMovingDirection = transition.movingDirection;
            transition.movingDirection = {};
            transition.movingDirection.value = tmpMovingDirection;
            transition.movingDirection.error = false;
        })
    };


    self.edit.addWatcher = function() {
        for (var i = 0; i < self.edit.transitionGroup.length; i++) {
            self.edit.watcher.push($scope.$watch("transitions.menu.edit.transitionGroup['" + i + "']", function(newValue, oldValue) {
                var nameErrorFound = false,
                    outputSymbolErrorFound = false,
                    movingDirectionErrorFound = false;
                if (newValue.inputSymbol.value !== oldValue.inputSymbol.value) {
                    newValue.inputSymbol.error = false;
                    if (newValue.inputSymbol.value !== "" && !$scope.transitions.exists($scope.states.getById(newValue.fromState.id), $scope.states.getById(newValue.toState.id), newValue.inputSymbol.value)) {
                      if (newValue.inputSymbol.value !== '→' && newValue.inputSymbol.value !== '←' && newValue.inputSymbol.value !== '↺') {
                          $scope.transitions.modify($scope.transitions.getById(newValue.id), newValue.inputSymbol.value, newValue.outputSymbol.value, newValue.movingDirection.value);
                      } else {
                        newValue.inputSymbol.value = oldValue.inputSymbol.value;
                        newValue.inputSymbol.error = true;
                        nameErrorFound = true;
                      }
                    } else if (newValue.inputSymbol.value === "" || newValue.inputSymbol.value === '→' || newValue.inputSymbol.value === '←' || newValue.inputSymbol.value === '↺') {
                        newValue.inputSymbol.error = true;
                        nameErrorFound = true;
                    }
                }
                if (newValue.outputSymbol.value !== oldValue.outputSymbol.value) {
                    newValue.outputSymbol.error = false;
                    if (newValue.outputSymbol.value !== "" && !$scope.transitions.exists($scope.states.getById(newValue.fromState.id), $scope.states.getById(newValue.toState.id), newValue.inputSymbol.value, newValue.outputSymbol.value, newValue.movingDirection.value)) {
                        if (newValue.outputSymbol.value !== '→' && newValue.outputSymbol.value !== '←' && newValue.outputSymbol.value !== '↺') {
                            $scope.transitions.modify($scope.transitions.getById(newValue.id), newValue.inputSymbol.value, newValue.outputSymbol.value, newValue.movingDirection.value);
                        } else {
                          newValue.outputSymbol.value = oldValue.outputSymbol.value;
                          newValue.outputSymbol.error = true;
                          outputSymbolErrorFound = true;
                        }
                    } else if (newValue.outputSymbol.value === "") {
                        newValue.outputSymbol.error = true;
                        outputSymbolErrorFound = true;
                    }

                }
                if (newValue.movingDirection.value !== oldValue.movingDirection.value) {
                    newValue.movingDirection.error = false;
                    if (newValue.movingDirection.value !== "" && !$scope.transitions.exists($scope.states.getById(newValue.fromState.id), $scope.states.getById(newValue.toState.id), newValue.inputSymbol.value, newValue.outputSymbol.value, newValue.movingDirection.value)) {
                      if (newValue.movingDirection.value === '→' || newValue.movingDirection.value === '←' || newValue.movingDirection.value === '↺') {
                          $scope.transitions.modify($scope.transitions.getById(newValue.id), newValue.inputSymbol.value, newValue.outputSymbol.value, newValue.movingDirection.value);
                      } else {
                        newValue.movingDirection.value = oldValue.movingDirection.value;
                        newValue.movingDirection.error = true;
                        movingDirectionErrorFound = true;
                      }
                    } else if (newValue.movingDirection.value === "") {
                        newValue.movingDirection.error = true;
                        movingDirectionErrorFound = true;
                    }

                }
                if ($scope.transitions.exists($scope.states.getById(newValue.fromState.id), $scope.states.getById(newValue.toState.id), newValue.inputSymbol.value, newValue.outputSymbol.value, newValue.movingDirection.value, newValue.id)) {
                    newValue.isUnique = false;
                    newValue.inputSymbol.error = true;
                    newValue.outputSymbol.error = true;
                    newValue.movingDirection.error = true;
                } else {
                    if (!newValue.isUnique) {
                        newValue.inputSymbol.error = nameErrorFound;
                        newValue.outputSymbol.error = outputSymbolErrorFound;
                        newValue.movingDirection.error = movingDirectionErrorFound;
                    }
                    newValue.isUnique = true;

                }
            }, true));
        }

    };
};
