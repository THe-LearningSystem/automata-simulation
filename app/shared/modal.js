autoSim.directive("modal", function () {
    return {
        scope: {},
        link: function (scope, elm, attrs) {
            /**
             * Add the options to the modal.
             * @param newTitle
             * @param newDescription
             * @param action
             * @param button
             */
            scope.$parent.showModalWithMessage = function (newTitle, newDescription, action, button) {
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


            /**
             * Executes the modal action-> when clicking on the action button
             */
            scope.executeModalAction = function () {

                if (isFunction(scope.modalAction)) {
                    if (scope.modalAction.toString().startsWith('function'))
                        (scope.modalAction)();
                    else
                        scope.$parent.modalAction();
                } else
                    scope.$parent.$eval(scope.modalAction);
            };


        },
        templateUrl: 'shared/modal.html'
    };
});