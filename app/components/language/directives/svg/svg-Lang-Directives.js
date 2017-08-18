//Directive for derivationtree and its options.
autoSim.directive("ownlangsvg", function () {
    return {
        transclude: true,
        replace: true,
        link: function (scope, elm, attrs) {

            scope.langDerivationtree.svg = d3.select('#diagram-lang-svg');
            elm.on('contextmenu', function () {
                event.preventDefault();
                scope.langDerivationtree.menu.preventSvgContextClick = false;
            }).on('click', function () {
                console.log('click');
                event.preventDefault();
            });


            //add listener
            window.addEventListener('resize', function () {
                scope.langDerivationtree.updateWidthAndHeight();
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

            scope.langDerivationtree.grid.draw();

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
            scope.langDerivationtree.svgLangOuter = d3.select("#diagram-lang-svg");
            d3.select("#diagram-lang-svg").call(scope.langDerivationtree.zoom.behaviour);

        },
        templateUrl: 'components/language/directives/svg/svg-lang-outer.html'
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

autoSim.directive("svgproductionrule", function () {
    return {
        replace: true,
        restrict: 'E',
        templateNamespace: 'svg',
        link: function (scope, elm, attrs) {

        },
        templateUrl: 'components/language/directives/svg/svg-lang-production-rule.html'
    };
});
