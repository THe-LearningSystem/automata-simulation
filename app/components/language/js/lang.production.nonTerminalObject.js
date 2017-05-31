autoSim.nonTerminal = function (id, left, right, posx, posy) {
    var self = this;

    self.id = id;
    self.left = left;
    self.right = right;
    self.posX = posx;
    self.posY = posy;
    self.follower = [];
    self.selected = null;
    self.isStart = false;
};
autoSim.nonTerminal.prototype = Array.prototype;