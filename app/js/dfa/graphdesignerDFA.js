"use strict";

//GRAPHDESIGNER for the svg diagramm
var graphdesignerDFA = function($scope, svgSelector) {

    var self = this;

    //prevents that the user can do more than one action
    self.inAction = false;
    //if this is true, then it calls the addClickfunction after the next
    self.inAddState = false;
    self.inAddTransition = false;
    self.selectedState = null;
    self.showStateContext = false;

    //graphdesigner settings
    self.settings = {
        stateRadius: 25,
        finalStateRadius: 29,
        selected: false
    };
    //is for the selfReference
    var stretchX = 40;
    var stretchY = 18;

    //has the drawn Transition
    //{fromState:0,toState:0,names:["a","b"], objReference:};
    //if there is already a transition with the right fromState and toState, thenn only add myname to the names array
    self.drawnTransitions = [];

    self.existDrawnTransition = function(fromState, toState) {

        var tmp = false;
        for (var i = 0; i < self.drawnTransitions.length; i++) {
            var transition = self.drawnTransitions[i];
            if (transition.fromState == fromState && transition.toState == toState) {
                tmp = true;
            }
        }
        return tmp;
    }

    self.getTransition = function(fromState, toState) {
        for (var i = 0; i < self.drawnTransitions.length; i++) {
            var transition = self.drawnTransitions[i];
            if (transition.fromState == fromState && transition.toState == toState) {
                return transition;
            }
        }
    }

    self.getTransitionNames = function(names) {
        var tmpString = '';
        for (var i = 0; i < names.length; i++) {
            tmpString += names[i] + " | ";
        }
        tmpString = tmpString.slice(0, -2);
        return tmpString;
    }

    //has all the drawn States
    //{id:0, objectReference:} ??
    self.drawnStates = [];

    self.stateSelfReferenceNumber = Math.sin(45 * (Math.PI / 180)) * self.settings.stateRadius;


    self.clearSvgContent = function(config) {
        //Clear the content of the svg
        self.svgTransitions.html("");
        self.svgStates.html("");
        //change the scale and the translate to the updatedConfig
        self.svg.attr("transform", "translate(" + $scope.config.diagrammX + "," + $scope.config.diagrammY + ")" + " scale(" + $scope.config.diagrammScale + ")");
        zoom.scale($scope.config.diagrammScale);
        zoom.translate([$scope.config.diagrammX, $scope.config.diagrammY]);
        self.drawnTransitions = [];

    }
    self.svgOuter = d3.select(svgSelector)
        //prevents the normal rightclickcontextmenu
        .on("contextmenu", function() {
            d3.event.preventDefault();
        })

    self.svgZoom = function() {
        //LEFTCLICK
        if (d3.event.sourceEvent.which == 1) {
            if (!self.dragInitiated && !self.rightClick) {
                self.svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
                $scope.config.diagrammScale = d3.event.scale;
                $scope.config.diagrammX = d3.event.translate[0];
                $scope.config.diagrammY = d3.event.translate[1];
                $scope.safeApply();
            }
            //RIGHT CLICK
        } else if (d3.event.sourceEvent.which == 3) {

        }
    }

    self.rescale = function() {
        self.svg.attr("transform", "translate( 0 0 )" + " scale( 1 )");
        $scope.config.diagrammScale = 1;
        $scope.config.diagrammX = 0;
        $scope.config.diagrammY = 0;
        $scope.safeApply();
        zoom.scale(1);
        zoom.translate([0, 0]);
    }

    var zoom = d3.behavior.zoom();
    zoom.translate([0, 0]);
    //TODO: Bug when moving all the objects.
    //u can move the whole diagramm and zome in and out
    self.svg = self.svgOuter
        .call(zoom.on("zoom", self.svgZoom))
        .append("g")
        .attr("id", "svg-items");


    //first draw the transitions -> nodes are in front of them if they overlap
    self.svgTransitions = self.svg.append("g").attr("id", "transitions");
    self.svgStates = self.svg.append("g").attr("id", "states");
    self.stateContext = d3.select("#stateContext");


    //DEFS
    self.defs = self.svg.append('svg:defs');
    //Marker-Arrow
    self.defs.append('svg:marker')
        .attr('id', 'marker-end-arrow')
        .attr('refX', 8)
        .attr('refY', 3)
        .attr('markerWidth', 10)
        .attr('markerHeight', 10)
        .attr('orient', 'auto')
        .append('svg:path')
        .attr('d', 'M0,0 L0,6 L9,3 z');
    self.defs.append('svg:marker')
        .attr('id', 'marker-end-arrow-animated')
        .attr('refX', 8)
        .attr('refY', 3)
        .attr('markerWidth', 10)
        .attr('markerHeight', 10)
        .attr('orient', 'auto')
        .append('svg:path')
        .attr('d', 'M0,0 L0,6 L9,3 z');

    /**
     *  Ressett addclicklistener ( addTransition and addstate)
     * @return {[type]} [description]
     */
    self.resetAdds = function() {
        if (self.selectedState != null) {
            self.setStateClassAs(self.selectedState.attr("object-id"), false, "selectedForTransition");
            self.selectedState = null;
        }
        self.svgOuter.on("click", null);
        self.inAddTransition = false;
        self.inAddState = false;
    }


    /**
     * AddState function for the icon
     */
    self.addStateEventListener = function() {
        self.resetAdds();
        self.inAction = true;
        self.inAddState = true;
        //add listener
        self.svgOuter.on("click", function() {
            $scope.addStateWithPresets(d3.mouse(this)[0] - $scope.config.diagrammX, d3.mouse(this)[1] - $scope.config.diagrammY);
            self.inAddState = false;
            self.svgOuter.on("click", null);
        });
    }

    /**
     * Addtransition function for the icon
     */
    self.addTransitionEventListener = function() {
        self.resetAdds();
        self.inAction = true;
        self.inAddTransition = true;
        self.svgOuter.on("click", function() {});
    }

    self.removeEventListener = function() {
        self.resetAdds();
        self.inAction = true;
        self.inRemove = true;
    }


    /**
     * Renames the state in the svg after the $scope variable was changed
     * @param  {Int} stateId      
     * @param  {String} newStateName          
     */
    self.renameState = function(stateId, newStateName) {
        var state = $scope.config.states[$scope.getArrayStateIdByStateId(stateId)];
        var objReference = state.objReference;
        objReference.select("text").text(newStateName);
    }

    /**
     * Removes the state with the given id
     * @param  {Int} stateId 
     */
    self.removeState = function(stateId) {
        var state = $scope.config.states[$scope.getArrayStateIdByStateId(stateId)];
        var objReference = state.objReference;
        objReference.remove();
    }

    /**
     * [renameTransition description]
     * @param  {[type]} transitionId      [description]
     * @param  {[type]} newTransitionName [description]
     * @return {[type]}                   [description]
     */
    self.renameTransition = function(transitionId, newTransitionName) {

    }

    /**
     * [removeTransition description]
     * @param  {[type]} transitionId [description]
     * @return {[type]}              [description]
     */
    self.removeTransition = function(transitionId) {

    }

    self.addFinalState = function(stateId) {
        var state = $scope.getStateById(stateId);
        state.objReference.insert("circle", ".state-circle")
            .attr("class", "final-state")
            .attr("r", self.settings.finalStateRadius);
    }

    self.removeFinalState = function(stateId) {
        var state = $scope.getStateById(stateId);
        state.objReference.select(".final-state").remove();
    }



    /**
     * [changeStartState description]
     * @param  {[type]} stateId [description]
     * @return {[type]}         [description]
     */
    self.changeStartState = function(stateId) {
        //TODO:
        //remove old startState
        if ($scope.config.startState != null) {
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
    }

    self.removeStartState = function(stateId){
            var state = $scope.getStateById($scope.config.startState);
            state.objReference.select(".start-line").remove();
    }

    /**
     * Draws a State 
     * @param  {Int} id The arrayid of the State
     * @return {Reference}    Returns the reference of the group object
     */
    self.drawState = function(id) {
        var state = $scope.getStateById(id);
        var group = self.svgStates.append("g")
            .attr("transform", "translate(" + state.x + " " + state.y + ")")
            .attr("class", "state " + "state-" + state.id)
            .attr("object-id", state.id); //save the state-id

        var circleSelection = group.append("circle")
            .attr("class", "state-circle")
            .attr("r", self.settings.stateRadius);

        var hoverCircle = group.append("circle")
            .attr("class", "state-circle hover-circle")
            .attr("r", self.settings.stateRadius);

        var text = group.append("text")
            .text(state.name)
            .attr("class", "state-text")
            .attr("dominant-baseline", "central")
            .attr("text-anchor", "middle");

        $scope.config.states[id].objReference = group.on('contextmenu', self.stateMenu);
        d3.selectAll(".state").call(self.dragState);
        return group;
    }

    /**
     * Adds or remove a class to a state ( only the svg state)
     * @param {Int} stateId 
     * @param {Boolean} state   
     * @param {String} className  
     */
    self.setStateClassAs = function(stateId, state, className) {
        var objReference = $scope.getStateById(stateId).objReference;
        objReference.classed(className, state);
    }

    /**
     * [setTransitionAs description]
     * @param {[type]} transitionId [description]
     * @param {[type]} state        [description]
     */
    self.setTransitionClassAs = function(transitionId, state, className) {
        var trans = $scope.getTransitionById(transitionId);
        var objReference = self.getTransition(trans.fromState, trans.toState).objReference;
        objReference.classed(className, state);
        if (state && className == 'animated-transition') {
            objReference.select(".transition-line").attr("marker-end", "url(#marker-end-arrow-animated)");
        } else {
            objReference.select(".transition-line").attr("marker-end", "url(#marker-end-arrow)");
        }
    }

    /**
     * [stateMenu description]
     * @return {[type]} [description]
     */
    self.stateMenu = function() {
        //prevent the normal right click menu
        d3.event.preventDefault();
    }

    self.saveState = function() {
        $scope.renameState(self.input.state.id, self.input.stateName);
        if (self.input.startState) {
            $scope.changeStartState(self.input.state.id);
        }else{
            $scope.removeStartState();
        }
        if (self.input.finalState) {
            $scope.addFinalState(self.input.state.id);
        } else {
            $scope.removeFinalState(self.input.state.id);
        }
        self.showStateContext = false;
    }


    //Node drag and drop behaviour
    self.dragState = d3.behavior.drag()
        .on("dragstart", function() {
            //IF LEFT CLICK
            if (d3.event.sourceEvent.which == 1) {
                //if we are in a addTransition action
                if (self.inAddTransition) {
                    //if there is no selectedState, then select a state ( =>fromState)
                    if (!self.selectedState) {
                        self.selectedState = d3.select(this);
                        self.setStateClassAs(self.selectedState.attr("object-id"), true, "selectedForTransition");
                    } else {
                        $scope.addTransition(parseInt(self.selectedState.attr("object-id")), parseInt(d3.select(this).attr("object-id")), "c");
                        self.setStateClassAs(self.selectedState.attr("object-id"), false, "selectedForTransition");
                        self.selectedState = null;
                    }
                } else if (self.inRemove) {
                    $scope.removeState(parseInt(d3.select(this).attr("object-id")));
                } else {
                    self.dragInitiated = true;
                }
                //IF RIGHT CLICK
            } else if (d3.event.sourceEvent.which == 3) {
                //open context menu
                self.rightClick = true;
                self.showStateContext = true;

                //get the selected state
                var state = $scope.getStateById(parseInt(d3.select(this).attr("object-id")));
                //save the state values in the state context as default value
                self.input = {};
                self.input.state = state;
                self.input.stateName = state.name;
                self.input.startState = $scope.config.startState == state.id;
                self.input.finalState = $scope.isStateAFinalState(state.id);
                $scope.safeApply();

            }
        })
        .on("drag", function() {
            if (d3.event.sourceEvent.which == 1) {
                //cant move when inAddTransition action
                if (self.dragInitiated && !self.inAddTransition) {
                    var x = d3.event.x;
                    var y = d3.event.y;
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
                } else if (d3.event.sourceEvent.which == 3) {

                }
            }

        })
        .on("dragend", function() {
            if (self.dragInitiated) {
                self.dragInitiated = false;
                //Apply the canges after the dragend ->optimisation
                $scope.safeApply();
            } else if (d3.event.sourceEvent.which == 3) {
                self.rightClick = false;
            }
            if (self.selectedState == null) {
                self.resetAdds();
            }
            if (self.inRemove) {
                self.resetAdds();
                self.inRemove = false;
            }
            //fixes that the whole svg moves with the next move on the svg ( stupid workaround) BETTER SOLUTION?
            zoom.scale($scope.config.diagrammScale);
            zoom.translate([$scope.config.diagrammX, $scope.config.diagrammY]);
        });

    /**
     * [getTransitionCoordinates description]
     * @param  {[type]} transitionId [description]
     * @return {[type]}              [description]
     */
    self.getTransitionCoordinates = function(fromStateId, toStateId) {
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
        x1 = x1 + n * richtungsvektor.x,
            y1 = y1 + n * richtungsvektor.y,
            x2 = x2 - n * richtungsvektor.x,
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
        }

        return coordObj;

    }

    /**
     * [getTransitionCurveData description]
     * @param  {[type]} coordObj [description]
     * @return {[type]}          [description]
     */
    self.getTransitionCurveData = function(coordObj) {
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
        coordObj.movingPoint = expandVector(coordObj.movingPoint, 0.2);

        coordObj.xMidPoint = coordObj.movingPoint.x + coordObj.xMid;
        coordObj.yMidPoint = coordObj.movingPoint.y + coordObj.yMid;
        return coordObj;
    }

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

    /**
     * [bezierLine description]
     * @type {[type]}
     */
    self.bezierLine = d3.svg.line()
        .x(function(d) {
            return d[0];
        })
        .y(function(d) {
            return d[1];
        })
        .interpolate("basis");

    /**
     * [selfTransition description]
     * @param  {[type]} x [description]
     * @param  {[type]} y [description]
     * @return {[type]}   [description]
     */
    self.selfTransition = function(x, y) {
        return self.bezierLine([
            [x - self.stateSelfReferenceNumber, y - self.stateSelfReferenceNumber],
            [x - self.stateSelfReferenceNumber - stretchX, y - self.stateSelfReferenceNumber - stretchY],
            [x - self.stateSelfReferenceNumber - stretchX, y + self.stateSelfReferenceNumber + stretchY],
            [x - self.stateSelfReferenceNumber, y + self.stateSelfReferenceNumber]
        ]);
    }

    self.transitionCurve = function(coordObj) {
        self.getTransitionCurveData(coordObj);
        return self.bezierLine([
            [coordObj.x1, coordObj.y1],
            [coordObj.xMidPoint, coordObj.yMidPoint],
            [coordObj.xMidPoint, coordObj.yMidPoint],
            [coordObj.x2, coordObj.y2]
        ]);
    }

    /**
     * Draw a Transition
     * @param  {Int} id 
     * @return {Reference}  Retruns the reference of the group object
     */
    self.drawTransition = function(transitionId) {
        var arrayTransitionId = $scope.getArrayTransitionIdByTransitionId(transitionId);
        var transition = $scope.config.transitions[arrayTransitionId];
        //if there is not a transition with the same from and toState
        if (!self.existDrawnTransition(transition.fromState, transition.toState)) {
            //if it is not a self Reference
            if (transition.fromState != transition.toState) {
                var coordObj = self.getTransitionCoordinates(transition.fromState, transition.toState);
                self.getTransitionCurveData(coordObj);
                var group = self.svgTransitions.append("g")
                    .attr("class", "transition");

                var line = group.append("path")
                    .attr("class", "transition-line curvedLine")
                    .attr("d", self.transitionCurve(coordObj))
                    .attr("stroke", "red")
                    .attr("stroke-width", 1)
                    .attr("fill", "none")
                    /*.attr("x2", coordObj.xDiff)
                    .attr("y2", coordObj.yDiff)*/
                    .attr("marker-end", "url(#marker-end-arrow)");

                var text = group.append("text")
                    .attr("class", "transition-text")
                    .text(transition.name)
                    .attr("x", (coordObj.xMidPoint))
                    .attr("y", (coordObj.yMidPoint));

                //add the drawnTransition
                self.drawnTransitions.push({
                    fromState: transition.fromState,
                    toState: transition.toState,
                    names: [transition.name],
                    objReference: group
                });
                return group;
            } else {
                var stateId = $scope.getArrayStateIdByStateId(transition.fromState);
                var x = $scope.config.states[stateId].x;
                var y = $scope.config.states[stateId].y;

                var group = self.svgTransitions.append("g")
                    .attr("transform", "translate(0 0)")
                    .attr("class", "transition");

                var line = group.append('path')
                    .attr("class", "transition-line")
                    .attr("d", self.selfTransition(x, y))
                    .attr("stroke", "red")
                    .attr("stroke-width", 1)
                    .attr("fill", "none")
                    .attr("marker-end", "url(#marker-end-arrow)");

                var text = group.append("text")
                    .attr("class", "transition-text")
                    .text(transition.name)
                    .attr("x", x - self.settings.stateRadius - 50)
                    .attr("y", y);

                self.drawnTransitions.push({
                    fromState: transition.fromState,
                    toState: transition.toState,
                    names: [transition.name],
                    objReference: group
                });
                return group;
            }
        } else {
            var drawnTransition = self.getTransition(transition.fromState, transition.toState);
            drawnTransition.names.push(transition.name);
            //drawn the new name to the old transition
            console.log("added transitionname");
            console.log(drawnTransition);
            drawnTransition.objReference.select(".transition-text").text(self.getTransitionNames(drawnTransition.names));


        }
    }


    /**
     * Update the transitions in the svg after moving a state
     * @param  {Int} stateId Moved stateId
     */
    self.updateTransitionsAfterStateDrag = function(stateId) {
        var stateName = $scope.config.states[$scope.getArrayStateIdByStateId(stateId)].name;
        _.forEach(self.drawnTransitions, function(n, key) {
            if (n.fromState == stateId || n.toState == stateId) {

                if (n.fromState != n.toState) {
                    var obj = n.objReference;
                    var coordObj = self.getTransitionCoordinates(n.fromState, n.toState);
                    obj.select(".transition-line").attr("d", self.transitionCurve(coordObj));

                    obj.select("text")
                        .attr("x", coordObj.xMidPoint)
                        .attr("y", coordObj.yMidPoint);

                } else {
                    var moveStateId = n.fromState;
                    var x = $scope.config.states[$scope.getArrayStateIdByStateId(moveStateId)].x;
                    var y = $scope.config.states[$scope.getArrayStateIdByStateId(moveStateId)].y;
                    //update Transistion with self reference
                    var obj = n.objReference;
                    obj.select(".transition-line")
                        .attr("d", self.selfTransition(x, y));
                    obj.select("text").attr("x", x - self.settings.stateRadius - 50)
                        .attr("y", y);;
                }
            }
        });
    }

    $("div.close").click(function() {
        console.log("ASD");
    });
}
