//statediagram for the svg diagram
autoSim.StateDiagram = function ($scope) {
    "use strict";
    var self = this;

    /**
     * update the width and the Height
     */
    self.updateWidthAndHeight = function () {
        $scope.saveApply(function () {
            self.svgWidth = self.svg.style("width").replace("px", "");
            self.svgHeight = self.svg.style("height").replace("px", "");
        });
    };


    self.getSvgWidth = function () {
        if (self.svg !== undefined)
            return self.svg.style("width").replace("px", "");
        else
            return 0
    };

    self.getSvgHeight = function () {
        if (self.svg !== undefined)
            return self.svg.style("height").replace("px", "");
        else
            return 0
    };

    /**
     * AddState -> creates a new state when clicked on the button with visual feedback
     */
    self.createState = function (e) {
        //add listener that the selectedState follows the mouse
        self.svgOuter.on("mousemove", function () {
            var position = self.getCleanedPositionValues(d3.mouse(this)[0], d3.mouse(this)[1]);
            $scope.states.selected.y = position.y;
            $scope.states.selected.x = position.x;
            $scope.saveApply();
        });
        //create a new selectedState in a position not viewable
        $scope.states.selected = $scope.states.createWithPresets(-10000, -10000);
        console.log($scope.states.selected);
        self.svgOuter.on("click", function () {
            self.svgOuter.on("mousemove", null);
            $scope.saveApply();
        });
    };


    self.tmpTransition = null;
    self.inCreateTransition = false;
    self.createTransition = function (fromState) {
        self.inCreateTransition = true;
        var approachTransitionGroup = undefined;
        self.tmpTransition = {};
        self.tmpTransition.fromState = fromState;
        var mouseInState = false;
        if (fromState === undefined) {
            d3.selectAll(".state").on("click", function () {
                d3.event.stopPropagation();
                var fromState = $scope.states.getById(parseInt(d3.select(this).attr("object-id")));
                self.createTransition(fromState);
            });
        } else {
            d3.selectAll('.state').on('click', null);
            d3.selectAll(".state").on("click", function () {
                var toState = $scope.states.getById(parseInt(d3.select(this).attr("object-id")));
                $scope.transitions.createWithDefaults(self.tmpTransition.fromState, toState);
                $scope.transitions.menu.edit.open($scope.transitions.getTransitionGroup(self.tmpTransition.fromState, toState));
                self.removeTmpTransition();
                $scope.$apply();
            }).on("mouseover", function () {
                mouseInState = true;
                var toState = $scope.states.getById(parseInt(d3.select(this).attr("object-id")));
                var tmpTransitionGroup = new autoSim.TransitionGroup(self.tmpTransition.fromState, toState);
                var svgConfig = $scope.transitions.getTransitionSvgConfig(tmpTransitionGroup);
                approachTransitionGroup = $scope.transitions.getTransitionGroup(toState, self.tmpTransition.fromState);
                $scope.$apply(function () {
                    if (approachTransitionGroup !== undefined) {
                        approachTransitionGroup.svgConfig = $scope.transitions.getTransitionSvgConfig(approachTransitionGroup, true);
                    }
                    self.tmpTransition.path = svgConfig.path;
                });
            }).on("mouseleave", function () {
                $scope.$apply(function () {
                    if (approachTransitionGroup !== undefined)
                        approachTransitionGroup.svgConfig = $scope.transitions.getTransitionSvgConfig(approachTransitionGroup);
                });
                mouseInState = false;
            });
            d3.select("#diagram-svg").on("mousemove", function () {
                if (!mouseInState) {
                    var position = self.getCleanedPositionValues(d3.mouse(this)[0], d3.mouse(this)[1]);
                    var path = d3.path();
                    path.moveTo(self.tmpTransition.fromState.x, self.tmpTransition.fromState.y);
                    path.lineTo(position.x, position.y);
                    $scope.$apply(function () {
                        self.tmpTransition.path = path.toString();
                    });
                }
            });
        }
    };

    self.getCleanedPositionValues = function (x, y) {
        var obj = {};
        obj.x = ((x - $scope.automatonData.diagram.x) * (1 / $scope.automatonData.diagram.scale));
        obj.y = ((y - $scope.automatonData.diagram.y) * (1 / $scope.automatonData.diagram.scale));
        return obj;
    };

    /**
     * removes the tmpTransition -> when finished creating the new transition or when canceling the action
     */
    self.removeTmpTransition = function () {
        self.inCreateTransition = false;
        self.tmpTransition = null;
        d3.select("#diagram-svg").on("mousemove", null);
        d3.selectAll(".state").on("mouseover", null);
        d3.selectAll(".state").on("mouseleave", null);
        d3.selectAll('.state').on('click', $scope.states.menu.open);
    };

};