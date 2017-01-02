autoSim.directive("ownLangSvg", function () {
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

autoSim.directive("svgLangGrid", function () {
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