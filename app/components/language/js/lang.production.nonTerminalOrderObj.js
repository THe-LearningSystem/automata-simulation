autoSim.nonTerminalOrder = function (id, nonTerminal, x, y) {
    var self = this;

    self.id = id;
    self.nt = nonTerminal;
    self.posX = x;
    self.posY = y;
};
autoSim.nonTerminalOrder.prototype = Array.prototype;
