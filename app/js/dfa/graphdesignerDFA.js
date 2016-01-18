"use strict";

//GRAPHDESIGNER for the svg diagramm
var graphdesignerDFA = function($scope, svgSelector) {

    var self = this;
    var stretch = 50;
    var stretchOther = 100;
    //UI
    //prevents that the user can do more than one action
    self.inAction = false;
    //if this is true, then it calls the addClickfunction after the next
    self.inAddState = false;
    self.inAddTransition = false;
    self.selectedState = null;

    //graphdesigner settings
    self.settings = {
        stateRadius: 25,
        finalStateRadius: 29,
        selected: false
    };

    self.updateConfig = function(config) {
        self.config = config;
        //Clear the content of the svg
        self.svgTransitions.html("");
        self.svgStates.html("");
        //change the scale and the translate to the updatedConfig
        //TODO: SOlution is not working after moving scale is & translate is resetted
        //self.svg.attr("transform", "translate(" +$scope.config.diagrammX+","+$scope.config.diagrammY + ")" + " scale(" +$scope.config.diagrammScale + ")");

    }
    self.svgOuter = d3.select(svgSelector);



    //TODO: Bug when moving all the objects.
    //u can move the whole diagramm and zome in and out
    self.svg = self.svgOuter.append("g").attr("id", "svg-items")
        //SO MUCH PROBLEMS COMMENTING UNTIL BETTER SOLUTION
        /*
            .call(d3.behavior.zoom().on("zoom", function() {
                
                
                    if (!self.dragInitiated && !self.rightClick) {
                        self.svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
                        $scope.config.diagrammScale = d3.event.scale;
                        $scope.config.diagrammX = d3.event.translate[0];
                        $scope.config.diagrammY = d3.event.translate[1];
                        $scope.safeApply();


                    }
                    
                }))*/
    ;

    //first draw the transitions -> nodes are in front of them if they overlap
    self.svgTransitions = self.svg.append("g").attr("id", "transitions");
    self.svgStates = self.svg.append("g").attr("id", "states");


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


    /**
     * AddState function for the icon
     */
    self.addState = function() {
        self.resetAdds();
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
    self.addTransition = function() {
        self.resetAdds();
        self.inAddTransition = true;
        self.svgOuter.on("click", function() {

        });

    }

    /**
     *  Ressett addclicklistener ( addTransition and addstate)
     * @return {[type]} [description]
     */
    self.resetAdds = function() {
        self.svgOuter.on("click", null);
        self.inAddTransition = false;
        self.inAddState = false;
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

        console.log("test");
        var otherState = $scope.getStateById(stateId);
        otherState.objReference.append("line")
            .attr("class", "transition-line start-line")
            .attr("x1", 0)
            .attr("y1", 0 - 75)
            .attr("x2", 0)
            .attr("y2", 0 - self.settings.stateRadius)
            .attr("marker-end", "url(#marker-end-arrow)");
    }

    self.removeFinalState = function(stateId) {

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
        if (_.include($scope.config.finalStates, state.id)) {
            var circleSelection = group.append("circle")
                .attr("class", "final-State")
                .attr("r", self.settings.finalStateRadius);
        }

        var circleSelection = group.append("circle")
            .attr("class", "state-circle")
            .attr("r", self.settings.stateRadius);

        var text = group.append("text")
            .text(state.name)
            .attr("class", "state-text")
            .attr("dominant-baseline", "central")
            .attr("text-anchor", "middle");

        $scope.config.states[id].objReference = group.on('contextmenu', self.stateMenu);
        return group;
    }

    /**
     * Adds or remove a class to a state ( only the svg state)
     * @param {Int} stateId 
     * @param {Boolean} state   
     * @param {String} className  
     */
    self.setClassStateAs = function(stateId, state, className) {
        var objReference = $scope.getStateById(stateId).objReference;
        objReference.classed(className, state);
    }

    /**
     * [setTransitionAs description]
     * @param {[type]} transitionId [description]
     * @param {[type]} state        [description]
     */
    self.setTransitionAs = function(transitionId, state) {
        var objReference = $scope.getTransitionById(transitionId).objReference;
        objReference.classed("visitedTransition", state);
    }

    /**
     * [stateMenu description]
     * @return {[type]} [description]
     */
    self.stateMenu = function() {
        //prevent the normal right click menu
        d3.event.preventDefault();

    }

    //Node drag and drop behaviour
    self.dragState = d3.behavior.drag()

    .on("dragstart", function() {
            if (d3.event.sourceEvent.which == 1) {
                self.dragInitiated = true;
                //if we are in a addTransition action
                if (self.inAddTransition) {
                    //if there is no selectedState
                    if (!self.selectedState) {
                        self.selectedState = d3.select(this);
                        self.setClassStateAs(self.selectedState.attr("object-id"), true, "selectedForTransition");
                    } else {
                        $scope.addTransition(self.selectedState.attr("object-id"), d3.select(this).attr("object-id"), "c");
                        self.setClassStateAs(self.selectedState.attr("object-id"), false, "selectedForTransition");
                        self.selectedState = null;
                        self.resetAdds();


                    }
                }
            } else {
                //open context menu
                self.rightClick = true;
            }
        })
        .on("drag", function() {
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
            }

        })
        .on("dragend", function() {
            if (self.dragInitiated) {
                self.dragInitiated = false;
                //Apply the canges after the dragend ->optimisation
                $scope.safeApply();
            } else if (self.rightClick) {
                self.rightClick = false;
            }

        });

    /**
     * [getTransitionCoordinates description]
     * @param  {[type]} transitionId [description]
     * @return {[type]}              [description]
     */
    self.getTransitionCoordinates = function(transitionId) {
        var transition = $scope.getTransitionById(transitionId);
        var fromState = $scope.getStateById(transition.fromState);
        var toState = $scope.getStateById(transition.toState);
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
            "x1": x1,
            "y1": y1,
            "x2": x2,
            "y2": y2,
            "xDiff": x2 - x1,
            "yDiff": y2 - y1
        }

        return coordObj;

    }

    /**
     * Draw a Transition
     * @param  {Int} id 
     * @return {Reference}  Retruns the reference of the group object
     */
    self.drawTransition = function(transitionId) {
        var arrayTransitionId = $scope.getArrayTransitionIdByTransitionId(transitionId);
        var transition = $scope.config.transitions[arrayTransitionId];
        //if it is not a self Reference
        if (transition.fromState != transition.toState) {
            var coordObj = self.getTransitionCoordinates(transitionId);
            var group = self.svgTransitions.append("g")
                .attr("transform", "translate(" + coordObj.x1 + " " + coordObj.y1 + ")")
                .attr("class", "transition");

            var line = group.append("line")
                .attr("class", "transition-line")
                .attr("x2", coordObj.xDiff)
                .attr("y2", coordObj.yDiff)
                .attr("marker-end", "url(#marker-end-arrow)");

            var text = group.append("text")
                .attr("class", "transition-text")
                .text(transition.name)
                .attr("x", (coordObj.xDiff) / 2)
                .attr("y", (coordObj.yDiff) / 2);

            $scope.config.transitions[transitionId].objReference = group;
            return group;
        } else {
            var stateId = $scope.getArrayStateIdByStateId(transition.fromState);
            var x = $scope.config.states[stateId].x;
            var y = $scope.config.states[stateId].y;

            var group = self.svgTransitions.append("g")
                //.attr("transform", "translate(" + x3 + " " + y3 + ")")
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
                .text(transition.name);

            $scope.config.transitions[transitionId].objReference = group;
            return group;

        }
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
            [x, y],
            [x - stretchOther, y + stretch],
            [x - stretch, y + stretchOther],
            [x, y]
        ]);
    }

    /**
     * Update the transitions in the svg after moving a state
     * @param  {Int} stateId Moved stateId
     */
    self.updateTransitionsAfterStateDrag = function(stateId) {
        var stateName = $scope.config.states[$scope.getArrayStateIdByStateId(stateId)].name;
        _.forEach($scope.config.transitions, function(n, key) {
            if (n.fromState == stateId || n.toState == stateId) {

                if (n.fromState != n.toState) {
                    var obj = n.objReference;
                    var coordObj = self.getTransitionCoordinates(n.id);


                    obj.attr("transform", "translate(" + coordObj.x1 + " " + coordObj.y1 + ")");

                    obj.select("line")
                        .attr("x2", coordObj.xDiff)
                        .attr("y2", coordObj.yDiff);


                    obj.select("text")
                        .attr("x", (coordObj.xDiff) / 2)
                        .attr("y", (coordObj.yDiff) / 2);

                } else {
                    var moveStateId = n.fromState;
                    var x = $scope.config.states[$scope.getArrayStateIdByStateId(moveStateId)].x;
                    var y = $scope.config.states[$scope.getArrayStateIdByStateId(moveStateId)].y;
                    //update Transistion with self reference
                    var obj = n.objReference.select(".transition-line").attr("d", self.selfTransition(x, y));
                }
            }
        });
    }

    //BETTER SOLUTION THIS IN THE OBJECT ..
    //CallListesner for moving the state objects in the svg
    self.callStateListener = function eventListener() {
        d3.selectAll(".state").call(self.dragState);
    }
}
