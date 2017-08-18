autoSim.LangDerivationTreeZoom = function ($scope) {
    var self = this;

    //amount the user can zoom out
    self.zoomMax = 3;
    //amount the user can zoom in
    self.zoomMin = 0.5;
    self.zoomValue = 0.1;
    self.prevent = false;
        
    /**
     * zooms in in the svg
     */
    self.zoomIn = function () {
        $scope.languageData.diagram.scale = ($scope.languageData.diagram.scale + self.zoomValue) > self.zoomMax ? $scope.languageData.diagram.scale : Math.floor(($scope.languageData.diagram.scale + self.zoomValue) * 100) / 100;
        self.updateZoomBehaviour();
    };

    /**
     * zooms out of the svg
     */
    self.zoomOut = function () {
        $scope.languageData.diagram.scale = ($scope.languageData.diagram.scale - self.zoomValue) <= self.zoomMin ? $scope.languageData.diagram.scale : Math.floor(($scope.languageData.diagram.scale - self.zoomValue) * 100) / 100;
        self.updateZoomBehaviour();
    };

    /**
     * This method zooms the svg to a specific scale
     * @param {number} value the zoom value
     */
    self.zoomTo = function (value) {
        $scope.languageData.diagram.scale = value / 100;
        self.updateZoomBehaviour();
    };

    /**
     * This method updates the d3 zoomBehaviour (fixes weird bugs)
     */
    self.updateZoomBehaviour = function () {
        console.log($scope.languageData.diagram)
        //self.behaviour.scaleTo($scope.statediagram.svgOuter, $scope.languageData.diagram.scale);
        $scope.saveApply();

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
        $scope.languageData.diagram.scale = 1.0;
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
            while (((maxX - minX + 150) > ($scope.statediagram.svgWidth / $scope.languageData.diagram.scale)) || ((maxY - minY + 200) > ($scope.statediagram.svgHeight / $scope.languageData.diagram.scale))) {
                $scope.languageData.diagram.scale -= 0.01;
            }
            $scope.saveApply();
            //Calculation of a topShifting and a leftShifting, so the automaton is centered in the diagram.
            topShifting = ((($scope.statediagram.svgHeight / $scope.languageData.diagram.scale) - (maxY - minY)) / 2);
            leftShifting = ((($scope.statediagram.svgWidth / $scope.languageData.diagram.scale) - (maxX - minX)) / 2);
            //set the diagram-x and -y values and update the diagram.
            $scope.languageData.diagram.x = -(minX * $scope.languageData.diagram.scale) + (leftShifting * $scope.languageData.diagram.scale);
            $scope.languageData.diagram.y = -(minY * $scope.languageData.diagram.scale) + (topShifting * $scope.languageData.diagram.scale);
            self.updateZoomBehaviour();
        } else {
            self.scaleAndTranslateToDefault();
        }
    };

    /**
     * Scale and Translate the Svg to the default Value
     */
    self.scaleAndTranslateToDefault = function () {
        var defaultlanguageData = new autoSim.languageData();
        console.log(defaultlanguageData);
        $scope.languageData.diagram.scale = defaultlanguageData.diagram.scale;
        $scope.languageData.diagram.x = defaultlanguageData.diagram.x;
        $scope.languageData.diagram.y = defaultlanguageData.diagram.y;
        self.updateZoomBehaviour();
    };

    self.zoom = function () {
        if (!self.prevent) {
            $scope.languageData.diagram.scale = Math.floor(d3.event.transform.k * 100) / 100;
            $scope.languageData.diagram.x = d3.event.transform.x;
            $scope.languageData.diagram.y = d3.event.transform.y;
            $scope.saveApply();
        } else {
            self.prevent = false;
        }


    };


    self.behaviour = d3.zoom().scaleExtent([self.zoomMin, self.zoomMax]).on("zoom", self.zoom);
};