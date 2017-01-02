autoSim.Productions = function ($scope) {
    var self = this;

    console.log("langProduction");
     
    self.productionId = 0;

    self.create = function (prLeft, prRight, x, y) {
        return self.createWithId(self.productionId++, prLeft, prRight, x, y);
    };
    
    self.createWithId = function (pId, prLeft, prRight, x, y) {
        var production = new autoSim.Production(pId, prLeft, prRight, x, y);
        self.push(production);
        
        //$scope.core.updateListener();
        //$scope.saveApply();
        return production;
    };
};
autoSim.Productions.prototype = Array.prototype;