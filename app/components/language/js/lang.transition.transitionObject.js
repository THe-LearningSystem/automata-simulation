autoSim.Transition = function (id, fromState, toState, path) {
    var self = this;
    
    self.id = id;
    self.from = fromState;
    self.to = toState;
    self.path = path;
};
autoSim.Transition.prototype = Array.prototype;
