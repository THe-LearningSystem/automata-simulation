autoSim.directive("langmenubutton", function () {
    return {
        restrict: 'EA',
        replace: true,
        transclude: false,
        scope: {
            icon: '@',
            action: '&',
            tttext: '@'
        },
        template: '<button class="menu-button btn btn-default" type="button" ng-click="action()" aria-label="Left Align"  uib-tooltip="{{tttext | translate}}" tooltip-placement="bottom"><span class="icon icon-{{icon}} icon-position" aria-hidden="true"></span></button>'
    };
});

autoSim.directive("containeritem", function () {

    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        link: function (scope, elm, attrs) {
            if (scope.extendableRaw == undefined || scope.extendableRaw != false) {
                scope.extendable = true;
            } else {
                scope.extendable = false;
            }
            scope.extended = true;

            scope.toggle = function () {
                if (scope.extendable)
                    scope.extended = !scope.extended;
            };
        },
        scope: {
            titlename: '@',
            extendableRaw: '='
        },
        templateUrl: 'components/language/directives/lang-container-item.html'
    };

});

autoSim.directive("langzoomtooltip", function () {
    return {
        replace: true,
        templateUrl: 'components/language/directives/lang-zoom-tooltip.html'
    };
});

autoSim.directive("langdevelop", function () {
    return {
        templateUrl: 'components/language/directives/lang-develop.html'
    };
});

autoSim.directive("langprogramsettings", function () {
    return {
        templateUrl: 'components/language/directives/lang-generalSettings.html'
    };
});

autoSim.directive("langgrammar", function () {
    return {
        templateUrl: 'components/language/directives/lang-grammar.html'
    };
});

autoSim.directive("langderivationsequence", function () {
    return {
        templateUrl: 'components/language/directives/lang-derivationsequence.html'
    };
});

autoSim.directive("languagename", function () {
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

autoSim.directive("langtopmenu", function () {
    return {
        templateUrl: 'components/language/directives/lang-top-menu.html'
    };
});

autoSim.directive("langaddnewmenu", function () {
    return {
        templateUrl: 'components/language/directives/lang-addNew-menu.html'
    };
});

autoSim.directive("langchangesmenu", function () {
    return {
        templateUrl: 'components/language/directives/lang-changes-menu.html'
    };
});

autoSim.directive("langsimulation", function () {
    return {
        templateUrl: 'components/language/directives/lang-simulation.html'
    };
});
