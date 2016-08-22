//statediagram for the DTA
function StateDiagramDTA($scope, svgSelector) {
    "use strict";

    var self = this;
    StateDiagramDFA.apply(self, arguments);
    //overwritten variables
    self.transitionTextLength = 27;
    self.selfTransitionTextLength = 30;

    //reference to the parentInit function
    var parentInit = self.init;

    /**
     * overwritten init function
     */
    self.init = function () {
        parentInit();
    };


    /**
     * creates a transition
     * @param fromState
     * @param toState
     */
    self.createTransition = function (fromState, toState) {
        var tmpTransition = $scope.addTransition(fromState, toState, $scope.getNextTransitionName(self.selectedState.id), "b", "N");
        self.toggleState(self.selectedState.id, false);
        self.tmpTransition.remove();
        self.tmpTransition = null;
        self.tmpTransitionline = null;
        self.preventStateDragging = false;
        //update the svgOuter listeners
        self.addSvgOuterClickListener();
        self.svgOuter.on("mousemove", null);
        //update state listeners
        d3.selectAll(".state").on("mouseover", null);
        d3.selectAll(".state").on("mouseleave", null);
        d3.selectAll('.state').on('click', self.openStateMenu);
        //openTransitionMenu
        self.openTransitionMenu(tmpTransition.id);
    };

    /**
     * Modify a transition
     * @param {object} transition     the transition
     * @param {char}   newTransitionName the new transitionName
     * @param newWriteSymbol
     * @param newMoveDirection
     */
    self.modifyTransition = function (transition, newTransitionName, newWriteSymbol, newMoveDirection) {
        //change it in drawnTransition
        var drawnTransition = $scope.getDrawnTransition(transition.fromState, transition.toState);
        var drawnTransitionName = _.find(drawnTransition.names, {
            "id": transition.id
        });
        drawnTransitionName.name = newTransitionName;
        drawnTransitionName.writeSymbol = newWriteSymbol;
        drawnTransitionName.moveDirection = newMoveDirection;

        //change it on the svg
        self.writeTransitionText(drawnTransition.objReference.select(".transition-text"), drawnTransition.names);
    };

    /**
     * Adds the transition names to the text of a transition
     * @param {object} textObj the transition textObjReference
     * @param {object}  names   the names array of the transition
     */
    self.writeTransitionText = function (textObj, names) {
        textObj.selectAll("*").remove();
        for (var i = 0; i < names.length; i++) {
            //fix when creating new transition when in animation
            if ($scope.simulator.animated.transition !== null && names[i].id === $scope.simulator.animated.transition.id) {
                textObj.append('tspan').attr('transition-id', names[i].id).text(names[i].name).classed("animated-transition-text", true).attr("style", "font-family:" + $scope.defaultConfig.font + ";");
            } else {
                textObj.append('tspan').attr('transition-id', names[i].id).text(names[i].name + ' | ' + names[i].writeSymbol + ', ' + names[i].moveDirection).attr("style", "font-family:" + $scope.defaultConfig.font + ";");
            }

            if (i < names.length - 1)
                textObj.append('tspan').text(' | ').attr("style", "font-family:" + $scope.defaultConfig.font + ";");
        }

    };

    /**For better overwriting**/
    self.createDrawnTransitionNameObject = function (transition) {
        return {
            "id": transition.id,
            "name": transition.name,
            "writeSymbol": transition.writeSymbol,
            "moveDirection": transition.moveDirection
        };
    };

    /**
     * opens the transitionMenu
     * @param {number} transitionId when there is a transitionId we open the transitionmenu with the given id
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
            var tmp = tmpObject.writeSymbol;
            tmpObject.writeSymbol = {};
            tmpObject.writeSymbol.value = tmp;
            tmpObject.writeSymbol.error = false;

            tmp = tmpObject.moveDirection;
            tmpObject.moveDirection = {};
            tmpObject.moveDirection.value = tmp;
            tmpObject.moveDirection.error = false;

            if (transitionId !== undefined) {
                if (value.id == transitionId) {
                    tmpObject.isFocus = true;
                }
            } else if (self.selectedTransition.names.length - 1 === key) {
                tmpObject.isFocus = true;

            }
            tmpObject.isUnique = true;
            //add other variables
            tmpObject.error = false;
            self.input.transitions.push(tmpObject);
        });

        self.transitionMenuListener = [];

        /*jshint -W083 */
        for (var i = 0; i < self.input.transitions.length; i++) {
            self.transitionMenuListener.push($scope.$watch("statediagram.input.transitions['" + i + "']", function (newValue, oldValue) {
                var nameErrorFound = false, writeSymbolErrorFound = false, moveDirectionErrorFound = false;
                if (newValue.name !== oldValue.name) {
                    newValue.error = false;
                    if (newValue.name !== "" && !$scope.existsTransition(fromState, toState, newValue.name)) {
                        $scope.modifyTransition(newValue.id, newValue.name, newValue.writeSymbol.value, newValue.moveDirection.value);
                    } else if (newValue.name === "") {
                        newValue.error = true;
                        nameErrorFound = true;
                    }
                }
                if (newValue.writeSymbol.value !== oldValue.writeSymbol.value) {
                    newValue.writeSymbol.error = false;
                    if (newValue.writeSymbol.value !== "" && !$scope.existsTransition(fromState, toState, newValue.name, newValue.writeSymbol.value, newValue.moveDirection.value)) {
                        $scope.modifyTransition(newValue.id, newValue.name, newValue.writeSymbol.value, newValue.moveDirection.value);
                    } else if (newValue.writeSymbol.value === "") {
                        newValue.writeSymbol.error = true;
                        writeSymbolErrorFound = true;
                    }

                }
                if (newValue.moveDirection.value !== oldValue.moveDirection.value) {
                    newValue.moveDirection.error = false;
                    if (newValue.moveDirection.value !== "" && !$scope.existsTransition(fromState, toState, newValue.name, newValue.writeSymbol.value, newValue.moveDirection.value)) {
                        $scope.modifyTransition(newValue.id, newValue.name, newValue.writeSymbol.value, newValue.moveDirection.value);
                    } else if (newValue.moveDirection.value === "") {
                        newValue.moveDirection.error = true;
                        moveDirectionErrorFound = true;
                    }

                }
                if ($scope.existsTransition(fromState, toState, newValue.name, newValue.writeSymbol.value, newValue.moveDirection.value, newValue.id)) {
                    newValue.isUnique = false;
                    newValue.error = true;
                    newValue.writeSymbol.error = true;
                    newValue.moveDirection.error = true;
                } else {
                    if (!newValue.isUnique) {
                        newValue.error = nameErrorFound ? true : false;
                        newValue.writeSymbol.error = writeSymbolErrorFound ? true : false;
                        newValue.moveDirection.error = moveDirectionErrorFound ? true : false;
                    }
                    newValue.isUnique = true;

                }
            }, true));
        }

        $scope.safeApply();

    };
}