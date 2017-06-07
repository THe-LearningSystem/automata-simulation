autoSim.nonTerminal = function (id, left, right, posx, posy, terminal) {
    var self = this;

    self.id = id;
    self.left = left;
    self.right = right; //Needs to deleted.
    self.posX = posx;
    self.posY = posy;
    self.follower = [];
    self.followerTerminal = terminal;
    self.isStart = false;
    self.isEnd = false;
};
autoSim.nonTerminal.prototype = Array.prototype;
