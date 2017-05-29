//Simulator for the simulation of the automata
autoSim.LangCore = function ($scope) {
    "use strict";
    var self = this;

    console.log("langCore");
    
    //Array of all update Listeners
    self.langUpdateListeners = [];
    
    //selfReference
    //for debug puposes better way for acessing in console?
    window.debugScope = $scope;
    //define scope
    
    self.inNameEdit = false;
    
    /**
     * Not in use.
     */
    self.resetAutomaton = function () {
        self.closeMenus();
        $scope.simulator.reset();
        $scope.states.clear();
        $scope.transitions.clear();
        $scope.automatonData = new autoSim.AutomatonData($scope.automatonData.type);
        $scope.statediagram.zoom.scaleAndTranslateToDefault();
        self.updateListener();
        $scope.automatonData.unSavedChanges = false;
        $scope.saveApply();
    };

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

    /**
     * Closes all menus.
     * Not in use.
     */
    self.closeMenus = function () {
        $scope.statediagram.menu.close();
        $scope.states.menu.close();
        $scope.transitions.menu.close();
        $scope.saveApply();
    };
};