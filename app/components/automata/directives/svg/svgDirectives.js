autoSim.directive("ownSvg", function () {
    return {
        link: function (scope, elm, attrs) {
            scope.statediagram.svg = d3.select('#diagram-svg');
            elm.on('contextmenu', function () {
                event.preventDefault();
                if (!scope.statediagram.menu.preventSvgContextClick) {
                    scope.states.menu.close();
                    scope.statediagram.menu.context.open();
                } else {

                }
                scope.statediagram.menu.preventSvgContextClick = false;
            }).on('click', function () {
                event.preventDefault();
                if (!scope.statediagram.menu.preventSvgOuterClick && !scope.statediagram.inCreateTransition) {
                    scope.transitions.menu.close();
                    scope.states.menu.close();
                    scope.statediagram.menu.context.close();
                }
                scope.statediagram.menu.preventSvgOuterClick = false;
            });


            //add listener
            window.addEventListener('resize', function () {
                scope.statediagram.updateWidthAndHeight();
            });
        },
        templateUrl: 'components/automata/directives/svg/own-svg.html'
    };
});

autoSim.directive("svgDefinitions", function () {
    return {
        restrict: 'E',
        replace: true,
        templateNamespace: 'svg',
        templateUrl: 'components/automata/directives/svg/svg-definitions.html'
    };
});


