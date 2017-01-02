autoSim.directive("langdevelop", function () {
    return {
        templateUrl: 'components/language/directives/lang-develop.html'
    };
});

autoSim.directive("langgrammar", function () {
    return {
        templateUrl: 'components/language/directives/lang-grammar.html'
    };
});

autoSim.directive("langderivationsequence", function () {
    return {
        templateUrl: 'components/language/directives/lang-derivation-sequence.html'
    };
});

autoSim.directive("langZoomTooltip", function () {
    return {
        replace: true,
        templateUrl: 'components/language/directives/lang-zoom-tooltip.html'
    };
});