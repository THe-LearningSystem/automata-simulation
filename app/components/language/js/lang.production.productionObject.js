autoSim.Production = function (id, left, right, posx, posy) {
    var self = this;

    self.id = id;
    self.left = left;
    self.right = right;
    self.follower = [];
    self.posX = posx;
    self.posY = posy;
    
    self.create = function (id, posX, posY, char) {
        return self[self.push(new autoSim.rightProduction(id, posX, posY, char)) - 1];
    };
};
autoSim.Production.prototype = Array.prototype;

autoSim.rightProduction = function (id, posX, posY, char) {
    var self = this;
    
    self.id = id;
    self.posX = posX;
    self.posY = posY;
    self.char = char;
};
