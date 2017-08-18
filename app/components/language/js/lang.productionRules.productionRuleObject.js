autoSim.LangProductionRuleObject = function (id, left, right) {
    var self = this;
    
    self.id = id;
    self.left = left;
    self.right = right;
    
    self.followerRuleId = [];
    self.isStart = false;
};
