autoSim.terminalOrder = function (id, terminal, x, y) {
    var self = this;

    self.id = id;
    self.t = terminal;
    self.posX = x;
    self.posY = y;
};
autoSim.terminalOrder.prototype = Array.prototype;
