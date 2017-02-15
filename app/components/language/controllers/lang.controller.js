angular.module('automata-simulation').controller('langController', LANGController);

function LANGController($scope, hotkeys) {
    console.log("create LANGUAGE");
    prepareScope($scope);

    $scope.languageData = new autoSim.LanguageData();
    $scope.core = new autoSim.Core($scope);
    $scope.simulator = new autoSim.Simulator($scope);
    $scope.productions = new autoSim.Productions($scope);
    $scope.productions.menu = new autoSim.ProductionMenu($scope);
    $scope.derivationtree = new autoSim.DerivationTree($scope);
    $scope.derivationtree.grid = new autoSim.DerivationTreeGrid($scope);
    $scope.derivationtree.zoom = new autoSim.DerivationTreeZoom($scope);
    $scope.derivationsequence = new autoSim.DerivationSequence($scope);
    $scope.grammar = new autoSim.Grammar($scope);
    
    
    $scope.testLangAgent = new TestLangData($scope);
    $scope.testLangAgent.testLANG();
}