autoSim.StateDiagramZoomHandler = function ($scope) {
    var self = this;

    //amount the user can zoom out
    self.zoomMax = 3;
    //amount the user can zoom in
    self.zoomMin = 0.5;
    self.zoomValue = 0.1;
    /**
     * zooms in in the svg
     */
    self.zoomIn = function () {
        $scope.automatonData.diagram.scale = ($scope.automatonData.diagram.scale + self.zoomValue) > self.zoomMax ? $scope.automatonData.diagram.scale : Math.floor(($scope.automatonData.diagram.scale + self.zoomValue) * 100) / 100;
        self.updateZoomBehaviour();
    };

    /**
     * zooms out of the svg
     */
    self.zoomOut = function () {
        $scope.automatonData.diagram.scale = ($scope.automatonData.diagram.scale - self.zoomValue) <= self.zoomMin ? $scope.automatonData.diagram.scale : Math.floor(($scope.automatonData.diagram.scale - self.zoomValue) * 100) / 100;
        self.updateZoomBehaviour();
    };

    /**
     * This method zooms the svg to a specific scale
     * @param {number} value the zoom value
     */
    self.zoomTo = function (value) {
        $scope.automatonData.diagram.scale = value / 100;
        self.updateZoomBehaviour();
    };

    /**
     * This method updates the d3 zoomBehaviour (fixes weird bugs)
     */
    self.updateZoomBehaviour = function () {
        $scope.saveApply();
        //self.behaviour.scaleTo($scope.statediagram.svgOuter, $scope.automatonData.diagram.scale);
        //self.behaviour.transform($scope.statediagram.svgOuter, [$scope.automatonData.diagram.x, $scope.automatonData.diagram.y]);
    };

    /**
     * This method zooms the svg to a calculated scale, so the complete svg fits in the window
     */
    self.zoomFitWindow = function () {
        var stateX = [];
        var stateY = [];
        var minX = 0;
        var maxX = 0;
        var minY = 0;
        var maxY = 0;
        var topShifting = 0;
        var leftShifting = 0;
        var i;
        /*
         * set the diagramScale on 100%. We got the advantage, that the method also zoom in, if the automaton doesn't fit the window.
         * But the method doesn't really zoom in. It sets the scale on 100% an then zoom out.
         */
        $scope.automatonData.diagram.scale = 1.0;
        /**
         * check if there exist at least one state. If the diagram is empty, there is nothing to fit the window.
         * The state with the lowest x- and y-coordinate defines the minimum-x- and minimum-y-coordinate from the automaton.
         * The state with the highest x- and y-coordinate defines the maximum-x- and maximum-y-coordinate from the automaton
         */
        if ($scope.states.length > 0) {
            for (i = 0; i < $scope.states.length; i++) {
                stateX[i] = $scope.states[i].x;
            }

            for (i = 0; i < $scope.states.length; i++) {
                stateY[i] = $scope.states[i].y;
            }
            minX = _.min(stateX);
            maxX = _.max(stateX);
            minY = _.min(stateY);
            maxY = _.max(stateY);
            /*
             * While the size of the automaton is bigger than the diagram, zoom out.
             * We work with the width and the height from the diagram proportional to the scale.
             */
            while (((maxX - minX + 150) > ($scope.statediagram.svgWidth / $scope.automatonData.diagram.scale)) || ((maxY - minY + 200) > ($scope.statediagram.svgHeight / $scope.automatonData.diagram.scale))) {
                $scope.automatonData.diagram.scale -= 0.01;
            }
            $scope.saveApply();
            //Calculation of a topShifting and a leftShifting, so the automaton is centered in the diagram.
            topShifting = ((($scope.statediagram.svgHeight / $scope.automatonData.diagram.scale) - (maxY - minY)) / 2);
            leftShifting = ((($scope.statediagram.svgWidth / $scope.automatonData.diagram.scale) - (maxX - minX)) / 2);
            //set the diagram-x and -y values and update the diagram.
            $scope.automatonData.diagram.x = -(minX * $scope.automatonData.diagram.scale) + (leftShifting * $scope.automatonData.diagram.scale);
            $scope.automatonData.diagram.y = -(minY * $scope.automatonData.diagram.scale) + (topShifting * $scope.automatonData.diagram.scale);
            self.updateZoomBehaviour();
        } else {
            self.scaleAndTranslateToDefault();
        }
    };

    /**
     * Scale and Translate the Svg to the default Value
     */
    self.scaleAndTranslateToDefault = function () {
        $scope.automatonData.diagram.scale = autoSim.AutomatonData.diagram.scale;
        $scope.automatonData.diagram.x = autoSim.AutomatonData.diagram.x;
        $scope.automatonData.diagram.y = autoSim.AutomatonData.diagram.y;
        self.updateZoomBehaviour();
    };

    self.zoom = function () {
        $scope.automatonData.diagram.scale = Math.floor(d3.event.transform.k * 100) / 100;
        $scope.automatonData.diagram.x = d3.event.transform.x;
        $scope.automatonData.diagram.y = d3.event.transform.y;
        $scope.saveApply();
    };


    self.behaviour = d3.zoom().scaleExtent([self.zoomMin, self.zoomMax]).on("zoom", self.zoom);
};