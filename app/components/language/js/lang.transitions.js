autoSim.LangTransitions = function ($scope) {
    var self = this;

    self.transitionId = 0;
    self.radius = 20;

    $scope.langCore.langUpdateListeners.push(self);

    /**
     * Calls the "createWithId" method, to create a new transition.
     * @param {[[Type]]} from [[Description]]
     * @param {[[Type]]} to   [[Description]]
     */
    self.create = function () {
        var rule = $scope.langDerivationtree.draw;
        var animationGroup = 0;

        _.forEach(rule, function (value) {

            _.forEach(value.follower, function (id) {
                var value2 = $scope.langDerivationtree.draw.getById(id);
                self.createWithId(self.transitionId++, value, value2, animationGroup);
            });
            animationGroup++;
        });
    };

    /**
     * Creates a new transition.
     * @param {[[Type]]} id   [[Description]]
     * @param {[[Type]]} from [[Description]]
     * @param {[[Type]]} to   [[Description]]
     */
    self.createWithId = function (id, from, to, animationGroup) {
        var transition = new autoSim.LangTransitionObject(id, from, to, self.calculatePath(from, to), animationGroup);
        self.push(transition);
    };
    
    /**
     * Searches the transferred transition group, and returns the follower group of it.
     * @param   {[[Type]]} transitionGroup [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.getTransitionGroup = function (transitionGroup, next) {
        var value = 1;
        
        if (!next) {
            value = - 1;
        }
        
        for (var i = 0; i < self.length; i++) {

            if (self[i].animationGroup === transitionGroup && self[i + value].animationGroup !== transitionGroup) {
                
                return self[i + value].animationGroup;
            }
        }
    };

    /**
     * Checks if the transition between two productions exists.
     * @param   {[[Type]]} production1 [[Description]]
     * @param   {[[Type]]} production2 [[Description]]
     * @returns {boolean}  [[Description]]
     */
    self.checkIfTransitionExists = function (production1, production2) {
        var check = false;

        _.forEach(self, function (transition) {

            if (production1 == transition.from && production2 == transition.to) {
                check = true;

            } else if (production1 == transition.to && production2 == transition.from) {
                check = true;
            }
        });
        return check;
    };

    /**
     * Calculates the path of the transition.
     * @param   {object}   from [[Description]]
     * @param   {object}   to   [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.calculatePath = function (from, to) {
        var obj = {};

        var directionVector = {
            x: to.posX - from.posX,
            y: to.posY - from.posY
        };

        var directionVectorLength = Math.sqrt(directionVector.x * directionVector.x + directionVector.y * directionVector.y);

        //Non Terminals in grid are bigger, transition is not completly correct, but works for now.
        var nStart = (self.radius) / directionVectorLength;
        var nEnd = (self.radius) / directionVectorLength;

        obj.xStart = from.posX + nStart * directionVector.x;
        obj.yStart = from.posY + nStart * directionVector.y;
        obj.xEnd = to.posX - nEnd * directionVector.x;
        obj.yEnd = to.posY - nEnd * directionVector.y;

        var path = d3.path();
        path.moveTo(obj.xStart, obj.yStart);
        path.lineTo(obj.xEnd, obj.yEnd);
        obj = path.toString();
        path.closePath();
        return obj;
    };

    // Called by the listener in the core.
    self.updateFunction = function () {
        while (self.pop() !== undefined) {}

        self.create();
    };
};
autoSim.LangTransitions.prototype = Array.prototype;
