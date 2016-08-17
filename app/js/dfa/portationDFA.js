function PortationDFA($scope) {
    var self = this;

    /**
     * Imports the jsonObj and saves it as the new automatonConfig
     * @param jsonObj
     */
    self.import = function (jsonObj) {
        //clear the config at the start
        $scope.resetAutomaton();
        var tmpObject = cloneObject(jsonObj);
        //clear the objects we create after
        tmpObject.states = [];
        tmpObject.transitions = [];
        tmpObject.startState = null;
        tmpObject.finalStates = [];
        tmpObject.drawnTransitions = [];
        $scope.config = cloneObject($scope.defaultConfig);
        $scope.config = tmpObject;
        createOtherObjects(jsonObj);

        $scope.statediagram.updateZoomBehaviour();
    };

    /**
     * if the current Automaton has no states, then we can import directly, if not show an overwrite modal
     */
    self.importAutomatonConfig = function () {
        if ($scope.config.states.length === 0) {
            self.importFile();
        } else {
            $scope.showModalWithMessage('IMPORT.TITLE', 'IMPORT.DESC', 'portation.importFile()');
            //Called when the user clicks on the import Button and opens the hidden-file-input
        }

    };

    /**
     * open the file upload dialog
     */
    self.importFile = function () {
        angular.element('#hidden-file-upload').trigger('click');
    };

    /**
     * handles the FileSelection
     * @param evt
     */
    function handleFileSelect(evt) {
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
                        self.import(json);

                    } catch (ex) {
                        alert('ex when trying to parse json = ' + ex);
                    }
                };
            })(f);
            reader.readAsText(f);
        }
    }

    /**
     * when the user confirm the data, the handleFileSelect is called
     */
    document.getElementById('hidden-file-upload').addEventListener('change', handleFileSelect, false);

    /**
     * Exports the automatonConfig into an json object
     */
    self.export = function () {
        $scope.config.unSavedChanges = false;
        //workaround: couldn't add new states after export
        $scope.statediagram.resetAddActions();
        var exportData = $scope.config;
        exportData.transitions = getTransitions();
        exportData.states = getStates();
        //remove drawnTransition
        delete exportData.drawnTransitions;
        return window.JSON.stringify(exportData, null, 4);

    };
    /**
     * Downloads the exported Config as json file
     */
    self.downloadAutomatonConfig = function () {
        var data = self.export();
        var blob = new Blob([data], {
            type: "application/json"
        });
        saveAs(blob, $scope.config.name + ".json");
    };


    /**
     * Saves the svg as a png
     */
    self.saveAsPng = function () {
        saveSvgAsPng(document.getElementById("diagram-svg"), $scope.config.name + ".png");
    };

    /**Helper functions**/

    /**
     * Creates the imported states and transitions
     * @param jsonObj
     */
    function createOtherObjects(jsonObj) {
        //create States
        _.forEach(jsonObj.states, function (value) {
            $scope.addStateWithId(value.id, value.name, value.x, value.y);
        });
        //create transitions
        _.forEach(jsonObj.transitions, function (value) {

            $scope.addTransitionWithId(value.id, value.fromState, value.toState, value.name);
        });
        //create startState
        $scope.changeStartState(jsonObj.startState);
        //create finalStates
        _.forEach(jsonObj.finalStates, function (value) {
            $scope.addFinalState(value);
        });
    }

    /**
     * Returns all transition without the objReference
     * @return {Array} array of transition objects
     */
    function getTransitions() {
        var allTransitions = [];
        _.forEach($scope.config.transitions, function (transition) {
            var tmpTransition = JSON.parse(JSON.stringify(transition));
            delete tmpTransition.objReference;
            allTransitions.push(tmpTransition);
        });
        return allTransitions;
    }

    /**
     * Returns all transition without the objReference
     * @return {Array} array of transition objects
     */
    function getStates() {
        var allStates = [];
        _.forEach($scope.config.states, function (state) {
            var tmpState = JSON.parse(JSON.stringify(state));
            delete tmpState.objReference;
            allStates.push(tmpState);
        });
        return allStates;
    }
}