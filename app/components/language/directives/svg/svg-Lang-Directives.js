//Directive for derivationtree and its options.
autoSim.directive("ownlangsvg", function () {
    return {
        transclude: true,
        replace: true,
        link: function (scope, elm, attrs) {
            
            scope.derivationtree.svg = d3.select('#diagram-lang-svg');
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

autoSim.directive("svgtest", function () {
    return {
        replace: true,
        restrict: 'E',
        scope: {
            production: '=production'
        },
        templateNamespace: 'svg',
        link: function (scope, elm, attrs) {
            var self = this;
            scope.productions = scope.$parent.productions;
            scope.simulator = scope.$parent.simulator;
        }
        ,
        templateUrl: 'components/language/directives/svg/svg-Test.html'
    };
});