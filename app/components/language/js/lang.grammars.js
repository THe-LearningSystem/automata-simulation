autoSim.Grammars = function ($scope) {
    var self = this;

    console.log("langGrammar");
    
    self.grammarId = 0;
    
    self.addProduction = function (gId, prod) {  
        _.forEach(self, function (grammar) {
            grammar.production.push(prod);
        });
        return prod;
    };    
    
    self.create = function (variable, alphabet, production, startvariable) {
        return self.createWithId(self.grammarId++, variable, alphabet, production, startvariable);
    };
    
    self.createWithId = function (gId, v, a, p, s) {
        var grammar = new autoSim.Grammar(gId, v, a, p, s);
        self.push(grammar);
        
        //$scope.core.updateListener();
        //$scope.saveApply();
        return grammar;
    };

};
autoSim.Grammars.prototype = Array.prototype;