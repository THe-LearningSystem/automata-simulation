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
        link: function (scope, elm, attrs) {
            /**
             * Executes the modal action-> when clicking on the action button
             */
            scope.executeModalAction = function () {
                scope.$eval(scope.modalAction);
            };
            /**
             * Leave the input field after clicking the enter button
             */
            scope.keypressCallback = function ($event) {
                if ($event.charCode == 13) {
                    document.getElementById("automatonNameEdit").blur();
                }
            };


        },
        templateUrl: 'directives/automaton-name.html'
    };
});
autoSim.directive("modal", function () {
    return {
        link: function (scope, elm, attrs) {
            /**
             * Add the options to the modal.
             * @param newTitle
             * @param newDescription
             * @param action
             * @param button
             */
            scope.showModalWithMessage = function (newTitle, newDescription, action, button) {
                scope.title = newTitle;
                scope.description = newDescription;
                if (action !== undefined) {
                    scope.modalAction = action;
                    scope.noAction = false;
                    if (button === undefined) {
                        scope.button = "MODAL_BUTTON.PROCEED";
                    } else {
                        scope.button = button;
                    }
                } else {
                    scope.modalAction = null;
                    scope.button = "MODAL_BUTTON.NOTIFIED";
                    scope.noAction = true;
                }

                //change it to angular function
                $("#modal").modal();
            };
        },
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
autoSim.directive("contextMenu", function () {
    return {
        templateUrl: 'directives/context-menu.html'
    };
});
autoSim.directive("windowBeforeUnload", function () {
    return {
        link: function (scope, elm, attrs) {

            /**
             * Prevent leaving site
             */
            window.onbeforeunload = function (event) {
                //turn true when you want the leaving protection
                if (!scope.debug && scope.config.unSavedChanges) {
                    var closeMessage = "All Changes will be Lost. Save before continue!";
                    if (typeof event == 'undefined') {
                        event = window.event;
                    }
                    if (event) {
                        event.returnValue = closeMessage;
                    }
                    return closeMessage;
                }
            };
        },
        template: "<div id='unload'></div>"
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