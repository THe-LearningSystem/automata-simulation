autoSim.LangProduction = function ($scope) {
    var self = this;

    console.log("langProduction");
    
    self.variable = [];
    self.alphabet = [];
    self.production = [];
    self.starvariable = null;
     
    self.productionId = 0;

    self.create = function(prLeft, prRight, x, y) {
        return self.createWithId(self.productionId++, prLeft, prRight, x, y);
    };
    
    self.createWithId = function (productionId, prLeft, prRight, x, y) {
        var production = new autoSim.production(productionId, prLeft, prRight, x, y);
        self.push(production);
        
        //$scope.core.updateListener();
        //$scope.saveApply();

        console.log("count " + $scope.config.countProductionRule);

        return production;
    };
};