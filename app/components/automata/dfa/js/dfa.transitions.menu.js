autoSim.TransitionMenus = function ($scope) {
    var self = this;

    self.edit = {};
    self.edit.isOpen = false;
    self.edit.transitionGroup = null;
    self.edit.watcher = [];


    self.edit.open = function (transitionGroup) {
        if ($scope.states.menu.isOpen())
            $scope.states.menu.close();

        $scope.statediagram.menu.preventSvgOuterClick = true;
        self.edit.close();
        if (transitionGroup !== undefined) {
            $scope.transitions.selected = transitionGroup;
            self.edit.transitionGroup = _.cloneDeep(transitionGroup);
            self.edit.addWatcher();
            self.edit.isOpen = true;
        }
    };


    self.edit.close = function () {
        _.forEach(self.edit.watcher, function (value) {
            value();
        });
        self.edit.watcher = [];
        self.edit.transitionGroup = null;
        $scope.transitions.selected = null;
        self.edit.isOpen = false;
    };

    self.edit.addWatcher = function () {
        for (var i = 0; i < self.edit.transitionGroup.length; i++) {
            self.edit.watcher.push($scope.$watchCollection("transitions.menu.edit.transitionGroup['" + i + "']", function (newValue, oldValue) {
                var inputSymbolErrorFound = false;
                if (newValue.inputSymbol !== oldValue.inputSymbol) {
                    newValue.error = false;
                    if (newValue.inputSymbol !== "" && !$scope.transitions.exists($scope.states.getById(newValue.fromState.id), $scope.states.getById(newValue.toState.id), newValue.inputSymbol)) {
                        $scope.transitions.modify($scope.transitions.getById(newValue.id), newValue.inputSymbol);
                    } else {
                        if (newValue.inputSymbol === "") {
                            newValue.error = true;
                            inputSymbolErrorFound = true;
                        }
                    }
                }
                if ($scope.transitions.exists($scope.states.getById(newValue.fromState.id), $scope.states.getById(newValue.toState.id), newValue.inputSymbol, newValue.id)) {
                    newValue.isUnique = false;
                    newValue.error = true;
                } else {
                    if (!newValue.isUnique) {
                        newValue.error = inputSymbolErrorFound;
                    }
                    newValue.isUnique = true;
                }
                $scope.saveApply();
            }));
        }
    };

    self.close = function () {
        self.edit.close();
    };

    self.isOpen = function () {
        return self.edit.isOpen;
    }


};