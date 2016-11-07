autoSim.directive("own-lang-svg", function () {
    return {
        transclude: true,
        replace: true,
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