//statediagram for the svg diagram
autoSim.LangDerivationTree = function ($scope) {
    "use strict";
    var self = this;
    
    /**
     * Update the width and the Height
     */
    self.updateWidthAndHeight = function () {
        $scope.saveApply(function () {
            self.svgWidth = self.svg.style("width").replace("px", "");
            self.svgHeight = self.svg.style("height").replace("px", "");
        });
    };


    self.getSvgWidth = function () {
        if (self.svg !== undefined)
            return self.svg.style("width").replace("px", "");
        else
            return 0;
    };

    self.getSvgHeight = function () {
        if (self.svg !== undefined)
            return self.svg.style("height").replace("px", "");
        else
            return 0;
    };
};