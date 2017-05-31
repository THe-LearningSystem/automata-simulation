angular.module('automata-simulation').controller('langController', LANGController);

function LANGController($scope, hotkeys) {
    console.log("create LANGUAGE");
    prepareScope($scope);

    //Adding the different "classes" to the scope.
    $scope.languageData = new autoSim.LanguageData();
    $scope.langCore = new autoSim.LangCore($scope);
    $scope.simulator = new autoSim.Simulator($scope);
    $scope.productions = new autoSim.Productions($scope);
    $scope.productions.menu = new autoSim.ProductionMenu($scope);
    $scope.derivationtree = new autoSim.DerivationTree($scope);
    $scope.derivationtree.grid = new autoSim.DerivationTreeGrid($scope);
    $scope.derivationtree.zoom = new autoSim.DerivationTreeZoom($scope);
    $scope.derivationsequence = new autoSim.DerivationSequence($scope);
    $scope.langTransitions = new autoSim.LangTransitions($scope);
    
    //Creating the testData.
    $scope.testLangAgent = new TestLangData($scope);
    //$scope.testLangAgent.testLANG();
}