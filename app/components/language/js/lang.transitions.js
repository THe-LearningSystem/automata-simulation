autoSim.LangTransitions = function ($scope) {
    var self = this;

    console.log("create Transitions");

    self.id = 0;

    const stateSelfReferenceNumber = Math.sin(45 * (Math.PI / 180)) * $scope.productions.radiusNT;

    self.createToTerminal = function (from, to) {
        self.createWithId(self.id++, from, to);
    };

    self.createWithId = function (id, from, to) {
        var transtition = new autoSim.Transition(id, from, to, self.createTransition(from, to));
        self.push(transtition);
    };

    self.createTransition = function (from, to) {
        var obj = {};
        var x = from.posX;
        var y = from.posY;
        var path = d3.path();
        path.moveTo(x - stateSelfReferenceNumber, y - stateSelfReferenceNumber);
        path.lineTo(to.posX, to.posY);
        obj = path.toString();
        path.closePath();
        
        return obj;
    }

    self.updateTransitionPosition = function (production) {
        
        _.forEach(self, function (test) {
            
            if (test.from === production || test.to === production) {
                test.path = self.createTransition(test.from, test.to);
                console.log(test);
            }
        });
    };

};
autoSim.LangTransitions.prototype = Array.prototype;
