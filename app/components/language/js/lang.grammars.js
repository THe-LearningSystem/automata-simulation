autoSim.Grammars = function ($scope) {
    var self = this;

    console.log("langGrammar");
    
    self.grammarId = 0;
    
    self.create = function (variable, alphabet, startvariable) {
        return self.createWithId(self.grammarId++, variable, alphabet, startvariable);
    };
    
    self.createWithId = function (gId, v, a, s) {
        var grammar = new autoSim.Grammar(gId, v, a, s);
        self.push(grammar);
        return grammar;
    };

};
autoSim.Grammars.prototype = Array.prototype;