autoSim.Production = function (id, left, right, posx, posy) {
    var self = this;

    self.id = id;
    self.left = left;
    self.right = right;
    self.posX = posx;
    self.posY = posy;
    self.follower = [];
    self.selected = null;
    self.isStart = false;
    
    /**
     * Creates the right production points for the drawing in the grid.
     * @param   {[[Type]]} id   [[Description]]
     * @param   {[[Type]]} posX [[Description]]
     * @param   {[[Type]]} posY [[Description]]
     * @param   {[[Type]]} char [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
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

    /**
     * Returns the production with the given id.
     * @param rightId
     * @returns {object} Returns the objectReference of the production undefined if not found
     */
    self.getById = function (rightId) {
        return self[self.getIndexByRightId(rightId)];
    };

    /**
     * Get the array index from the production with the given id.
     * @param rightId
     * @returns  {Boolean} Returns the index and -1 when production with rightId not found
     */
    self.getIndexByRightId = function (rightId) {
        return _.findIndex(self, function (right) {
            if (right.id === rightId) {
                return right;
            }
        });
    };

    /**
     * Moves a production to the given position.
     * @param state
     * @param newX
     * @param newY
     */
    self.moveRight = function (right, newX, newY) {
        right.posX = newX;
        right.posY = newY;
    };
};
