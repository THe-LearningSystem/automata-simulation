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
                console.log('click');
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
        templateNamespace: 'svg',
        link: function (scope, elm, attrs) {
            var self = this;
            scope.states = scope.$parent.states;
            scope.simulator = scope.$parent.simulator;


            /**DRAGGING**/
            var dragAmount;

            scope.startStateDragging = function () {
                scope.draggingPrevent = false;
                dragAmount = 0;
                if (!scope.$parent.statediagram.inCreateTransition) {
                    scope.states.menu.edit.open(scope.states.getById(parseInt(d3.select(this).attr("object-id"))));
                    scope.states.selected = scope.states.getById(parseInt(d3.select(this).attr("object-id")));
                } else {
                    scope.draggingPrevent = true;
                }

            };

            //the space between each SnappingPoint 1:(0,0)->2:(0+gridSpace,0+gridSpace)
            self.gridSpace = 100;
            //the distance when the state is snapped to the next SnappingPoint (Rectangle form)
            self.gridSnapDistance = 20;
            //is Grid drawn
            self.isGrid = true;
            //user can snap the states to the grid -> toggles snapping
            scope.stateDragging = function () {
                dragAmount++;
                if (dragAmount > 1 && !scope.draggingPrevent) {
                    var x = d3.event.x;
                    var y = d3.event.y;
                    if (scope.$parent.statediagram.grid.snapping) {
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
                    scope.$apply(function () {
                        console.log("Dragged");
                        scope.states.moveState(scope.states.selected, x, y);
                    });

                }
            };

            scope.endStateDragging = function () {

            };

            d3.selectAll('.state').call(d3.drag()
                .on("start", scope.startStateDragging)
                .on("drag", scope.stateDragging)
                .on("end", scope.endStateDragging));

            d3.selectAll('.state').on('contextmenu', scope.$parent.states.menu.context.openHandler).on('click', scope.$parent.states.menu.edit.openHandler);

        }

        ,
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
            scope.automatonData = scope.$parent.automatonData;

            scope.transitionGroup.svgConfig = scope.$parent.transitions.getTransitionSvgConfig(scope.transitionGroup);

            scope.startDrag = function () {
                if (d3.event != null && d3.event.stopPropagation !== undefined)
                    d3.event.stopPropagation();
                scope.transitions.menu.edit.open(
                    scope.transitions.getTransitionGroup(
                        scope.$parent.states.getById(parseInt(d3.select(this).attr("from-state-id"))),
                        scope.$parent.states.getById(parseInt(d3.select(this).attr("to-state-id")))));

            };

            scope.drag = function () {

            };

            scope.endDrag = function () {

            };
            d3.selectAll('.transition').call(d3.drag().on('start', scope.startDrag).on('drag', scope.drag).on('end', scope.endDrag));

            d3.selectAll('.transition').on('click', scope.transitions.menu.edit.open);
        },
        templateUrl: 'components/automata/directives/svg/svg-transition.html'
    }
        ;
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
        link: function (scope, elm, attrs) {

            scope.statediagram.grid.draw();

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
autoSim.directive("changeInputFieldValue", function () {
    return {
        restrict: 'E',
        scope: {
            char: '@char'
        },
        link: function (scope, elm, attrs) {
            scope.saveApply = scopeSaveApply;
            scope.changeInputFieldValue = function () {
                scope.saveApply(function () {
                    event.preventDefault();
                    var active = document.activeElement;
                    var element = document.getElementById(active.id);
                    if (element != null) {
                        element.value = scope.char;
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
        },
        template: '<button class="btn btn-default" ng-mousedown="changeInputFieldValue()">{{char}}</button>'
    };
});