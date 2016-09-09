/**
 * Constructor for a state object
 * @param id
 * @param name
 * @param x
 * @param y
 * @constructor
 */
autoSim.State = function (id, name, x, y) {
    var self = this;
    self.id = id;
    self.name = name;
    self.x = x;
    self.y = y;
};