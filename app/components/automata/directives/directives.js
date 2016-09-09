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
        template: '<button class="menu-button" type="button" ng-click="action()" aria-label="Left Align"  uib-tooltip="{{tttext | translate}}" tooltip-placement="bottom"><span class="icon icon-{{icon}} icon-position" aria-hidden="true"></span></button>'
    };
});

autoSim.directive("menuitemextendable", function () {

    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        controller: function ($scope) {
            $scope.extended = true;
        },
        scope: {
            titlename: '@'
        },
        template: '<div class="menu-item"><p class="left-indextab" ng-click="extended=!extended"><span class="icon-extendable icon-chevron-down icon-extendable-set" aria-hidden="true" ng-show="extended"></span><span class="icon-extendable icon-chevron-right icon-extendable-set" aria-hidden="true" ng-show="!extended"></span><span class="left-indextab-title">{{titlename | translate}}</span></p><div class="content" ng-transclude ng-show="extended"></div></div>'

    };

});
autoSim.directive("menuitem", function () {

    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            titlename: '@'
        },
        template: '<div class="menu-item"><p class="right-indextab right-indextab-title">{{titlename | translate}}</p><div class="content" ng-transclude></div></div>'

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
        link: function (scope, elm, attrs) {
            console.log(scope);
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
        templateUrl: 'components/automata/directives/zoom-tooltip.html'
    };
});
