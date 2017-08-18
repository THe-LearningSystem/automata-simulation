autoSim.LangDerivationTreeGrid = function ($scope) {
    var self = this;
        
    //the space between each SnappingPoint 1:(0,0)->2:(0+gridSpace,0+gridSpace)
    self.spaceBetweenSnappingPoint = 100;
    //the distance when the state is snapped to the next SnappingPoint (Rectangle form)
    self.snapDistance = 20;
    //is Grid drawn
    self.isOpen = true;
    self.snapping = true;
    
    /**
     * Draw the Grid.
     */
    self.draw = function () {
        self.container = d3.select("#svg-grid");
        self.container.html("");
        if (self.isOpen) {
            //clear grid
            var thickness = 1 * $scope.languageData.diagram.scale * 0.5;
            var xOffset = ($scope.languageData.diagram.x % (self.spaceBetweenSnappingPoint * $scope.languageData.diagram.scale));
            var yOffset = ($scope.languageData.diagram.y % (self.spaceBetweenSnappingPoint * $scope.languageData.diagram.scale));
            var i;
            
            //xGrid
            for (i = xOffset; i < $scope.langDerivationtree.getSvgWidth(); i += self.spaceBetweenSnappingPoint * $scope.languageData.diagram.scale) {
                self.container.append("line").attr("stroke-width", thickness).attr("class", "grid-line xgrid-line").attr("x1", i).attr("y1", 0).attr("x2", i).attr("y2", $scope.langDerivationtree.getSvgHeight());
            }
            //yGrid
            for (i = yOffset; i < $scope.langDerivationtree.getSvgHeight(); i += self.spaceBetweenSnappingPoint * $scope.languageData.diagram.scale) {
                self.container.append("line").attr("stroke-width", thickness).attr("class", "grid-line ygrid-line").attr("x1", 0).attr("y1", i).attr("x2", $scope.langDerivationtree.getSvgWidth()).attr("y2", i);
            }
        } else {
        }
    };

    window.addEventListener('resize', function () {
        self.draw();
    });

    $scope.$watchCollection('languageData.diagram', function () {
        self.draw();
    });
    $scope.$watch('langDerivationtree.grid.isOpen', function () {
        self.draw();
    });
};