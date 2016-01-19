
    //EXPORT AND IMPORT
    /**
     * Exports the automaton
     * @return {File} Returns a json file
     */
    function export = function() {
        var exportData = {};
        exportData = $scope.config;
        exportData.transitions = getTransitions();
        exportData.states = getStates();
        var data = window.JSON.stringify(exportData);
        var blob = new Blob([data], {
            type: "text/plain;charset=utf-8;",
        });
        saveAs(blob, "dfa.json");
    }

    /**
     * Returns all transition without the objReference
     * @return {Array} array of transition objects
     */
    function getTransitions() {
        var allTransitions = [];
        _.forEach($scope.config.transitions, function(transition, key) {
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
        _.forEach($scope.config.states, function(state, key) {
            var tmpState = JSON.parse(JSON.stringify(state));
            delete tmpState.objReference;
            allStates.push(tmpState);
        });
        return allStates;
    }


    //Called when the user clicks on the import Button and opens the hidden-file-input
    d3.select(".import").on("click", function() {
        document.getElementById("hidden-file-upload").click();
    });
    //called when the user uploads a file
    d3.select("#hidden-file-upload").on("change", function() {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            var uploadFile = this.files[0];
            var filereader = new window.FileReader();
            filereader.onload = function() {
                var txtRes = filereader.result;
                // TODO better error handling
                try {
                    var data = JSON.parse(txtRes);
                    if (data != undefined) {

                        $scope.$apply(function() {
                            //import the config without states and transitions;
                            $scope.config = JSON.parse(JSON.stringify(data));
                            $scope.graphdesigner.updateConfig($scope.config);
                            $scope.simulator.updateConfig($scope.config);
                            $scope.config.states = [];
                            $scope.config.transitions = [];
                            //import states
                            _.forEach(data.states, function(state, key) {
                                    $scope.addStateWithId(state.id, state.name, state.x, state.y);
                                })
                                //import transistions
                            _.forEach(data.transitions, function(transition, key) {
                                $scope.addTransitionWithId(transition.id, transition.fromState, transition.toState, transition.name);
                            })

                        });

                    }
                } catch (err) {
                    console.log("Error parsing uploaded file\nerror message: " + err.message);
                    return;
                }
            };
            filereader.readAsText(uploadFile);

        } else {
            alert("Your browser won't let you save this graph -- try upgrading your browser to IE 10+ or Chrome or Firefox.");
        }

    });




        //called before the user is quitting the page, that he should save his work
    /*
    window.onbeforeunload = function() {
        return "Make sure to save our work!";
    };
    */