autoSim.Productions = function ($scope) {
    var self = this;

    console.log("langProduction");
     
    self.productionId = 0;

    self.create = function (prLeft, prRight) {
        return self.createWithId(self.productionId++, prLeft, prRight);
    };
    
    self.createWithId = function (pId, prLeft, prRight) {
        var production = new autoSim.Production(pId, prLeft, prRight);
        self.push(production);
        return production;
    };
};
autoSim.Productions.prototype = Array.prototype;