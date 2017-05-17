//Directive for derivationtree and its options.
autoSim.directive("ownlangsvg", function () {
    return {
        transclude: true,
        replace: true,
        link: function (scope, elm, attrs) {

            scope.derivationtree.svg = d3.select('#diagram-lang-svg');
            elm.on('contextmenu', function () {
                event.preventDefault();
                scope.derivationtree.menu.preventSvgContextClick = false;
            }).on('click', function () {
                console.log('click');
                event.preventDefault();
            });


            //add listener
            window.addEventListener('resize', function () {
                scope.derivationtree.updateWidthAndHeight();
            });
        },
        templateUrl: 'components/language/directives/svg/own-lang-svg.html'
    };
});

//Directive for the grid.
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

autoSim.directive("svglangouter", function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        templateNamespace: 'svg',
        link: function (scope, elm, attrs) {
            scope.derivationtree.svgLangOuter = d3.select("#diagram-lang-svg");
            d3.select("#diagram-lang-svg").call(scope.derivationtree.zoom.behaviour);

        },
        templateUrl: 'components/language/directives/svg/svg-lang-outer.html'
    };
});

autoSim.directive("svglangnonterminal", function () {
    return {
        replace: true,
        restrict: 'E',
        templateNamespace: 'svg',
        scope: {
            production: '=production'
        },
        link: function (scope, elm, attrs) {
            var self = this;
            scope.productions = scope.$parent.productions;

            /**DRAGGING**/
            var dragAmount;

            scope.startProductionDragging = function () {

                scope.productions.selected = scope.productions.getById(parseInt(d3.select(this).attr("object-id")));
                scope.draggingPrevent = false;
                dragAmount = 0;
            };

            //the space between each SnappingPoint 1:(0,0)->2:(0+gridSpace,0+gridSpace)
            self.gridSpace = 100;
            //the distance when the state is snapped to the next SnappingPoint (Rectangle form)
            self.gridSnapDistance = 20;
            //is Grid drawn
            self.isGrid = true;
            //user can snap the production to the grid -> toggles snapping
            scope.productionDragging = function () {
                dragAmount++;
                if (dragAmount > 1 && !scope.draggingPrevent) {
                    var x = d3.event.x;
                    var y = d3.event.y;
                    if (scope.$parent.derivationtree.grid.snapping) {
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
                        scope.productions.moveProduction(scope.productions.selected, x, y);
                    });

                }
            };

            scope.endProductionDragging = function () {

            };

            d3.selectAll('.nonTerminal').call(d3.drag()
                .on("start", scope.startProductionDragging)
                .on("drag", scope.productionDragging)
                .on("end", scope.endProductionDragging));

        },
        templateUrl: 'components/language/directives/svg/svg-lang-nonTerminal.html'
    };
});

autoSim.directive("svglangterminal", function () {
    return {
        replace: true,
        restrict: 'E',
        templateNamespace: 'svg',
        /*
                scope: {
                    production: '=production',
                    rightProduction: '=rightProduction'
                },
        */
        link: function (scope, elm, attrs) {
            var self = this;
            scope.productions = scope.$parent.rightProduction;

            // *DRAGGING*
            var dragAmount;

            scope.startProductionDragging = function () {

                console.log(scope.productions.getById(parseInt(d3.select(this).attr("object-id"))));
                scope.productions.selected = scope.productions.getById(parseInt(d3.select(this).attr("object-id")));
                scope.draggingPrevent = false;
                dragAmount = 0;
            };

            //the space between each SnappingPoint 1:(0,0)->2:(0+gridSpace,0+gridSpace)
            self.gridSpace = 100;
            //the distance when the state is snapped to the next SnappingPoint (Rectangle form)
            self.gridSnapDistance = 20;
            //is Grid drawn
            self.isGrid = true;
            //user can snap the production to the grid -> toggles snapping
            scope.productionDragging = function () {
                dragAmount++;
                if (dragAmount > 1 && !scope.draggingPrevent) {
                    var x = d3.event.x;
                    var y = d3.event.y;
                    if (scope.$parent.derivationtree.grid.snapping) {
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
                        scope.productions.moveRight(scope.productions.selected, x, y);
                    });

                }
            };

            scope.endProductionDragging = function () {

            };

            d3.selectAll('.terminal').call(d3.drag()
                .on("start", scope.startProductionDragging)
                .on("drag", scope.productionDragging)
                .on("end", scope.endProductionDragging));

        },
        templateUrl: 'components/language/directives/svg/svg-lang-terminal.html'
    };
});

autoSim.directive("svglangtransition", function () {
    return {
        replace: true,
        restrict: 'E',
        templateNamespace: 'svg',
        link: function (scope, elm, attrs) {

        },
        templateUrl: 'components/language/directives/svg/svg-lang-transition.html'
    };
});
/*
autoSim.directive("svglangterminal", function () {
    return {
        replace: true,
        restrict: 'E',
        templateNamespace: 'svg',
        templateUrl: 'components/language/directives/svg/svg-lang-terminal.html'
    };
});
*/
