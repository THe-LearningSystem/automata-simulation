//Simulator for the simulation of the automata
autoSim.LangCore = function ($scope) {
    "use strict";
    var self = this;


    //Array of all update Listeners
    self.langUpdateListeners = [];

    //selfReference
    //for debug puposes better way for acessing in console?
    window.debugScope = $scope;
    //define scope

    self.inNameEdit = false;

    /**
     * This function calls the method updateFunction of every element in $scope.core.updateListeners
     * Not in use;
     */
    self.langUpdateListener = function () {
        _.forEach($scope.langCore.langUpdateListeners, function (value) {
            value.updateFunction();
        });
        // $scope.LanguageData.unSavedChanges = true;
        // instant update, but more digest cycles
        $scope.saveApply();
    };
};
