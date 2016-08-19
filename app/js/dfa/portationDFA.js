function PortationDFA($scope, type) {
    var self = this;
    if (type === undefined)
        self.type = "DFA";
    else
        self.type = type;
    /**
     * Imports the jsonObj and saves it as the new automatonConfig
     * @param jsonObj
     */
    self.import = function (jsonObj) {
        //clear the config at the start
        var tmpObject = _.cloneDeep(jsonObj);
        if (tmpObject.type == self.type) {
            //clear the objects we create after
            tmpObject.states = [];
            tmpObject.transitions = [];
            tmpObject.startState = null;
            tmpObject.finalStates = [];
            tmpObject.drawnTransitions = [];
            $scope.config = _.cloneDeep($scope.defaultConfig);
            $scope.config = tmpObject;
            self.createOtherObjects(jsonObj);

            $scope.statediagram.updateZoomBehaviour();
            //clear input cache
            angular.element('#hidden-file-upload').val('');
        } else {
            console.log("the automaton has not the same type. AutomatonType:" + self.type + ", uploaded automatonType:" + tmpObject.type);
        }
    };

    /**
     * if the current Automaton has no states, then we can import directly, if not show an overwrite modal
     */
    self.importAutomatonConfig = function () {
        if ($scope.config.states.length === 0) {
            $scope.resetAutomaton();
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
        $scope.resetAutomaton();
        angular.element('#hidden-file-upload').trigger('click');
    };

    /**
     * handles the FileSelection
     * @param evt
     */
    self.handleFileSelect = function (evt) {
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
     * add the listener to the hidden input field
     */
    self.addInputListener = function () {
        document.getElementById('hidden-file-upload').addEventListener('change', self.handleFileSelect, false);
    };


    /**
     * Exports the automatonConfig into an json object
     */
    self.export = function () {
        $scope.config.unSavedChanges = false;
        //workaround: couldn't add new states after export
        $scope.statediagram.resetAddActions();
        var exportData = _.cloneDeep($scope.config);
        exportData.transitions = self.getTransitions();
        exportData.states = self.getStates();
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
        saveAs(blob, $scope.config.name + "." + $scope.config.type.toLowerCase() + ".json");
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
    self.createOtherObjects = function (jsonObj) {
        //create States
        self.createStates(jsonObj);
        //create transitions
        self.createTransitions(jsonObj);
        //create startState
        $scope.changeStartState(jsonObj.startState);
        //create finalStates
        self.addFinalStates(jsonObj);
    };

    /**
     * Add the finalstates to the finalStateArray
     * @param jsonObj
     */
    self.addFinalStates = function (jsonObj) {
        _.forEach(jsonObj.finalStates, function (value) {
            $scope.addFinalState(value);
        });
    };
    /**
     * Creates the imported States
     * @param jsonObj
     */
    self.createStates = function (jsonObj) {
        _.forEach(jsonObj.states, function (value) {
            $scope.addStateWithId(value.id, value.name, value.x, value.y);
        });
    };

    /**
     * Creates the imported transitions
     * @param jsonObj
     */
    self.createTransitions = function (jsonObj) {
        _.forEach(jsonObj.transitions, function (value) {
            $scope.addTransitionWithId(value.id, value.fromState, value.toState, value.name);
        });
    };


    /**
     * Returns all transition without the objReference
     * @return {Array} array of transition objects
     */
    self.getTransitions = function () {
        var allTransitions = [];
        _.forEach($scope.config.transitions, function (transition) {
            var tmpTransition = _.cloneDeep(transition);
            delete tmpTransition.objReference;
            allTransitions.push(tmpTransition);
        });
        return allTransitions;
    }

    /**
     * Returns all transition without the objReference
     * @return {Array} array of transition objects
     */
    self.getStates = function () {
        var allStates = [];
        _.forEach($scope.config.states, function (state) {
            var tmpState = _.cloneDeep(state);
            delete tmpState.objReference;
            allStates.push(tmpState);
        });
        return allStates;
    }
}