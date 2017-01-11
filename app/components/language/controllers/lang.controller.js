angular.module('automata-simulation').controller('LANGController', LANGController);

function LANGController($scope, hotkeys) {
    console.log("create LANGUAGE");
    prepareScope($scope);

    $scope.languageData = new autoSim.LanguageData();
    $scope.core = new autoSim.Core($scope);
    $scope.grammar = new autoSim.Grammars($scope);
    $scope.production = new autoSim.Productions($scope);
    $scope.derivationtree = new autoSim.DerivationTree($scope);
    $scope.derivationtree.grid = new autoSim.DerivationTreeGrid($scope);
    $scope.derivationtree.zoom = new autoSim.DerivationTreeZoom($scope);
    
    
    $scope.testLangAgent = new TestLangData($scope);
    $scope.testLangAgent.testLANG();
}