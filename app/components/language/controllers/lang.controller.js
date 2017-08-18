angular.module('automata-simulation').controller('langController', LANGController);

function LANGController($scope, hotkeys) {
    prepareScope($scope);

    //Adding the different "classes" to the scope.
    $scope.languageData = new autoSim.LanguageData('Typ3');
    $scope.langCore = new autoSim.LangCore($scope);
    $scope.langProductionRules = new autoSim.LangProductionRules($scope);
    $scope.langProductionRules.change = new autoSim.LangProductionRulesChange($scope);
    $scope.langWordChecker = new autoSim.LangWordChecker($scope);
    $scope.langDerivationSequence = new autoSim.LangDerivationSequence($scope);
    $scope.langGrammar = new autoSim.LangGrammar($scope);
    $scope.langDerivationtree = new autoSim.LangDerivationTree($scope);
    $scope.langDerivationtree.grid = new autoSim.LangDerivationTreeGrid($scope);
    $scope.langDerivationtree.zoom = new autoSim.LangDerivationTreeZoom($scope);
    $scope.langDerivationtree.draw = new autoSim.LangDerivationtreeDraw($scope);
    $scope.langTransitions = new autoSim.LangTransitions($scope);
    $scope.langSimulator = new autoSim.LangSimulator($scope);
    
    //Creating the testData.
    $scope.testLangAgent = new TestLangData($scope);
    //$scope.testLangAgent.testLANG();
}