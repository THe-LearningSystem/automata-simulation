angular.module('automata-simulation').controller('LANGController', LANGController);

function LANGController($scope, hotkeys) {
    console.log("created LANGUAGE");
    prepareScope($scope);

    $scope.languageData = new autoSim.LanguageData();
    $scope.core = new autoSim.Core($scope);
    $scope.derivationTree = new autoSim.DerivationTreeGrid($scope);
    $scope.grammar = new autoSim.Grammar($scope);
    $scope.production = new autoSim.Productions($scope);
    
    
    $scope.testLangAgent = new TestLangData($scope);
    $scope.testLangAgent.testLANG();
}