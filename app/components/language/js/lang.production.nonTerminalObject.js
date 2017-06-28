autoSim.nonTerminal = function (id, left, right, terminal) {
    var self = this;

    self.id = id;
    self.left = left;
    self.right = right; //Needs to deleted.
    
    self.followerTerminal = terminal;
    self.follower = [];
    
    self.isStart = false;
    self.isEnd = false;
};
autoSim.nonTerminal.prototype = Array.prototype;
