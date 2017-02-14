autoSim.directive("ownlangsvg", function () {
    return {
        transclude: true,
        replace: true,
        link: function (scope, elm, attrs) {
            
            scope.derivationtree.svg = d3.select('#diagram-svg');
            elm.on('contextmenu', function () {
                event.preventDefault();
                if (!scope.derivationtree.menu.preventSvgContextClick) {
                    scope.states.menu.close();
                    scope.derivationtree.menu.context.open();
                } else {

                }
                scope.derivationtree.menu.preventSvgContextClick = false;
            }).on('click', function () {
                console.log('click');
                event.preventDefault();
                /*
                if (!scope.derivationtree.menu.preventSvgOuterClick && !scope.derivationtree.inCreateTransition) {
                    scope.transitions.menu.close();
                    scope.states.menu.close();
                    scope.derivationtree.menu.context.close();
                }
                */
                // scope.derivationtree.menu.preventSvgOuterClick = false;
            });


            //add listener
            window.addEventListener('resize', function () {
                scope.derivationtree.updateWidthAndHeight();
            });
        },
        templateUrl: 'components/language/directives/svg/own-lang-svg.html'
    };
});

autoSim.directive("svglanggrid", function () {
    return {
        replace: true,
        restrict: 'E',
        templateNamespace: 'svg',
        link: function (scope, elm, attrs) {

            scope.derivationtree.grid.draw();

        },
        templateUrl: 'components/language/directives/svg/svg-lang-grid.html'
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
        templateUrl: 'components/language/directives/svg/svg-nonTerminal.html'
    };
});
/*
autoSim.directive("svglangouter", function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        templateNamespace: 'svg',
        link: function (scope, elm, attrs) {
            scope.DerivationTree.svgOuter = d3.select("#diagram-svg");
            d3.select("#diagram-svg").call(scope.DerivationTree.zoom.behaviour);

        },
        templateUrl: 'components/language/directives/svg/svg-lang-outer.html'
    };
});
*/
autoSim.directive("svglangdefinitions", function () {
    return {
        restrict: 'E',
        replace: true,
        templateNamespace: 'svg',
        templateUrl: 'components/language/directives/svg/svg-lang-definitions.html'
    };
});