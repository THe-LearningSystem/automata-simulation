angular.module('automata-simulation').controller('LANGController', LANGController);

function LANGController($scope, hotkeys) {
    console.log("created LANGUAGE");
    prepareScope($scope);

    $scope.languageData = new autoSim.LanguageData();
    $scope.core = new autoSim.LangCore($scope);
    $scope.productionRule = new autoSim.LangProduction($scope);
    
    
    $scope.testLangAgent = new TestLangData($scope);
    $scope.testLangAgent.testLANG();
}