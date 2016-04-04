//GRAPHDESIGNER for the svg diagramm
function GraphdesignerDFA($scope, svgSelector) {
    "use strict";

    var self = this;

    self.preventStateDragging = false;
    self.inAddTransition = false;
    self.selectedState = null;

    //prevents call from the svouterclicklistener
    self.preventSvgOuterClick = false;
    self.selectedTransition = null;
    self.showStateMenu = false;
    self.showTransitionMenu = false;
    self.selectedStateName = "selectedForTransition";
    //user can snap the states to the grid -> toggles snapping
    self.snapping = true;

    //graphdesigner settings
    self.settings = {
        stateRadius: 25,
        finalStateRadius: 29,
        selected: false
    };
    //is for the selfReference
    var stretchX = 40;
    var stretchY = 18;

    //for the selfReference transition
    self.stateSelfReferenceNumber = Math.sin(45 * (Math.PI / 180)) * self.settings.stateRadius;

    //has the drawn Transition
    //{fromState:0,toState:0,names:["a","b"], objReference:};
    //if there is already a transition with the right fromState and toState, thenn only add myname to the names array
    $scope.drawnTransitions = [];


    /**
     * Check if transition already drawn
     * @param   {number}  fromState 
     * @param   {number}  toState   
     * @returns {boolean}
     */
    self.existDrawnTransition = function (fromState, toState) {

        var tmp = false;
        for (var i = 0; i < $scope.drawnTransitions.length; i++) {
            var transition = $scope.drawnTransitions[i];
            if (transition.fromState == fromState && transition.toState == toState) {
                tmp = true;
            }
        }
        return tmp;
    };

    /**
     * Get a drawn Transition
     * @param   {number} fromState 
     * @param   {number} toState   
     * @returns {object} 
     */
    self.getDrawnTransition = function (fromState, toState) {
        for (var i = 0; i < $scope.drawnTransitions.length; i++) {
            var transition = $scope.drawnTransitions[i];
            if (transition.fromState == fromState && transition.toState == toState) {
                return transition;
            }
        }
    };

    /**
     * get a string to draw the transition names
     * @param   {string} names 
     * @returns {string} 
     */
    self.prepareTransitionNamesForSvg = function (names) {
        var tmpString = '';
        _.forEach(names, function (value, key) {
            tmpString += value.name + " " + $scope.config.transitionNameSuffix + " ";
        });

        tmpString = tmpString.slice(0, -2);
        return tmpString;
    };

    /**
     * Clears the svgContent, resets scale and translate and delete drawnTransitionContent
     */
    self.clearSvgContent = function () {
        //first close Menus
        self.closeStateMenu();
        self.closeTransitionMenu();
        //Clear the content of the svg
        self.svgTransitions.html("");
        self.svgStates.html("");
        $scope.drawnTransitions = [];
        //change the scale and the translate to the defaultConfit
        self.svg.attr("transform", "translate(" + $scope.defaultConfig.diagramm.x + "," + $scope.defaultConfig.diagramm.y + ")" + " scale(" + $scope.defaultConfig.diagramm.scale + ")");
        svgOuterZoomAndDrag.scale($scope.defaultConfig.diagramm.scale);
        svgOuterZoomAndDrag.translate([$scope.defaultConfig.diagramm.x, $scope.defaultConfig.diagramm.y]);

    };

    /****ZOOMHANDLER START***/
    //amount the user can zoom out
    self.zoomMax = 2.5;
    //amount the user can zoom in
    self.zoomMin = 0.5;
    self.zoomValue = 0.1;

    self.zoomIn = function () {
        $scope.config.diagramm.scale = ($scope.config.diagramm.scale + self.zoomValue) > self.zoomMax ? $scope.config.diagramm.scale : Math.floor(($scope.config.diagramm.scale + self.zoomValue) * 100) / 100;
        self.updateZoomBehaviour();
    };
    self.zoomOut = function () {

        $scope.config.diagramm.scale = ($scope.config.diagramm.scale - self.zoomValue) <= self.zoomMin ? $scope.config.diagramm.scale : Math.floor(($scope.config.diagramm.scale - self.zoomValue) * 100) / 100;
        self.updateZoomBehaviour();

    };

    self.zoomTo = function (value) {
        console.log("zoomtedto");
        $scope.config.diagramm.scale = value / 100;
        $scope.safeApply();
        self.updateZoomBehaviour();
    };

    self.updateZoomBehaviour = function () {
        $scope.safeApply();
        self.svg.attr("transform", "translate(" + $scope.config.diagramm.x + "," + $scope.config.diagramm.y + ")" + " scale(" + $scope.config.diagramm.scale + ")");
        svgOuterZoomAndDrag.scale($scope.config.diagramm.scale);
        svgOuterZoomAndDrag.translate([$scope.config.diagramm.x, $scope.config.diagramm.y]);
    };


    /**
     * Scale and Translate the Svg to the default Value
     */
    self.scaleAndTranslateToDefault = function () {
        $scope.config.diagramm.scale = $scope.defaultConfig.diagramm.scale;
        $scope.config.diagramm.x = $scope.defaultConfig.diagramm.x;
        $scope.config.diagramm.y = $scope.defaultConfig.diagramm.y;
        $scope.safeApply();
        self.updateZoomBehaviour();
    };





    //the svgouterzoom and drag listener
    var svgOuterZoomAndDrag = d3.behavior
        .zoom()
        .scaleExtent([self.zoomMin, self.zoomMax])
        .on("zoom", function () {
            var stop = d3.event.button || d3.event.ctrlKey;
            if (stop) d3.event.stopImmediatePropagation(); // stop zoom
            //dont translate on right click (3)
            if (d3.event.sourceEvent.which !== 3) {
                var newScale = Math.floor(d3.event.scale * 100) / 100;

                $scope.config.diagramm.scale = newScale;
                $scope.config.diagramm.x = d3.event.translate[0];
                $scope.config.diagramm.y = d3.event.translate[1];
                $scope.safeApply();
                self.svg.attr("transform", "translate(" + $scope.config.diagramm.x + "," + $scope.config.diagramm.y + ")" + " scale(" + $scope.config.diagramm.scale + ")");
            } else {
                console.log("rightclick!");
            }
        });


    //prevents the normal rightclickcontextmenu and add zoom
    self.svgOuter = d3.select(svgSelector)
        .call(svgOuterZoomAndDrag)
        //prevents doubleclick zoom
        .on("dblclick.zoom", null)
        //adds our custom context menu on rightclick
        .on("contextmenu", function () {
            d3.event.preventDefault();
        });

    self.addSvgOuterClickListener = function () {
        self.svgOuter.on("click", function () {
            if (!self.preventSvgOuterClick) {
                self.closeStateMenu();
                self.closeTransitionMenu();
                $scope.safeApply();
            } else {
                //remove clickbool
                self.preventSvgOuterClick = false;
            }
        });
    };
    //add at the start
    self.addSvgOuterClickListener();

    //the html element where we put the svgGrid into
    self.svgGrid = self.svgOuter.append("g").attr("id", "grid");

    //inner svg
    self.svg = self.svgOuter
        .append("g")
        .attr("id", "svg-items");


    //first draw the transitions -> nodes are in front of them if they overlap
    self.svgTransitions = self.svg.append("g").attr("id", "transitions");
    self.svgStates = self.svg.append("g").attr("id", "states");


    //the space between each SnappingPoint 1:(0,0)->2:(0+gridSpace,0+gridSpace)
    self.gridSpace = 100;
    //the distance when the state is snapped to the next SnappingPoint (Rectangle form)
    self.gridSnapDistance = 20;
    //is Grid drawn
    self.isGrid = false;

    //watcher for the grid when changed -> updateGrid
    $scope.$watch('[graphdesigner.isGrid , config.diagramm]', function () {
        self.drawGrid();
    }, true);

    /**
     * Draw the Grid
     */
    self.drawGrid = function () {
        if (self.isGrid) {
            //clear grid
            self.svgGrid.html("");
            var width = self.svgOuter.style("width").replace("px", "");
            var height = self.svgOuter.style("height").replace("px", "");
            var thickness = 1 * $scope.config.diagramm.scale * 0.5;
            var xOffset = ($scope.config.diagramm.x % (self.gridSpace * $scope.config.diagramm.scale));
            var yOffset = ($scope.config.diagramm.y % (self.gridSpace * $scope.config.diagramm.scale));
            var i;
            //xGrid
            for (i = xOffset; i < width; i += self.gridSpace * $scope.config.diagramm.scale) {
                self.svgGrid
                    .append("line")
                    .attr("stroke-width", thickness)
                    .attr("class", "grid-line xgrid-line")
                    .attr("x1", i)
                    .attr("y1", 0)
                    .attr("x2", i)
                    .attr("y2", height);
            }
            //yGrid
            for (i = yOffset; i < height; i += self.gridSpace * $scope.config.diagramm.scale) {
                self.svgGrid
                    .append("line")
                    .attr("stroke-width", thickness)
                    .attr("class", "grid-line ygrid-line")
                    .attr("x1", 0)
                    .attr("y1", i)
                    .attr("x2", width)
                    .attr("y2", i);
            }
        } else {
            //undraw Grid
            self.svgGrid.html("");
        }
    };


    //DEFS
    self.defs = self.svg.append('svg:defs');
    //Marker-Arrow ( for the transitions)
    self.defs.append('svg:marker')
        .attr('id', 'marker-end-arrow')
        .attr('refX', 9)
        .attr('refY', 3)
        .attr('markerWidth', 10)
        .attr('markerHeight', 10)
        .attr('orient', 'auto')
        .append('svg:path')
        .attr('d', 'M0,0 L0,6 L9,3 z');
    self.defs.append('svg:marker')
        .attr('id', 'marker-end-arrow-animated')
        .attr('refX', 9)
        .attr('refY', 3)
        .attr('markerWidth', 10)
        .attr('markerHeight', 10)
        .attr('orient', 'auto')
        .append('svg:path')
        .attr('d', 'M0,0 L0,6 L9,3 z');
    self.defs.append('svg:marker')
        .attr('id', 'marker-end-arrow-hover')
        .attr('refX', 9)
        .attr('refY', 3)
        .attr('markerWidth', 10)
        .attr('markerHeight', 10)
        .attr('orient', 'auto')
        .append('svg:path')
        .attr('d', 'M0,0 L0,6 L9,3 z');
    self.defs.append('svg:marker')
        .attr('id', 'marker-end-arrow-selection')
        .attr('refX', 9)
        .attr('refY', 3)
        .attr('markerWidth', 10)
        .attr('markerHeight', 10)
        .attr('orient', 'auto')
        .append('svg:path')
        .attr('d', 'M0,0 L0,6 L9,3 z');


    /**
     * Reset all the AddListeners
     */
    self.resetAddActions = function () {
        self.closeStateMenu();
        self.closeTransitionMenu();
        self.svgOuter.on("click", null);
        self.inAddTransition = false;
        self.inAddState = false;
    };

    /**
     * AddState -> creates a new state when clicked on the button with visual feedback
     */
    self.addState = function () {
        self.resetAddActions();
        //add listener that the selectedstate follows the mouse
        self.svgOuter.on("mousemove", function () {
            //move the state (only moved visually not saved)
            self.selectedState.objReference.attr("transform", "translate(" + ((d3.mouse(this)[0])) + " " +
                ((d3.mouse(this)[1])) + ")");
        });
        //create a new selectedState in a position not viewable
        self.selectedState = $scope.addStateWithPresets(-10000, -10000);
        //add a class to the state (class has opacity)
        self.selectedState.objReference.classed("state-in-creation", true);
        self.svgOuter.on("click", function () {
            //remove class
            self.selectedState.objReference.classed("state-in-creation", false);
            //update the stateData

            self.selectedState.x = (d3.mouse(this)[0]);
            self.selectedState.y = (d3.mouse(this)[1]);
            //remove mousemove listener
            self.svgOuter.on("mousemove", null);
            //overwrite the click listener
            self.addSvgOuterClickListener();
            self.preventSvgOuterClick = false;
            $scope.safeApply();

        });
    };

    /**
     * Addtransition function for the icon
     */
    self.addTransition = function () {
        self.resetAddActions();
        //prevent dragging during addTransition
        self.preventStateDragging = true;
        //1. FirstClick: select a state and create a tmpLine for visual feedback
        //SecondClick: Create a transition from selectState to the clickedState
        d3.selectAll(".state").on("click", function () {
            self.mouseInState = true;
            //if there is no selected state then select a state
            if (self.selectedState === null) {
                self.selectedState = $scope.getStateById(parseInt(d3.select(this).attr("object-id")));
                self.toggleState(self.selectedState.id, true);

                //create tmpLine
                self.tmpTransition = self.svgTransitions.append("g")
                    .attr("class", "transition");
                //the line itself with the arrow without the path itself
                self.tmpTransitionline = self.tmpTransition.append("path")
                    .attr("class", "transition-line curvedLine in-creation")
                    .attr("marker-end", "url(#marker-end-arrow)")
                    .attr("fill", "none");

                //if already selected a state then create transition to the clickedState
            } else {
                $scope.addTransition(self.selectedState.id, parseInt(d3.select(this).attr("object-id")), "&");
                self.toggleState(self.selectedState.id, false);
                self.tmpTransition.remove();
                self.tmpTransition = null;
                self.tmpTransitionline = null;
                self.preventStateDragging = false;
                //update the svgOuter listeners
                self.addSvgOuterClickListener();
                self.svgOuter.on("mousemove", null);
                //update state listeners
                d3.selectAll(".state").on("mouseover", null);
                d3.selectAll(".state").on("mouseleave", null);
                d3.selectAll('.state').on('click', self.openStateMenu);
            }

        });
        //2. if the mouse moves on the svgOuter and not on a state, then update the tmpLine
        self.svgOuter.on("mousemove", function () {
            if (!self.mouseInState && self.selectedState !== null) {
                var pathLine = self.bezierLine([[self.selectedState.x, self.selectedState.y], [d3.mouse(this)[0], d3.mouse(this)[1]]]);
                self.tmpTransitionline.attr("d", pathLine);
            }
        });

        //3. if the mouse moves on a state then give a visual feedback how the line connects with the state
        d3.selectAll(".state").on("mouseover", function (i) {
            //see 2.
            self.mouseInState = true;
            //we need an other state to connect the line
            if (self.selectedState !== null) {
                var otherState = $scope.getStateById(d3.select(this).attr("object-id"));
                var transition = {};
                transition.fromState = self.selectedState.id;
                transition.toState = otherState.id;
                var line = self.tmpTransitionline;
                if (!self.existDrawnTransition(self.selectedState.fromState, self.selectedState.toState)) {
                    //the group element
                    //if it is not a self Reference
                    if (transition.fromState != transition.toState) {
                        var coordObj = self.getTransitionCoordinates(transition.fromState, transition.toState);
                        self.getTransitionCurveData(coordObj);
                        var curveData = null;
                        //if there is a transition in the other direction
                        if (self.existDrawnTransition(transition.toState, transition.fromState)) {



                            //other transition in the other direction
                            var otherCoordObj = self.getTransitionCoordinates(transition.toState, transition.fromState);
                            var otherCurveData = self.transitionCurve(otherCoordObj, false);
                            var otherTrans = self.getDrawnTransition(transition.toState, transition.fromState);
                            otherTrans.objReference.select(".transition-line").attr("d", otherCurveData);
                            otherTrans.objReference.select(".transition-text")
                                .attr("x", (otherCoordObj.xMidPoint))
                                .attr("y", (otherCoordObj.yMidPoint));
                            //update the transition text position
                            self.otherTransition = otherTrans;

                        } else {

                        }
                        //get the curve data ( depends if there is a transition in the oposite direction)
                        curveData = self.transitionCurve(coordObj, !self.existDrawnTransition(transition.toState, transition.fromState));
                        line.attr("d", curveData);
                        //if it is a selfreference
                    } else {
                        var stateId = $scope.getArrayStateIdByStateId(transition.fromState);
                        var x = $scope.config.states[stateId].x;
                        var y = $scope.config.states[stateId].y;
                        line.attr("d", self.selfTransition(x, y));
                    }
                    //if there is already a transition with the same fromState and toState then the current
                } else {
                    //add the name to the drawnTransition
                    var drawnTransition = self.getDrawnTransition(transition.fromState, transition.toState);
                    drawnTransition.names.push(transition.name);
                    //drawn the new name to the old transition (svg)
                    drawnTransition.objReference.select(".transition-text").text(self.prepareTransitionNamesForSvg(drawnTransition.names));


                }
                self.tmpTransitionline.attr("x1", self.selectedState.x)
                    .attr("y1", self.selectedState.y)
                    .attr("x2", otherState.x)
                    .attr("y2", otherState.y);
            }
        }).on("mouseleave", function () {
            self.mouseInState = false;
            //remove the visual feedback from transition going against our tmpLine
            if (self.otherTransition !== null && self.otherTransition !== undefined) {
                var otherCoordObj = self.getTransitionCoordinates(self.otherTransition.fromState, self.otherTransition.toState);
                var otherCurveData = self.transitionCurve(otherCoordObj, !self.existDrawnTransition(self.otherTransition.toState, self.otherTransition.fromState));
                self.otherTransition.objReference.select(".transition-line").attr("d", otherCurveData);
                self.otherTransition.objReference.select(".transition-text")
                    .attr("x", (otherCoordObj.xMid))
                    .attr("y", (otherCoordObj.yMid));
            }
        });
    };



    /**
     * Renames the state in the svg after the $scope variable was changed
     * @param  {number} stateId      
     * @param  {String} newStateName          
     */
    self.renameState = function (stateId, newStateName) {
        var state = $scope.config.states[$scope.getArrayStateIdByStateId(stateId)];
        var objReference = state.objReference;
        objReference.select("text").text(newStateName);
    };

    /**
     * Removes the state with the given id
     * @param  {number} stateId 
     */
    self.removeState = function (stateId) {
        self.closeStateMenu();
        var state = $scope.config.states[$scope.getArrayStateIdByStateId(stateId)];
        var objReference = state.objReference;
        objReference.remove();
    };


    self.renameTransition = function (fromState, toState, transitionId, newTransitionName) {
        //change it in drawnTransition
        var drawnTransition = self.getDrawnTransition(fromState, toState);
        var drawnTransitionName = _.find(drawnTransition.names, {
            "id": transitionId
        });
        console.log(drawnTransitionName);
        drawnTransitionName.name = newTransitionName;

        //change it on the svg
        drawnTransition.objReference.select(".transition-text").text(self.prepareTransitionNamesForSvg(drawnTransition.names));
    };


    self.removeTransition = function (transitionId) {
        var tmpTransition = $scope.getTransitionById(transitionId);
        var tmpDrawnTransition = self.getDrawnTransition(tmpTransition.fromState,tmpTransition.toState);
        self.closeTransitionMenu();
        //if its the only transition in the drawn transition -> then remove the drawn transition
        if(tmpDrawnTransition.names.length === 1){
            tmpDrawnTransition.objReference.remove();
            _.remove($scope.drawnTransitions,function(n){
                console.log(n);
                return n == tmpDrawnTransition;
            });
        }
        //if there are other transitions with the same from- and tostate, then remove the transition from the names and redraw the text
        else{
            _.remove(tmpDrawnTransition.names,function(n){
               return n.id ==tmpTransition.id;
            });
            tmpDrawnTransition.objReference.select("text").text(self.prepareTransitionNamesForSvg(tmpDrawnTransition.names));
        }
    };

    self.addFinalState = function (stateId) {
        var state = $scope.getStateById(stateId);
        state.objReference.insert("circle", ".state-circle")
            .attr("class", "final-state")
            .attr("r", self.settings.finalStateRadius);
    };

    /**
     * Removes a final state on the svg
     * @param {number} stateId 
     */
    self.removeFinalState = function (stateId) {
        var state = $scope.getStateById(stateId);
        state.objReference.select(".final-state").remove();
    };



    /**
     * Changes the StartState to the stateid
     * @param {number} stateId 
     */
    self.changeStartState = function (stateId) {
        //TODO:
        //remove old startState
        if ($scope.config.startState !== null) {
            var state = $scope.getStateById($scope.config.startState);
            state.objReference.select(".start-line").remove();
        }

        var otherState = $scope.getStateById(stateId);
        otherState.objReference.append("line")
            .attr("class", "transition-line start-line")
            .attr("x1", 0)
            .attr("y1", 0 - 75)
            .attr("x2", 0)
            .attr("y2", 0 - self.settings.stateRadius)
            .attr("marker-end", "url(#marker-end-arrow)");
    };

    /**
     * removes the stateId
     * @param {number} stateId
     */
    self.removeStartState = function (stateId) {
        var state = $scope.getStateById($scope.config.startState);
        state.objReference.select(".start-line").remove();
    };

    /**
     * Draws a State 
     * @param  {number} id the stateid
     * @return {Reference}    Returns the reference of the group object
     */
    self.drawState = function (id) {
        var state = $scope.getStateById(id);
        var group = self.svgStates.append("g")
            .attr("transform", "translate(" + state.x + " " + state.y + ")")
            .attr("class", "state " + "state-" + state.id)
            .attr("object-id", state.id); //save the state-id

        var circle = group.append("circle")
            .attr("class", "state-circle")
            .attr("r", self.settings.stateRadius);
        //for outer circle dotted when selected
        var selectedCircle = group.append("circle")
            .attr("class", "selected-circle")
            .attr("r", self.settings.stateRadius + 6);

        var hoverCircle = group.append("circle")
            .attr("class", "state-circle hover-circle")
            .attr("r", self.settings.stateRadius);

        var text = group.append("text")
            .text(state.name)
            .attr("class", "state-text")
            .attr("dominant-baseline", "central")
            .attr("text-anchor", "middle");

        state.objReference = group;
        group.on('click', self.openStateMenu)
            .call(self.dragState);
        return group;
    };

    /**
     * Adds or remove a class to a state ( only the svg state)
     * @param {number} stateId 
     * @param {Boolean} state   
     * @param {String} className  
     */
    self.setStateClassAs = function (stateId, state, className) {
        var objReference = $scope.getStateById(stateId).objReference;
        objReference.classed(className, state);
    };

    self.setTransitionClassAs = function (transitionId, state, className) {
        var trans = $scope.getTransitionById(transitionId);
        var objReference = self.getDrawnTransition(trans.fromState, trans.toState).objReference;
        objReference.classed(className, state);
        if (state && className == 'animated-transition') {
            objReference.select(".transition-line").attr("marker-end", "url(#marker-end-arrow-animated)");
        } else {
            objReference.select(".transition-line").attr("marker-end", "url(#marker-end-arrow)");
        }
    };

    self.setArrowMarkerTo = function (transLine, suffix) {

        if (suffix !== '') {
            transLine.select('.transition-line').attr("marker-end", "url(#marker-end-arrow-" + suffix + ")");
        } else {
            transLine.select('.transition-line').attr("marker-end", "url(#marker-end-arrow)");
        }
    };


    /**
     * Opens the StateMenu
     */
    self.openStateMenu = function (d, i) {

        self.closeStateMenu();
        self.closeTransitionMenu();

        self.preventSvgOuterClick = true;
        self.showStateMenu = true;

        self.selectedState = $scope.getStateById(parseInt(d3.select(this).attr("object-id")));
        //add new state as selected
        self.toggleState(self.selectedState.id, true);

        //save the state values in the state context as default value
        self.input = {};
        self.input.state = self.selectedState;
        self.input.stateName = self.selectedState.name;
        self.input.startState = $scope.config.startState == self.selectedState.id;
        self.input.finalState = $scope.isStateAFinalState(self.selectedState.id);
        self.input.renamedError = false;
        $scope.safeApply();
        self.stateMenuListener = [];
        self.stateMenuListener.push($scope.$watch('graphdesigner.input.startState', function () {
            if (self.selectedState !== null) {
                if (self.input.startState) {
                    $scope.changeStartState(self.input.state.id);
                } else {
                    if (self.selectedState.id == $scope.config.startState)
                        $scope.removeStartState();
                }
            }
        }));
        self.stateMenuListener.push($scope.$watch('graphdesigner.input.finalState', function () {
            if (self.selectedState !== null) {
                if (self.input.finalState) {
                    $scope.addFinalState(self.input.state.id);
                } else {
                    $scope.removeFinalState(self.input.state.id);
                }
            }
        }));
        self.stateMenuListener.push($scope.$watch('graphdesigner.input.stateName', function (newValue, oldValue) {
            if (newValue !== oldValue)
                self.input.renamedError = !$scope.renameState(self.input.state.id, newValue);

        }));
    };


    self.closeStateMenu = function () {
        //remove old StateMenuListeners
        _.forEach(self.stateMenuListener, function (value, key) {
            value();
        });
        if (self.selectedState !== null) {
            self.toggleState(self.selectedState.id, false);
        }
        self.showStateMenu = false;

        //delete input
        self.input = null;
    };

    self.toggleState = function (stateId, bool) {
        self.setStateClassAs(stateId, bool, "active");
        if (bool === false) {
            self.selectedState = null;
        }

    };


    //Node drag and drop behaviour
    self.dragState = d3.behavior.drag()
        .on("dragstart", function () {
            //stops drag bugs when wanted to click
            self.dragAmount = 0;
            d3.event.sourceEvent.stopPropagation();
        })
        .on("drag", function () {

            if (d3.event.sourceEvent.which == 1) {
                if (!self.preventStateDragging) {
                    self.dragAmount++;

                    var x = d3.event.x;
                    var y = d3.event.y;

                    if (self.snapping) {


                        var snapPointX = x - (x % self.gridSpace);
                        var snapPointY = y - (y % self.gridSpace);

                        //check first snapping Point (top left)
                        if (x > snapPointX - self.gridSnapDistance && x < snapPointX + self.gridSnapDistance && y > snapPointY - self.gridSnapDistance && y < snapPointY + self.gridSnapDistance) {
                            x = snapPointX;
                            y = snapPointY;
                            //second snapping point (top right)
                        } else if (x > snapPointX + self.gridSpace - self.gridSnapDistance && x < snapPointX + self.gridSpace + self.gridSnapDistance && y > snapPointY - self.gridSnapDistance && y < snapPointY + self.gridSnapDistance) {
                            x = snapPointX + self.gridSpace;
                            y = snapPointY;
                            //third snapping point (bot left)
                        } else if (x > snapPointX - self.gridSnapDistance && x < snapPointX + self.gridSnapDistance && y > snapPointY + self.gridSpace - self.gridSnapDistance && y < snapPointY + self.gridSpace + self.gridSnapDistance) {
                            x = snapPointX;
                            y = snapPointY + self.gridSpace;
                            //fourth snapping point (bot right)
                        } else if (x > snapPointX + self.gridSpace - self.gridSnapDistance && x < snapPointX + self.gridSpace + self.gridSnapDistance && y > snapPointY + self.gridSpace - self.gridSnapDistance && y < snapPointY + self.gridSpace + self.gridSnapDistance) {
                            x = snapPointX + self.gridSpace;
                            y = snapPointY + self.gridSpace;
                        }
                    }

                    //on drag isnt allowed workaround for bad drags when wanted to click
                    if (self.dragAmount > 1) {

                        //update the shown node
                        d3.select(this)
                            .attr("transform", "translate(" + x + " " + y + ")");
                        //update the node in the array

                        var stateId = d3.select(this).attr("object-id");
                        var tmpState = $scope.getStateById(stateId);
                        //update the state coordinates in the dataobject
                        tmpState.x = x;
                        tmpState.y = y;

                        //update the transitions after dragging a node
                        self.updateTransitionsAfterStateDrag(d3.select(this).attr("object-id"));
                    }
                }
            }

        }).on("dragend", function () {
            //save the movement
            if (self.dragAmount > 1) {
                $scope.safeApply();
            }
        });

    /**
     * [getTransitionCoordinates description]
     * @param  {[type]} transitionId [description]
     * @return {[type]}              [description]
     */
    self.getTransitionCoordinates = function (fromStateId, toStateId) {
        var fromState = $scope.getStateById(fromStateId);
        var toState = $scope.getStateById(toStateId);
        var x1 = fromState.x;
        var y1 = fromState.y;
        var x2 = toState.x;
        var y2 = toState.y;
        var richtungsvektor = {
            "x": x2 - x1,
            "y": y2 - y1
        };
        var richtungsVectorLength = Math.sqrt(richtungsvektor.x * richtungsvektor.x + richtungsvektor.y * richtungsvektor.y),
            n = self.settings.stateRadius / richtungsVectorLength;
        x1 = x1 + n * richtungsvektor.x;
        y1 = y1 + n * richtungsvektor.y;
        x2 = x2 - n * richtungsvektor.x;
        y2 = y2 - n * richtungsvektor.y;
        var coordObj = {
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            xDiff: x2 - x1,
            yDiff: y2 - y1,
            xMid: (x1 + x2) / 2,
            yMid: (y1 + y2) / 2
        };
        coordObj.distance = Math.sqrt(coordObj.xDiff * coordObj.xDiff + coordObj.yDiff * coordObj.yDiff);


        return coordObj;

    };


    self.getTransitionCurveData = function (coordObj) {
        var vecA = {
            x: coordObj.xMid - coordObj.x1,
            y: coordObj.yMid - coordObj.y1,
            z: 0
        };

        var vecB = {
            x: 0,
            y: 0,
            z: 1
        };

        coordObj.movingPoint = crossPro(vecA, vecB);
        coordObj.movingPoint = expandVector(coordObj.movingPoint, 70 * (1 / coordObj.distance * 1.1));

        coordObj.xMidPoint = coordObj.movingPoint.x + coordObj.xMid;
        coordObj.yMidPoint = coordObj.movingPoint.y + coordObj.yMid;
        return coordObj;
    };

    function crossPro(a, b) {

        var vecC = {
            x: a.y * b.z,
            y: -a.x * b.z

        };
        return vecC;
    }

    function expandVector(a, factor) {
        return {
            x: a.x * factor,
            y: a.y * factor
        };
    }


    self.bezierLine = d3.svg.line()
        .x(function (d) {
            return d[0];
        })
        .y(function (d) {
            return d[1];
        })
        .interpolate("basis");


    self.selfTransition = function (x, y) {
        return self.bezierLine([
            [x - self.stateSelfReferenceNumber, y - self.stateSelfReferenceNumber],
            [x - self.stateSelfReferenceNumber - stretchX, y - self.stateSelfReferenceNumber - stretchY],
            [x - self.stateSelfReferenceNumber - stretchX, y + self.stateSelfReferenceNumber + stretchY],
            [x - self.stateSelfReferenceNumber, y + self.stateSelfReferenceNumber]
        ]);
    };

    self.transitionCurve = function (coordObj, justStraight) {
        self.getTransitionCurveData(coordObj);
        var array = null;
        if (!justStraight) {
            array = [
                [coordObj.x1, coordObj.y1],
                [coordObj.xMidPoint, coordObj.yMidPoint],
                [coordObj.x2, coordObj.y2]
            ];
        } else {
            array = [
                [coordObj.x1, coordObj.y1],
                [coordObj.x2, coordObj.y2]
            ];
        }
        return self.bezierLine(array);
    };

    /**
     * Draw a Transition
     * @param  {number} id 
     * @return {object}  Retruns the reference of the group object
     */
    self.drawTransition = function (transitionId) {
        console.log(transitionId);
        var transition = $scope.getTransitionById(transitionId);
        console.log(transition);
        //if there is not a transition with the same from and toState
        if (!self.existDrawnTransition(transition.fromState, transition.toState)) {
            //the group element
            var group = self.svgTransitions.append("g")
                .attr("class", "transition"),
                //the line itself with the arrow
                line = group.append("path")
                .attr("class", "transition-line")
                .attr("fill", "none")
                .attr("marker-end", "url(#marker-end-arrow)"),
                lineSelection = group.append("path")
                .attr("class", "transition-line-selection")
                .attr("fill", "none")
                .attr("marker-end", "url(#marker-end-arrow-selection)"),
                lineClickArea = group.append("path")
                .attr("class", "transition-line-click")
                .attr("stroke-width", 20)
                .attr("stroke", "transparent")
                .attr("fill", "none"),
                lineHover = group.append("path")
                .attr("class", "transition-line-hover")
                .attr("fill", "none")
                .attr("marker-end", "url(#marker-end-arrow-hover)"),
                //the text of the transition
                text = group.append("text")
                .attr("class", "transition-text")
                .attr("fill", "black")
                .text(transition.name);
            //if it is not a self Reference
            if (transition.fromState != transition.toState) {
                var coordObj = self.getTransitionCoordinates(transition.fromState, transition.toState);
                self.getTransitionCurveData(coordObj);
                var curveData = null;
                //if there is a transition in the other direction
                if (self.existDrawnTransition(transition.toState, transition.fromState)) {

                    text.attr("class", "transition-text")
                        .attr("x", (coordObj.xMidPoint))
                        .attr("y", (coordObj.yMidPoint));

                    //other transition in the other direction
                    var otherCoordObj = self.getTransitionCoordinates(transition.toState, transition.fromState);
                    var otherCurveData = self.transitionCurve(otherCoordObj, false);
                    var otherTrans = self.getDrawnTransition(transition.toState, transition.fromState);
                    otherTrans.objReference.select(".transition-line").attr("d", otherCurveData);
                    otherTrans.objReference.select(".transition-line-selection").attr("d", otherCurveData);
                    otherTrans.objReference.select(".transition-line-hover").attr("d", otherCurveData);
                    otherTrans.objReference.select(".transition-line-click").attr("d", otherCurveData);
                    //update the transition text position
                    otherTrans.objReference.select(".transition-text")
                        .attr("x", (otherCoordObj.xMidPoint))
                        .attr("y", (otherCoordObj.yMidPoint));
                } else {
                    text.attr("x", (coordObj.xMid))
                        .attr("y", (coordObj.yMid));
                }
                //get the curve data ( depends if there is a transition in the oposite direction)
                curveData = self.transitionCurve(coordObj, !self.existDrawnTransition(transition.toState, transition.fromState));
                line.attr("d", curveData);
                lineSelection.attr("d", curveData);
                lineHover.attr("d", curveData);
                lineClickArea.attr("d", curveData);
                //if it is a selfreference
            } else {
                var stateId = $scope.getArrayStateIdByStateId(transition.fromState);
                var x = $scope.config.states[stateId].x;
                var y = $scope.config.states[stateId].y;

                line.attr("d", self.selfTransition(x, y));
                lineSelection.attr("d", self.selfTransition(x, y));
                lineHover.attr("d", self.selfTransition(x, y));
                lineClickArea.attr("d", self.selfTransition(x, y));
                text.attr("x", x - self.settings.stateRadius - 50)
                    .attr("y", y);
            }
            //add the drawnTransition
            group.attr("object-id", $scope.drawnTransitions.push({
                fromState: transition.fromState,
                toState: transition.toState,
                names: [{
                    "id": transition.id,
                    "name": transition.name
                }],
                objReference: group
            }) - 1).attr("from-state-id", transition.fromState).attr("to-state-id", transition.toState);
            group.on('click', self.openTransitionMenu)
                .on("mouseover", function () {
                    d3.select(this).select('.transition-line-hover').attr("style", "opacity:0.6");
                }).on("mouseleave", function () {
                    d3.select(this).select('.transition-line-hover').attr("style", "");
                });
            return group;
            //if there is already a transition with the same fromState and toState then the current
        } else {
            //add the name to the drawnTransition
            var drawnTransition = self.getDrawnTransition(transition.fromState, transition.toState);
            drawnTransition.names.push({
                "id": transition.id,
                "name": transition.name
            });
            //drawn the new name to the old transition (svg)
            drawnTransition.objReference.select(".transition-text").text(self.prepareTransitionNamesForSvg(drawnTransition.names));


        }
    };

    self.openTransitionMenu = function () {
        self.closeStateMenu();
        self.closeTransitionMenu();
        self.preventSvgOuterClick = true;
        self.showTransitionMenu = true;

        var fromState = d3.select(this).attr('from-state-id');
        var toState = d3.select(this).attr('to-state-id');
        self.selectedTransition = self.getDrawnTransition(fromState, toState);
        self.selectedTransition.objReference.classed("active", true);

        self.input = {};
        self.input.fromState = $scope.getStateById(fromState).name;
        self.input.toState = $scope.getStateById(toState).name;
        self.input.transitions = [];
        self.input.renamedError = false;


        _.forEach(self.selectedTransition.names, function (value, key) {
            var tmpObject = {};
            console.log(value);
            tmpObject = value;
            self.input.transitions.push(tmpObject);
        });

        self.transitionMenuListener = [];

        /*jshint -W083 */
        for (var key in $scope.graphdesigner.input.transitions) {
            self.transitionMenuListener.push($scope.$watch("graphdesigner.input.transitions['" + key + "'].name", function (val, oldVal, key) {
                // Do stuff
                    $scope.renameTransition($scope.getTransition(fromState, toState, oldVal).id, val);
            }));
        }


        $scope.safeApply();

    };

    self.closeTransitionMenu = function () {
        _.forEach(self.transitionMenuListener, function (value, key) {
            value();
        });
        self.showTransitionMenu = false;
        if (self.selectedTransition !== null) {
            self.selectedTransition.objReference.classed("active", false);
            self.selectedTransition = null;

        }
    };

    /**
     * Update the transitions in the svg after moving a state
     * @param  {number} stateId Moved stateId
     */
    self.updateTransitionsAfterStateDrag = function (stateId) {
        var stateName = $scope.config.states[$scope.getArrayStateIdByStateId(stateId)].name;
        _.forEach($scope.drawnTransitions, function (n, key) {
            if (n.fromState == stateId || n.toState == stateId) {
                //if its not a selfreference
                var obj = n.objReference,
                    transitionLine = obj.select(".transition-line"),
                    lineSelection = obj.select(".transition-line-selection"),
                    lineClickArea = obj.select(".transition-line-click"),
                    lineHover = obj.select(".transition-line-hover"),
                    transitionText = obj.select("text");
                if (n.fromState != n.toState) {
                    var coordObj = self.getTransitionCoordinates(n.fromState, n.toState);
                    //if there is a transition in the other direction
                    if (self.existDrawnTransition(n.toState, n.fromState)) {
                        transitionLine.attr("d", self.transitionCurve(coordObj, false));
                        lineSelection.attr("d", self.transitionCurve(coordObj, false));
                        lineClickArea.attr("d", self.transitionCurve(coordObj, false));
                        lineHover.attr("d", self.transitionCurve(coordObj, false));
                        transitionText.attr("x", coordObj.xMidPoint).attr("y", coordObj.yMidPoint);
                    } else {
                        transitionLine.attr("d", self.transitionCurve(coordObj, true));
                        lineSelection.attr("d", self.transitionCurve(coordObj, true));
                        lineClickArea.attr("d", self.transitionCurve(coordObj, true));
                        lineHover.attr("d", self.transitionCurve(coordObj, true));
                        transitionText.attr("x", coordObj.xMid).attr("y", coordObj.yMid);
                    }
                } else {
                    var moveStateId = n.fromState;
                    var x = $scope.config.states[$scope.getArrayStateIdByStateId(moveStateId)].x;
                    var y = $scope.config.states[$scope.getArrayStateIdByStateId(moveStateId)].y;
                    //update Transistion with self reference
                    transitionLine.attr("d", self.selfTransition(x, y));
                    lineSelection.attr("d", self.selfTransition(x, y));
                    lineClickArea.attr("d", self.selfTransition(x, y));
                    lineHover.attr("d", self.selfTransition(x, y));
                    transitionText.attr("x", x - self.settings.stateRadius - 50).attr("y", y);
                }
            }
        });
    };

    /**************
     **SIMULATION**
     *************/


    $scope.$watch('simulator.animated.currentState', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            console.log("CURRENTSTATE:oldValue " + oldValue + " newvalue " + newValue);
            if (oldValue !== null) {
                self.setStateClassAs(oldValue, false, "animated-currentstate-svg");
            }
            if (newValue !== null) {
                self.setStateClassAs(newValue, true, "animated-currentstate-svg");
            }
        }
    });

    $scope.$watch('simulator.animated.transition', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            if (oldValue !== null) {
                self.setTransitionClassAs(oldValue.id, false, "animated-transition");
                //remove transitionname animation
            }
            if (newValue !== null) {
                self.setTransitionClassAs(newValue.id, true, "animated-transition");
                //animate transitionname
            }
        }
    });

    $scope.$watch('simulator.animated.nextState', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            console.log("NEXTSTATE: oldValue " + oldValue + " newvalue " + newValue);
            if (oldValue !== null) {
                self.setStateClassAs(oldValue, false, "animated-nextstate-svg");
            }
            if (newValue !== null) {
                self.setStateClassAs(newValue, true, "animated-nextstate-svg");
            }
        }
    });

}
