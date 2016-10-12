/**DIRECTIVES**/

//menuButton
autoSim.directive("menubutton", function () {
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

autoSim.directive("containerItem", function () {

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
        templateUrl: 'components/automata/directives/container-item.html'
    };

});
autoSim.directive("simulation", function () {
    return {
        templateUrl: 'components/automata/directives/simulation.html'
    };
});
autoSim.directive("simulationSettings", function () {
    return {
        link: function (scope, elm, attrs) {
            /**
             * Options for the stepTimeOut-Slider
             */
            scope.stepTimeOutSlider = {
                options: {
                    floor: 0,
                    step: 100,
                    ceil: 3000,
                    hideLimitLabels: true,
                    translate: function (value) {
                        return value + ' ms';
                    }
                }
            };

            /**
             * Options for the loopTimeOut-Slider
             */
            scope.loopTimeOutSlider = {
                options: {
                    floor: 0,
                    step: 100,
                    ceil: 4000,
                    hideLimitLabels: true,
                    translate: function (value) {
                        return value + ' ms';
                    }
                }
            };
        },
        templateUrl: 'components/automata/directives/simulation-settings.html'
    };
});
autoSim.directive("topMenu", function () {
    return {
        link: function (scope, elm, attrs) {
            //TODO:LATER
            // scope.portation.addInputListener();
        },
        templateUrl: 'components/automata/directives/top-menu.html'
    };
});
autoSim.directive("develop", function () {
    return {
        templateUrl: 'components/automata/directives/develop.html'
    };
});
autoSim.directive("automatonName", function () {
    return {
        replace: true,
        link: function (scope, elm, attrs) {
            /**
             * Leave the input field after clicking the enter button
             */
            scope.keypressCallback = function ($event) {
                if ($event.charCode == 13) {
                    document.getElementById("automatonNameEdit").blur();
                }
            };


        },
        templateUrl: 'components/automata/directives/automaton-name.html'
    };
});

autoSim.directive("ownTable", function () {
    return {
        templateUrl: 'components/automata/directives/own-table.html'
    };
});
autoSim.directive("stateTransitionFunction", function () {
    return {
        templateUrl: 'components/automata/directives/state-transition-function.html'
    };
});
autoSim.directive("stateMenu", function () {
    return {
        templateUrl: 'components/automata/directives/state-menu.html'
    };
});
autoSim.directive("transitionMenu", function () {
    return {
        templateUrl: 'components/automata/directives/transition-menu.html'
    };
});
autoSim.directive("settings", function () {
    return {
        templateUrl: 'components/automata/directives/settings.html'
    };
});


autoSim.directive("contextMenu", function () {
    return {
        templateUrl: 'components/automata/directives/context-menu.html'
    };
});
autoSim.directive("zoomTooltip", function () {
    return {
        replace: true,
        templateUrl: 'components/automata/directives/zoom-tooltip.html'
    };
});


autoSim.directive("unsavedChanges", function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        templateUrl: 'components/automata/directives/unsaved-changes.html'

    };

});
