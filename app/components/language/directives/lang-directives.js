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

autoSim.directive("languageName", function () {
    return {
        replace: true,
        link: function (scope, elm, attrs) {
            /**
             * Leave the input field after clicking the enter button
             */
            scope.keypressCallback = function ($event) {
                if ($event.charCode == 13) {
                    document.getElementById("languageNameEdit").blur();
                }
            };


        },
        templateUrl: 'components/language/directives/lang-languagename.html'
    };
});