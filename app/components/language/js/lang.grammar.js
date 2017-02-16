autoSim.Grammar = function ($scope) {
    var self = this;
    
    console.log("createdGrammar");
    
    self.nonTerminal = [];
    
    self.createNonTerminalIfNotExist = function (variable) {
        var i = 0;
        var character = "";
        while(character = variable[i] !== undefined) {
            if (character == character.toUpperCase()) {
                self.nonTerminal.add(character)
                console.log(character);
                return true;
            }
        }
    };
};