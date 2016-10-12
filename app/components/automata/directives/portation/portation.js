autoSim.directive("portation", function () {
    return {
        restrict: 'E',
        transclude: true,
        scope: {},
        link: function (scope, elm, attrs) {
            /**
             * Imports the jsonObj and saves it as the new automatonautomatonData
             * @param jsonObj
             */
            scope.import = function (jsonObj) {
                scope.$apply(function () {
                    //clear the automatonData at the start
                    var tmpObject = _.cloneDeep(jsonObj);
                    if (tmpObject.automatonData.type == scope.$parent.automatonData.type) {
                        scope.$parent.automatonData = jsonObj.automatonData;
                        scope.$parent.states.import(jsonObj.states);
                        scope.$parent.transitions.import(jsonObj.transitions);

                        //update all listeners
                        scope.$parent.core.updateListener();
                    } else {
                        console.log("the automaton has not the same type. AutomatonType:" + scope.type + ", uploaded automatonType:" + tmpObject.type);
                    }
                });
            };

            /**
             * if the current Automaton has no states, then we can import directly, if not show an overwrite modal
             */
            scope.importAutomaton = function () {
                if (scope.$parent.states.length === 0) {
                    scope.importFile();
                } else {
                    scope.$parent.showModalWithMessage('IMPORT.TITLE', 'IMPORT.DESC', function () {
                        scope.$parent.core.resetAutomaton();
                        scope.importFile();
                    });
                }
            };

            /**
             * open the file upload dialog
             */
            scope.importFile = function () {
                angular.element('#hidden-file-upload').trigger('click');
            };

            /**
             * handles the FileSelection
             * @param evt
             */
            scope.handleFileSelect = function (evt) {
                var files = evt.target.files;
                // FileList object
                for (var i = 0,
                         f; f = files[i]; i++) {
                    var reader = new FileReader();
                    // Closure to capture the file information.
                    reader.onload = (function () {
                        return function (e) {
                            try {
                                var json = JSON.parse(e.target.result);
                                //import the data to the automaton
                                scope.import(json);
                            } catch (ex) {
                                console.log('ex when trying to parse json = ' + ex);
                            }
                        };
                    })(f);
                    reader.readAsText(f);

                }
            };

            /**
             * add the listener to the hidden input field
             */
            scope.addInputListener = function () {
                document.getElementById('hidden-file-upload').removeEventListener('change', scope.handleFileSelect, false);
                document.getElementById('hidden-file-upload').addEventListener('change', scope.handleFileSelect, false);
            };
            scope.addInputListener();


            /**
             * Exports the automatonautomatonData into an json object
             */
            scope.export = function () {
                scope.$parent.automatonData.unSavedChanges = false;
                var exportData = {};
                exportData.automatonData = _.cloneDeep(scope.$parent.automatonData);
                exportData.states = scope.$parent.states.export();
                exportData.transitions = scope.$parent.transitions.export();
                console.log(exportData);
                return window.JSON.stringify(exportData, null, 4);

            };

            /**
             * Downloads the exported automatonData as json file
             */
            scope.downloadAutomaton = function () {
                var data = scope.export();
                var blob = new Blob([data], {
                    type: "application/json"
                });
                saveAs(blob, scope.$parent.automatonData.name + "." + scope.$parent.automatonData.type.toLowerCase() + ".json");
            };

        },
        templateUrl: 'components/automata/directives/portation/portation.html'
    };
})
;
