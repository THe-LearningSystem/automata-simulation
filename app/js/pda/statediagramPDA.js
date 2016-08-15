//statediagram for the PDA
function StateDiagramPDA($scope, svgSelector) {
    "use strict";

    var self = this;
    StateDiagramDFA.apply(self, arguments);
    self.transitionTextLength = 27;
    self.selfTransitionTextLength = 30;

    //TODO: only first version needs rework
    self.drawnStack = [];
    self.svgStack = self.svgOuter.append("g");
    self.stackWidth = 75;
    self.stackHeight = 120;
    self.stackPaddingToBorder = 20;

    self.updateStackPosition = function () {
        self.svgStack.attr("transform", "translate(" + self.svgOuterWidth + " " + self.svgOuterHeight + ")");
    };

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


    self.addToStack = function (character) {
        var stackItemHeight = 20;
        var group = self.svgStack.append("g");
        var rectangle = group.append("rect").attr("class", "stack-item").attr("x", -self.stackWidth - self.stackPaddingToBorder + 1).attr("y", -self.stackPaddingToBorder - (stackItemHeight * (self.drawnStack.length + 1)) - 1).attr("width", 75 - 2).attr("height", stackItemHeight);
        //var stackElement = group.append("text").text(character).attr("class", "stack-text").attr("dominant-baseline", "central").attr("text-anchor", "middle").attr("x", width - 82).attr("y", height - 25 - 25 * self.drawnStack.length);
        self.drawnStack.push(group);
    };

    self.removeFromStack = function () {
        self.drawnStack.pop().remove();

    };
    self.drawStack();

    //redraw the stack if the browser was resized
    window.addEventListener('resize', function (event) {
        self.updateStackPosition();
    });

    //update the stack position when everything is already loaded
    $(window).bind("load", function () {
        self.updateStackPosition();
    });

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
     * @param {number} fromState         the fromStateId
     * @param {number} toState           the toStateID
     * @param {number} transitionId      the transitionid
     * @param {char}   newTransitionName the new transitionname
     * @param newReadFromStack
     * @param newWriteToStack
     */
    self.modifyTransition = function (fromState, toState, transitionId, newTransitionName, newReadFromStack, newWriteToStack) {
        //change it in drawnTransition
        var drawnTransition = $scope.getDrawnTransition(fromState, toState);
        var drawnTransitionName = _.find(drawnTransition.names, {
            "id": transitionId
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
    self.writeTransitionText = function (textObj, names) {
        textObj.selectAll("*").remove();
        for (var i = 0; i < names.length; i++) {
            //fix when creating new transition when in animation
            if ($scope.simulator.animated.transition !== null && names[i].id === $scope.simulator.animated.transition.id) {
                textObj.append('tspan').attr('transition-id', names[i].id).text(names[i].name).classed("animated-transition-text", true);
            } else {
                textObj.append('tspan').attr('transition-id', names[i].id).text(names[i].name + ', ' + names[i].readFromStack + '; ' + names[i].writeToStack);
            }

            if (i < names.length - 1)
                textObj.append('tspan').text(' | ');
        }

    };

    /**For better overriting**/
    self.createDrawnTransitionNameObject = function (transition) {
        return {
            "id": transition.id,
            "name": transition.name,
            "readFromStack": transition.readFromStack,
            "writeToStack": transition.writeToStack
        };
    };

    /**
     * opens the transitionmenu
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
            var tmpObject = cloneObject(value);

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
            self.transitionMenuListener.push($scope.$watchCollection("statediagram.input.transitions['" + i + "']", function (newValue, oldValue) {
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
                    if (newValue.readFromStack !== "" && !$scope.existsTransition(fromState, toState, newValue.name, newValue.readFromStack, newValue.writeToStack)) {
                        $scope.modifyTransition(newValue.id, newValue.name, newValue.readFromStack, newValue.writeToStack);
                    }

                }
                if (newValue.writeToStack !== oldValue.writeToStack) {
                    if (newValue.writeToStack !== "" && !$scope.existsTransition(fromState, toState, newValue.name, newValue.readFromStack, newValue.writeToStack)) {
                        $scope.modifyTransition(newValue.id, newValue.name, newValue.readFromStack, newValue.writeToStack);
                    }
                }
            }));
        }

        $scope.safeApply();

    };
}