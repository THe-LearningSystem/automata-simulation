//Simulator for the simulation of the automata
autoSim.Core = function ($scope) {
    "use strict";

    console.log("langCore");
    
    //selfReference
    //for debug puposes better way for acessing in console?
    window.debugScope = $scope;
    //define scope
    
    self.inNameEdit = false;
    
    /**
     * Removes the current automata and the inputWord
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
     */
    self.updateListener = function () {
        _.forEach($scope.core.updateListeners, function (value) {
            value.updateFunction();
        });
        $scope.LanguageData.unSavedChanges = true;
        //instant update, but more digest cycles
        $scope.saveApply();
    };

    self.closeMenus = function () {
        $scope.statediagram.menu.close();
        $scope.states.menu.close();
        $scope.transitions.menu.close();
        $scope.saveApply();
    };
};