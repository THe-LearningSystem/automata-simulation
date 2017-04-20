autoSim.TransitionMenus = function ($scope) {
    var self = this;

    self.edit = {};
    self.edit.isOpen = false;
    self.edit.transitionGroup = null;
    self.edit.watcher = [];


    self.edit.open = function (transitionGroup) {
        $scope.core.closeMenus();
        if (d3.event != null && d3.event.stopPropagation !== undefined)
            d3.event.stopPropagation();
        if (transitionGroup === undefined) {
            transitionGroup = $scope.transitions.getTransitionGroup(
                $scope.states.getById(parseInt(d3.select(this).attr("from-state-id"))),
                $scope.states.getById(parseInt(d3.select(this).attr("to-state-id"))));
        } else {
            //perhaps we got a wrong reference if the transition was deleted
            transitionGroup = $scope.transitions.getTransitionGroup(transitionGroup.fromState, transitionGroup.toState);
        }
        if (transitionGroup !== undefined) {
            $scope.transitions.selectTransitionGroup(transitionGroup);
            self.prepareTransitionMenuData(transitionGroup);
            self.edit.addWatcher();
            self.edit.isOpen = true;
            $scope.saveApply();

        }
    };

    self.prepareTransitionMenuData = function (transitionGroup) {
        self.edit.transitionGroup = _.cloneDeep(transitionGroup);
        _.forEach(self.edit.transitionGroup, function (transition) {
            var tmpInputSymbol = transition.inputSymbol;
            transition.inputSymbol = {};
            transition.inputSymbol.value = tmpInputSymbol;
            transition.inputSymbol.error = false;
        })
    };

    self.edit.close = function () {
        _.forEach(self.edit.watcher, function (value) {
            value();
        });
        self.edit.watcher = [];
        self.edit.transitionGroup = null;
        $scope.transitions.selectTransitionGroup(null);
        self.edit.isOpen = false;
    };

    self.edit.addWatcher = function () {
        for (var i = 0; i < self.edit.transitionGroup.length; i++) {
            self.edit.watcher.push($scope.$watch("transitions.menu.edit.transitionGroup['" + i + "']", function (newValue, oldValue) {
                var inputSymbolErrorFound = false;
                if (newValue.inputSymbol.value !== oldValue.inputSymbol.value) {
                    newValue.inputSymbol.error = false;
                    if (newValue.inputSymbol.value !== "" && !$scope.transitions.exists($scope.states.getById(newValue.fromState.id),
                            $scope.states.getById(newValue.toState.id), newValue.inputSymbol.value)) {
                        $scope.transitions.modify($scope.transitions.getById(newValue.id), newValue.inputSymbol.value);
                    } else {
                        if (newValue.inputSymbol.value === "") {
                            newValue.inputSymbol.error = true;
                            inputSymbolErrorFound = true;
                        }
                    }
                }
                if ($scope.transitions.exists($scope.states.getById(newValue.fromState.id),
                        $scope.states.getById(newValue.toState.id),
                        newValue.inputSymbol.value, newValue.id)) {
                    newValue.isUnique = false;
                    newValue.inputSymbol.error = true;
                } else {
                    if (!newValue.isUnique) {
                        newValue.inputSymbol.error = inputSymbolErrorFound;
                    }
                    newValue.isUnique = true;
                }
                $scope.saveApply();
            }, true));
        }
    };

    self.close = function () {
        self.edit.close();
    };

    self.isOpen = function () {
        return self.edit.isOpen;
    };


};