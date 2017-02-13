autoSim.Productions = function ($scope) {
    var self = this;

    console.log("langProduction");
     
    self.productionId = 0;

    self.create = function (prLeft, prRight) {
        console.log("createProduction");
        return self.createWithId(self.productionId++, prLeft, prRight);
    };
    
    self.createWithId = function (pId, prLeft, prRight) {
        var production = new autoSim.Production(pId, prLeft, prRight);
        self.push(production);
        return production;
    };
    
    self.existsWithName = function (productionLeft, productionRight, productionId) {
        var tmp = false;
        _.forEach(self, function (production) {
            if (production.left == productionLeft && 
                production.right == productionRight && 
                ( stateId === undefined || state.id !== stateId)) {
                tmp = true;
                return false;
            }
        });
        return tmp;
    };
    
};
autoSim.Productions.prototype = Array.prototype;