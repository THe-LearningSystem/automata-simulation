//statediagram for the PDA
function StateDiagramPDA($scope, svgSelector) {
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
        //stack
        self.svgStack = self.svgOuter.append("g");
        self.updateStackPosition();
        self.drawStack();


    };

    //Stack variables
    self.drawnStack = [];
    self.stackWidth = 75;
    self.stackHeight = 120;
    self.stackPaddingToBorder = 20;


    /**
     * update the stack position;
     */
    self.updateStackPosition = function () {
        self.svgStack.attr("transform", "translate(" + self.svgOuterWidth + " " + self.svgOuterHeight + ")");
    };

    /**
     * draw the stack on the svg
     */
    self.drawStack = function () {
        //Draw the stackContainer
        self.svgStack.append("line")
            .attr("class", "stack")
            .attr("x1", -self.stackWidth - self.stackPaddingToBorder)
            .attr("y1", -self.stackHeight - self.stackPaddingToBorder)
            .attr("x2", -self.stackWidth - self.stackPaddingToBorder)
            .attr("y2", -self.stackPaddingToBorder);
        self.svgStack.append("line")
            .attr("class", "stack")
            .attr("x1", -self.stackWidth - self.stackPaddingToBorder)
            .attr("y1", -self.stackPaddingToBorder)
            .attr("x2", -self.stackPaddingToBorder)
            .attr("y2", -self.stackPaddingToBorder);
        self.svgStack.append("line")
            .attr("class", "stack")
            .attr("x1", -self.stackPaddingToBorder)
            .attr("y1", -self.stackPaddingToBorder)
            .attr("x2", -self.stackPaddingToBorder)
            .attr("y2", -self.stackHeight - self.stackPaddingToBorder);
    };

    /**
     * Add an item to the drawn stack
     * @param character
     */
    self.addToStack = function (character) {
        var stackItemHeight = 20;
        var group = self.svgStack.append("g");
        group.append("rect").attr("class", "stack-item").attr("x", -self.stackWidth - self.stackPaddingToBorder + 1).attr("y", -self.stackPaddingToBorder - (stackItemHeight * (self.drawnStack.length + 1)) - 1).attr("width", 75 - 2).attr("height", stackItemHeight);
        group.append("text").text(character).attr("class", "stack-text").attr("dominant-baseline", "central").attr("text-anchor", "middle").attr("x", -55).attr("y", -28 - 20 * self.drawnStack.length);
        self.drawnStack.push(group);
    };

    /**
     * Removes the last item from the drawn stack
     */
    self.removeFromStack = function () {
        self.drawnStack.pop().remove();
    };

    //redraw the stack if the browser was resized
    window.addEventListener('resize', function () {
        self.updateStackPosition();
    });


    /**
     * creates a transition
     * @param fromState
     * @param toState
     */
    self.createTransition = function (fromState, toState) {
        var tmpTransition = $scope.addTransition(fromState, toState, $scope.getNextTransitionName(self.selectedState.id), "X", "Y");
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
     * @param newReadFromStack
     * @param newWriteToStack
     */
    self.modifyTransition = function (transition, newTransitionName, newReadFromStack, newWriteToStack) {
        //change it in drawnTransition
        var drawnTransition = $scope.getDrawnTransition(transition.fromState, transition.toState);
        var drawnTransitionName = _.find(drawnTransition.names, {
            "id": transition.id
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
     * @param {object}  names   the names array of the transition
     */
    self.writeTransitionText = function (textObj, names) {
        textObj.selectAll("*").remove();
        for (var i = 0; i < names.length; i++) {
            //fix when creating new transition when in animation
            if ($scope.simulator.animated.transition !== null && names[i].id === $scope.simulator.animated.transition.id) {
                textObj.append('tspan').attr('transition-id', names[i].id).text(names[i].name).classed("animated-transition-text", true).attr("style", "font-family:" + $scope.defaultConfig.font + ";");
            } else {
                textObj.append('tspan').attr('transition-id', names[i].id).text(names[i].name + ', ' + names[i].readFromStack + '; ' + names[i].writeToStack).attr("style", "font-family:" + $scope.defaultConfig.font + ";");
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
            "readFromStack": transition.readFromStack,
            "writeToStack": transition.writeToStack
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
            var tmp = tmpObject.readFromStack;
            tmpObject.readFromStack = {};
            tmpObject.readFromStack.value = tmp;
            tmpObject.readFromStack.error = false;

            tmp = tmpObject.writeToStack;
            tmpObject.writeToStack = {};
            tmpObject.writeToStack.value = tmp;
            tmpObject.writeToStack.error = false;

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
                var nameErrorFound = false, readFromStackErrorFound = false, writeToStackErrorFound = false;
                if (newValue.name !== oldValue.name) {
                    newValue.error = false;
                    if (newValue.name !== "" && !$scope.existsTransition(fromState, toState, newValue.name)) {
                        $scope.modifyTransition(newValue.id, newValue.name, newValue.readFromStack.value, newValue.writeToStack.value);
                    } else if (newValue.name === "") {
                        newValue.error = true;
                        nameErrorFound = true;
                    }
                }
                if (newValue.readFromStack.value !== oldValue.readFromStack.value) {
                    newValue.readFromStack.error = false;
                    if (newValue.readFromStack.value !== "" && !$scope.existsTransition(fromState, toState, newValue.name, newValue.readFromStack.value, newValue.writeToStack.value)) {
                        $scope.modifyTransition(newValue.id, newValue.name, newValue.readFromStack.value, newValue.writeToStack.value);
                    } else if (newValue.readFromStack.value === "") {
                        newValue.readFromStack.error = true;
                        readFromStackErrorFound = true;
                    }

                }
                if (newValue.writeToStack.value !== oldValue.writeToStack.value) {
                    newValue.writeToStack.error = false;
                    if (newValue.writeToStack.value !== "" && !$scope.existsTransition(fromState, toState, newValue.name, newValue.readFromStack.value, newValue.writeToStack.value)) {
                        $scope.modifyTransition(newValue.id, newValue.name, newValue.readFromStack.value, newValue.writeToStack.value);
                    } else if (newValue.writeToStack.value === "") {
                        newValue.writeToStack.error = true;
                        writeToStackErrorFound = true;
                    }

                }
                if ($scope.existsTransition(fromState, toState, newValue.name, newValue.readFromStack.value, newValue.writeToStack.value, newValue.id)) {
                    newValue.isUnique = false;
                    newValue.error = true;
                    newValue.readFromStack.error = true;
                    newValue.writeToStack.error = true;
                } else {
                    if (!newValue.isUnique) {
                        newValue.error = nameErrorFound;
                        newValue.readFromStack.error = readFromStackErrorFound;
                        newValue.writeToStack.error = writeToStackErrorFound;
                    }
                    newValue.isUnique = true;

                }
            }, true));
        }

        $scope.safeApply();

    };
}