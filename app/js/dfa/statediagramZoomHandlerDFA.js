function StateDiagramZoomHandlerDFA($scope, self) {
    //prevents call from the svgOuterClickListener
    self.preventSvgOuterClick = false;
    //amount the user can zoom out
    self.zoomMax = 2.5;
    //amount the user can zoom in
    self.zoomMin = 0.5;
    self.zoomValue = 0.1;


    /**
     * Click Listener when clicking on the outer svg =(not clicking on state or transition)
     */
    self.addSvgOuterClickListener = function () {
        self.svgOuter.on("click", function () {
            if (!self.preventSvgOuterClick) {
                self.closeStateMenu();
                self.closeTransitionMenu();
                self.contextMenu(null, true);
                $scope.safeApply();
            } else {
                //remove ListenerBoolean
                self.preventSvgOuterClick = false;
            }
        });
    };
    /****ZOOMHANDLER START***/
    /**
     * zooms in in the svg
     */
    self.zoomIn = function () {
        $scope.config.diagram.scale = ($scope.config.diagram.scale + self.zoomValue) > self.zoomMax ? $scope.config.diagram.scale : Math.floor(($scope.config.diagram.scale + self.zoomValue) * 100) / 100;
        self.updateZoomBehaviour();
    };
    /**
     * zooms out of the svg
     */
    self.zoomOut = function () {
        $scope.config.diagram.scale = ($scope.config.diagram.scale - self.zoomValue) <= self.zoomMin ? $scope.config.diagram.scale : Math.floor(($scope.config.diagram.scale - self.zoomValue) * 100) / 100;
        self.updateZoomBehaviour();
    };
    /**
     * This method zooms the svg to a specific scale
     * @param {number} value the zoom value
     */
    self.zoomTo = function (value) {
        $scope.config.diagram.scale = value / 100;
        $scope.safeApply();
        self.updateZoomBehaviour();
    };
    /**
     * This method updates the d3 zoomBehaviour (fixes weird bugs)
     */
    self.updateZoomBehaviour = function () {
        $scope.safeApply();
        self.svg.attr("transform", "translate(" + $scope.config.diagram.x + "," + $scope.config.diagram.y + ")" + " scale(" + $scope.config.diagram.scale + ")");
        self.svgOuterZoomAndDrag.scale($scope.config.diagram.scale);
        self.svgOuterZoomAndDrag.translate([$scope.config.diagram.x, $scope.config.diagram.y]);
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
        $scope.config.diagram.scale = 1.0;
        /**
         * check if there exist at least one state. If the diagram is empty, there is nothing to fit the window.
         * The state with the lowest x- and y-coordinate defines the minimum-x- and minimum-y-coordinate from the automaton.
         * The state with the highest x- and y-coordinate defines the maximum-x- and maximum-y-coordinate from the automaton
         */
        if ($scope.config.states.length > 0) {
            for (i = 0; i < $scope.config.states.length; i++) {
                stateX[i] = $scope.config.states[i].x;
            }

            for (i = 0; i < $scope.config.states.length; i++) {
                stateY[i] = $scope.config.states[i].y;
            }
            minX = _.min(stateX);
            maxX = _.max(stateX);
            minY = _.min(stateY);
            maxY = _.max(stateY);
            /*
             * While the size of the automaton is bigger than the diagram, zoom out.
             * We work with the width and the height from the diagram proportional to the scale.
             */
            while (((maxX - minX + 150) > (self.svgOuterWidth / $scope.config.diagram.scale)) || ((maxY - minY + 200) > (self.svgOuterHeight / $scope.config.diagram.scale))) {
                $scope.config.diagram.scale -= 0.01;
            }
            $scope.safeApply();
            //Calculation of a topShifting and a leftShifting, so the automaton is centered in the diagram.
            topShifting = (((self.svgOuterHeight / $scope.config.diagram.scale) - (maxY - minY)) / 2);
            leftShifting = (((self.svgOuterWidth / $scope.config.diagram.scale) - (maxX - minX)) / 2);
            //set the diagram-x and -y values and update the diagram.
            $scope.config.diagram.x = -(minX * $scope.config.diagram.scale) + (leftShifting * $scope.config.diagram.scale);
            $scope.config.diagram.y = -(minY * $scope.config.diagram.scale) + (topShifting * $scope.config.diagram.scale);
            self.updateZoomBehaviour();
        } else {
            self.scaleAndTranslateToDefault();
        }
    };
    /**
     * Scale and Translate the Svg to the default Value
     */
    self.scaleAndTranslateToDefault = function () {
        $scope.config.diagram.scale = $scope.defaultConfig.diagram.scale;
        $scope.config.diagram.x = $scope.defaultConfig.diagram.x;
        $scope.config.diagram.y = $scope.defaultConfig.diagram.y;
        $scope.safeApply();
        self.updateZoomBehaviour();
    };
//the svgOuterZoom and drag listener
    self.svgOuterZoomAndDrag = d3.behavior.zoom().scaleExtent([self.zoomMin, self.zoomMax]).on("zoom", function () {
        var stop = d3.event.button || d3.event.ctrlKey;
        if (stop)
            d3.event.stopImmediatePropagation();
        // stop zoom
        //don't translate on right click (3)
        if (d3.event.sourceEvent.which !== 3) {
            $scope.config.diagram.scale = Math.floor(d3.event.scale * 100) / 100;
            $scope.config.diagram.x = d3.event.translate[0];
            $scope.config.diagram.y = d3.event.translate[1];
            $scope.safeApply();
            self.svg.attr("transform", "translate(" + $scope.config.diagram.x + "," + $scope.config.diagram.y + ")" + " scale(" + $scope.config.diagram.scale + ")");
        } else {
        }
        self.updateZoomBehaviour();
    });
}
