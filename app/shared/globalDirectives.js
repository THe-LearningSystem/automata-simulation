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

autoSim.directive("appMenu", function () {
    return {
        transclude: true,
        templateUrl: 'shared/appMenu.html'
    };
});


