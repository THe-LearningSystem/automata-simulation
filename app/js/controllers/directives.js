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
autoSim.directive("bulkTest", function () {
    return {
        templateUrl: 'directives/bulk-tester.html'
    };
});
autoSim.directive("simulation", function () {
    return {
        templateUrl: 'directives/simulation.html'
    };
});
autoSim.directive("simulationSettings", function () {
    return {

        templateUrl: 'directives/simulation-settings.html'
    };
});
autoSim.directive("topMenu", function () {
    return {
        link: function (scope, elm, attrs) {
            scope.portation.addInputListener();
        },
        templateUrl: 'directives/top-menu.html'
    };
});
autoSim.directive("develop", function () {
    return {
        templateUrl: 'directives/develop.html'
    };
});
autoSim.directive("automatonName", function () {
    return {
        templateUrl: 'directives/automaton-name.html'
    };
});
autoSim.directive("modal", function () {
    return {
        templateUrl: 'directives/modal.html'
    };
});
autoSim.directive("ownTable", function () {
    return {
        templateUrl: 'directives/own-table.html'
    };
});
autoSim.directive("stateTransitionFunction", function () {
    return {
        templateUrl: 'directives/state-transition-function.html'
    };
});
autoSim.directive("stateMenu", function () {
    return {
        templateUrl: 'directives/state-menu.html'
    };
});
autoSim.directive("transitionMenu", function () {
    return {
        templateUrl: 'directives/transition-menu.html'
    };
});
autoSim.directive("settings", function () {
    return {
        templateUrl: 'directives/settings.html'
    };
});
autoSim.directive("credits", function () {
    return {
        templateUrl: 'directives/credits.html'
    };
});
autoSim.directive("ownSvg", function () {
    return {
        link: function (scope, elm, attrs) {
            scope.statediagram.init();
        },
        templateUrl: 'directives/own-svg.html'
    };
});

// to deFocus an field, when clicked on someOther place than the focused field
/* jshint -W030 */
autoSim.directive('showFocus', function ($timeout) {
    return function (scope, element, attrs) {
        scope.$watch(attrs.showFocus, function (newValue) {
            $timeout(function () {
                newValue && element[0].focus();
            });
        }, true);
    };
});