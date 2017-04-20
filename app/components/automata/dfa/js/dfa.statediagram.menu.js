autoSim.StateDiagramMenu = function ($scope) {
    var self = this;
    self.preventSvgOuterClick = false;
    self.preventSvgContextClick = false;

    self.context = {};
    self.context.isOpen = false;
    self.context.position = {};
    self.context.open = function () {
        self.context.close();
        self.context.isOpen = true;
        if (event.target.id === "diagram-svg") {
            self.context.position.x = event.layerX;
            self.context.position.y = event.layerY;
            self.context.addStateX = (((event.layerX - $scope.automatonData.diagram.x) * (1 / $scope.automatonData.diagram.scale)));
            self.context.addStateY = (((event.layerY - $scope.automatonData.diagram.y) * (1 / $scope.automatonData.diagram.scale)));
        }
        $scope.saveApply();

    };

    self.context.close = function () {
        self.context.isOpen = false;
        $scope.saveApply();

    };


    self.isOpen = function () {
        return self.context.isOpen;
    };

    self.close = function () {
        self.context.close();
    };

};