function StateDiagramMenuHandlerDFA($scope, self) {

    self.showStateMenu = false;
    /**
     * Opens the StateMenu
     */
    self.openStateMenu = function () {
        self.closeStateMenu();
        self.closeTransitionMenu();
        //fixes weird errors
        $scope.safeApply();
        self.preventSvgOuterClick = true;
        self.showStateMenu = true;
        self.selectedState = $scope.getStateById(parseInt(d3.select(this).attr("object-id")));
        //add new state as selected
        self.toggleState(self.selectedState.id, true);
        //save the state values in the state context as default value
        self.input = {};
        self.input.state = self.selectedState;
        self.input.stateName = self.selectedState.name;
        self.input.startState = $scope.config.startState == self.selectedState.id;
        self.input.finalState = $scope.isStateAFinalState(self.selectedState.id);
        self.input.ttt = "";
        self.input.tttisopen = false;
        $scope.safeApply();
        self.stateMenuListener = [];
        //Menu watcher
        self.stateMenuListener.push($scope.$watch('statediagram.input.startState', function (newValue, oldValue) {
            if (newValue !== oldValue) {
                if (self.input.startState) {
                    $scope.changeStartState(self.input.state.id);
                } else {
                    if (self.selectedState.id == $scope.config.startState)
                        $scope.removeStartState();
                }
            }

        }));
        self.stateMenuListener.push($scope.$watch('statediagram.input.finalState', function (newValue, oldValue) {
            if (newValue !== oldValue) {
                if (self.input.finalState) {
                    $scope.addFinalState(self.input.state.id);
                } else {
                    $scope.removeFinalState(self.input.state.id);
                }

            }

        }));
        self.stateMenuListener.push($scope.$watch('statediagram.input.stateName', function (newValue, oldValue) {
            //if the name got changed but is not empty
            //reset the tooltip
            self.input.tttisopen = false;
            if (newValue !== oldValue) {
                //change if the name doesn't exists and isn't empty
                if (newValue !== "" && !$scope.existsStateWithName(newValue)) {
                    !$scope.renameState(self.input.state.id, newValue);
                } else if (newValue === "") {
                    //FEEDBACK
                    self.input.tttisopen = true;
                    self.input.ttt = 'STATE_MENU.NAME_TOO_SHORT';
                } else if ($scope.existsStateWithName(newValue, self.input.state.id)) {
                    self.input.tttisopen = true;
                    self.input.ttt = 'STATE_MENU.NAME_ALREADY_EXIST';
                }
            }
        }));
    };
    /**
     * closes the state menu
     */
    self.closeStateMenu = function () {
        //remove old StateMenuListeners
        _.forEach(self.stateMenuListener, function (value) {
            value();
        });
        if (self.selectedState !== null) {
            self.toggleState(self.selectedState.id, false);
        }
        self.stateMenuListener = null;
        self.showStateMenu = false;
        //delete input
        self.input = null;
    };

    self.showTransitionMenu = false;
    /**
     * opens the transitionMenu
     * @param {number} transitionId when there is a transitionId we open the transitionMenu with the given id
     */
    self.openTransitionMenu = function (transitionId) {
        self.closeStateMenu();
        self.closeTransitionMenu();
        self.preventSvgOuterClick = true;
        self.showTransitionMenu = true;
        var fromState,
            toState;
        if (transitionId === undefined) {
            fromState = d3.select(this).attr('from-state-id');
            toState = d3.select(this).attr('to-state-id');
            self.selectedTransition = $scope.getDrawnTransition(fromState, toState);
        } else {
            var tmpTransition = $scope.getTransitionById(transitionId);
            fromState = tmpTransition.fromState;
            toState = tmpTransition.toState;
            self.selectedTransition = $scope.getDrawnTransition(fromState, toState);
        }

        self.selectedTransition.objReference.classed("active", true);
        self.input = {};
        self.input.fromState = $scope.getStateById(fromState);
        self.input.toState = $scope.getStateById(toState);
        self.input.transitions = [];
        _.forEach(self.selectedTransition.names, function (value, key) {
            var tmpObject = _.cloneDeep(value);
            if (transitionId !== undefined) {
                if (value.id == transitionId) {
                    tmpObject.isFocus = true;
                }
            } else if (self.selectedTransition.names.length - 1 === key) {
                tmpObject.isFocus = true;
            }
            //add other variables
            tmpObject.error = false;
            self.input.transitions.push(tmpObject);
        });
        self.transitionMenuListener = [];
        /*jshint -W083 */
        for (var i = 0; i < self.input.transitions.length; i++) {
            self.transitionMenuListener.push($scope.$watchCollection("statediagram.input.transitions['" + i + "']", function (newValue, oldValue) {
                var nameErrorFound = false;
                //noinspection JSUnresolvedVariable
                if (newValue.name !== oldValue.name) {
                    newValue.error = false;
                    //noinspection JSUnresolvedVariable
                    if (newValue.name !== "" && !$scope.existsTransition(fromState, toState, newValue.name)) {
                        //noinspection JSUnresolvedVariable
                        $scope.modifyTransition(newValue.id, newValue.name);
                    } else { //noinspection JSUnresolvedVariable
                        if (newValue.name === "") {
                            newValue.error = true;
                            nameErrorFound = true;
                        }
                    }
                }
                //noinspection JSUnresolvedVariable
                if ($scope.existsTransition(fromState, toState, newValue.name, newValue.id)) {
                    newValue.isUnique = false;
                    newValue.error = true;
                } else {
                    //noinspection JSUnresolvedVariable
                    if (!newValue.isUnique) {
                        newValue.error = nameErrorFound;
                    }
                    newValue.isUnique = true;

                }
            }));
        }

        $scope.safeApply();
    };

    /**
     * closes the transitionMenu
     */
    self.closeTransitionMenu = function () {
        _.forEach(self.transitionMenuListener, function (value) {
            value();
        });
        self.showTransitionMenu = false;
        if (self.selectedTransition !== null) {
            self.selectedTransition.objReference.classed("active", false);
            self.selectedTransition = null;
        }
    };

    self.preventContextMenuOpen = false;

    self.contextMenuOpened = false;
    /**
     * opens or close the ContextMenu if the user clicked on a state the stateContextMenu will open not this one
     * @param event
     * @param wantToClose
     */
    self.contextMenu = function (event, wantToClose) {
        var menu = d3.select(".context-menu");
        var active = "context-menu--active";
        if (wantToClose === undefined && !self.preventContextMenuOpen) {
            if (self.stateContextMenuOpened)
                self.stateContextMenu(null, true);
            self.contextMenuOpened = true;
            menu.classed(active, true);
            menu.attr("style", "top:" + event.layerY + "px;" + "left:" + event.layerX + "px;");
            self.contextMenuData = {};
            self.contextMenuData.addStateX = (((event.layerX - $scope.config.diagram.x) * (1 / $scope.config.diagram.scale)));
            self.contextMenuData.addStateY = (((event.layerY - $scope.config.diagram.y) * (1 / $scope.config.diagram.scale)));
        } else {
            menu.classed(active, false);
            self.contextMenuOpened = false;
        }
        self.preventContextMenuOpen = false;
    };

    self.stateContextMenuOpened = false;
    /**
     * opens or close the stateContextMenu
     */
    self.stateContextMenu = function (stateId, wantToClose) {
        if (self.contextMenuOpened)
            self.contextMenu(null, true);
        self.preventContextMenuOpen = true;
        var menu = d3.select(".context-menu-state");
        var active = "context-menu--active";
        if (wantToClose === undefined && self.tmpTransition == null) {
            self.stateContextMenuOpened = true;
            menu.classed(active, true);
            menu.attr("style", "top:" + event.layerY + "px;" + "left:" + event.layerX + "px;");
            self.contextMenuData = {};
            self.contextMenuData.stateId = stateId;
        } else {
            menu.classed(active, false);
            self.stateContextMenuOpened = false;
            self.preventContextMenuOpen = false;
        }
    };

    self.changeInputFieldValue = function (value) {
        $scope.safeApply(function () {
            event.preventDefault();
            var active = document.activeElement;
            var element = document.getElementById(active.id);
            if (element != null) {
                element.value = value;
                if ("createEvent" in document) {
                    var evt = document.createEvent("HTMLEvents");
                    evt.initEvent("change", false, true);
                    element.dispatchEvent(evt);
                }
                else
                    element.fireEvent("onchange");
            }
        });
    };

    self.isInputFieldChangePossible = function () {
        var active = document.activeElement;
        var element = document.getElementById(active.id);
        return element != null;
    }
}