autoSim.directive("svgOuter", function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        templateNamespace: 'svg',
        link: function (scope, elm, attrs) {
            scope.statediagram.svgOuter = d3.select("#diagram-svg");
            d3.select("#diagram-svg").call(scope.statediagram.zoom.behaviour);

        },
        templateUrl: 'components/automata/directives/svg/svg-outer.html'
    };
});
autoSim.directive("svgState", function () {
    return {
        replace: true,
        restrict: 'E',
        scope: {
            state: '=state'
        },
        link: function (scope, elm, attrs) {
            var self = this;
            scope.states = scope.$parent.states;
            scope.simulator = scope.$parent.simulator;


            /**DRAGGING**/
            var dragAmount;

            function startStateDragging() {
                dragAmount = 0;
                scope.states.menu.edit.open(scope.states.getById(parseInt(d3.select(this).attr("object-id"))));
                scope.states.selected = scope.states.getById(parseInt(d3.select(this).attr("object-id")));

            }

            //the space between each SnappingPoint 1:(0,0)->2:(0+gridSpace,0+gridSpace)
            self.gridSpace = 100;
            //the distance when the state is snapped to the next SnappingPoint (Rectangle form)
            self.gridSnapDistance = 20;
            //is Grid drawn
            self.isGrid = true;
            //user can snap the states to the grid -> toggles snapping
            self.snapping = true;
            function stateDragging() {
                dragAmount++;
                var x = d3.event.x;
                var y = d3.event.y;
                if (self.snapping) {
                    var snapPointX = x - (x % self.gridSpace);
                    var snapPointY = y - (y % self.gridSpace);
                    //check first snapping Point (top left)
                    if (x > snapPointX - self.gridSnapDistance && x < snapPointX + self.gridSnapDistance &&
                        y > snapPointY - self.gridSnapDistance && y < snapPointY + self.gridSnapDistance) {
                        x = snapPointX;
                        y = snapPointY;
                        //second snapping point (top right)
                    } else if (x > snapPointX + self.gridSpace - self.gridSnapDistance &&
                        x < snapPointX + self.gridSpace + self.gridSnapDistance &&
                        y > snapPointY - self.gridSnapDistance &&
                        y < snapPointY + self.gridSnapDistance) {
                        x = snapPointX + self.gridSpace;
                        y = snapPointY;
                        //third snapping point (bot left)
                    } else if (x > snapPointX - self.gridSnapDistance &&
                        x < snapPointX + self.gridSnapDistance &&
                        y > snapPointY + self.gridSpace - self.gridSnapDistance &&
                        y < snapPointY + self.gridSpace + self.gridSnapDistance) {
                        x = snapPointX;
                        y = snapPointY + self.gridSpace;
                        //fourth snapping point (bot right)
                    } else if (x > snapPointX + self.gridSpace - self.gridSnapDistance &&
                        x < snapPointX + self.gridSpace + self.gridSnapDistance &&
                        y > snapPointY + self.gridSpace - self.gridSnapDistance &&
                        y < snapPointY + self.gridSpace + self.gridSnapDistance) {
                        x = snapPointX + self.gridSpace;
                        y = snapPointY + self.gridSpace;
                    }
                }
                if (dragAmount > 1) {
                    scope.$apply(function () {
                        scope.states.moveState(scope.states.selected, x, y);
                    });
                }
            }

            function endStateDragging() {

            }

            var stateDraggingBehaviour = d3.drag()
                .on("start", startStateDragging)
                .on("drag", stateDragging)
                .on("end", endStateDragging);


            elm.on('contextmenu', scope.$parent.states.menu.context.openHandler).on('click', scope.$parent.states.menu.edit.openHandler);


            d3.selectAll(".state").call(stateDraggingBehaviour);
        },
        templateUrl: 'components/automata/directives/svg/svg-state.html'
    };
});
autoSim.directive("svgTransition", function () {
    return {
        replace: true,
        restrict: 'E',
        scope: {
            transitionGroup: '=transitionGroup'
        },
        link: function (scope, elm, attrs) {
            scope.transitions = scope.$parent.transitions;
            scope.simulator = scope.$parent.simulator;

            scope.transitionGroup.svgConfig = scope.$parent.transitions.getTransitionSvgConfig(scope.transitionGroup);

            elm.on('click', function () {
                scope.$apply(scope.transitions.menu.edit.open(scope.transitionGroup));
            });
        },
        templateUrl: 'components/automata/directives/svg/svg-transition.html'
    };
});
autoSim.directive("svgTmpTransition", function () {
    return {
        replace: true,
        restrict: 'E',
        templateNamespace: 'svg',
        link: function (scope, elm, attrs) {

        },
        templateUrl: 'components/automata/directives/svg/svg-tmp-transition.html'
    };
});
autoSim.directive("svgGrid", function () {
    return {
        replace: true,
        restrict: 'E',
        templateNamespace: 'svg',
        scope: {},
        link: function (scope, elm, attrs) {

            self.container = d3.select("#svg-grid");
            //the space between each SnappingPoint 1:(0,0)->2:(0+gridSpace,0+gridSpace)
            self.spaceBetweenSnappingPoint = 100;
            //the distance when the state is snapped to the next SnappingPoint (Rectangle form)
            self.snapDistance = 20;
            //is Grid drawn
            self.isGrid = true;
            /**
             * Draw the Grid
             */
            scope.draw = function () {
                console.log(self.grid.container);
                self.container.html("");
                if (self.isGrid) {
                    //clear grid
                    var thickness = 1 * $scope.automatonData.diagram.scale * 0.5;
                    var xOffset = ($scope.automatonData.diagram.x % (self.spaceBetweenSnappingPoint * $scope.automatonData.diagram.scale));
                    var yOffset = ($scope.automatonData.diagram.y % (self.spaceBetweenSnappingPoint * $scope.automatonData.diagram.scale));
                    var i;
                    //xGrid
                    for (i = xOffset; i < self.svgOuterWidth; i += self.spaceBetweenSnappingPoint * $scope.automatonData.diagram.scale) {
                        self.grid.container.append("line").attr("stroke-width", thickness).attr("class", "grid-line xgrid-line").attr("x1", i).attr("y1", 0).attr("x2", i).attr("y2", self.svgOuterHeight);
                    }
                    //yGrid
                    for (i = yOffset; i < self.svgOuterHeight; i += self.spaceBetweenSnappingPoint * $scope.automatonData.diagram.scale) {
                        self.grid.container.append("line").attr("stroke-width", thickness).attr("class", "grid-line ygrid-line").attr("x1", 0).attr("y1", i).attr("x2", self.svgOuterWidth).attr("y2", i);
                    }
                } else {
                }

            };
        },
        templateUrl: 'components/automata/directives/svg/svg-grid.html'
    };
});
autoSim.directive("svgSaveAsPng", function () {
    return {
        restrict: 'E',
        scope: {},
        link: function (scope, elm, attrs) {
            /**
             * Saves the svg as a png
             */
            scope.saveAsPng = function () {
                saveSvgAsPng(document.getElementById("diagram-svg"), scope.$parent.automatonData.name + "." + scope.$parent.automatonData.type.toLowerCase() + ".png", {
                    scale: 4,
                    encoderOptions: 1
                });
            };
        },
        template: '<menubutton icon="camera" action="saveAsPng()" tttext="NAVBAR.TTTEXT_SAVEASPNG"></menubutton>'
    };
});