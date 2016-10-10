autoSim.StateDiagramGrid = function ($scope) {
    var self = this;
    //the space between each SnappingPoint 1:(0,0)->2:(0+gridSpace,0+gridSpace)
    self.spaceBetweenSnappingPoint = 100;
    //the distance when the state is snapped to the next SnappingPoint (Rectangle form)
    self.snapDistance = 20;
    //is Grid drawn
    self.isOpen = true;
    self.snapping = true;
    /**
     * Draw the Grid
     */
    self.draw = function () {
        self.container = d3.select("#svg-grid");
        self.container.html("");
        if (self.isOpen) {
            //clear grid
            var thickness = 1 * $scope.automatonData.diagram.scale * 0.5;
            var xOffset = ($scope.automatonData.diagram.x % (self.spaceBetweenSnappingPoint * $scope.automatonData.diagram.scale));
            var yOffset = ($scope.automatonData.diagram.y % (self.spaceBetweenSnappingPoint * $scope.automatonData.diagram.scale));
            var i;
            //xGrid
            for (i = xOffset; i < $scope.statediagram.getSvgWidth(); i += self.spaceBetweenSnappingPoint * $scope.automatonData.diagram.scale) {
                self.container.append("line").attr("stroke-width", thickness).attr("class", "grid-line xgrid-line").attr("x1", i).attr("y1", 0).attr("x2", i).attr("y2", $scope.statediagram.getSvgHeight());
            }
            //yGrid
            for (i = yOffset; i < $scope.statediagram.getSvgHeight(); i += self.spaceBetweenSnappingPoint * $scope.automatonData.diagram.scale) {
                self.container.append("line").attr("stroke-width", thickness).attr("class", "grid-line ygrid-line").attr("x1", 0).attr("y1", i).attr("x2", $scope.statediagram.getSvgWidth()).attr("y2", i);
            }
        } else {
        }
    };

    window.addEventListener('resize', function () {
        self.draw();
    });

    $scope.$watchCollection('automatonData.diagram', function () {
        self.draw();
    });
    $scope.$watch('statediagram.grid.isOpen', function () {
        self.draw();
    });
};