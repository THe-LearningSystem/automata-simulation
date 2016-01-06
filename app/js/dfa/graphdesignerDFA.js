"use strict";

//GRAPHDESIGNER for the svg diagramm
var graphdesignerDFA = function(config,svgSelector, $scope) {

    var self = this;
    //The DFA config
    self.config = config;
    //graphdesigner settings
    self.settings = {
        nodeRadius: 25,
        selected: false
    };

    self.svgOuter = d3.select(svgSelector);
    

    //TODO: Bug when moving all the objects.
    //u can move the whole diagramm and zome in and out
    self.svg = self.svgOuter.call(d3.behavior.zoom().on("zoom", function() {
     if (!self.settings.selected) {
                self.svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
            }      
        }))
        .append("g").attr("id", "svg-items");

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
     * Renames the state in the svg after the $scope variable was changed
     * @param  {Int} stateId      
     * @param  {String} newStateName          
     */
    self.renameState = function(stateId, newStateName) {
        var state = self.config.states[$scope.getArrayStateIdByStateId(stateId)];
        var objReference = state.objReference;
       objReference.select("text").text(newStateName);
       
    }

    /**
     * Removes the state with the given id
     * @param  {Int} stateId 
     */
    self.removeState = function(stateId) {
        var state = self.config.states[$scope.getArrayStateIdByStateId(stateId)];
        var objReference = state.objReference;
        objReference.remove();
    }




    /**
     * Draws a State 
     * @param  {Int} id The arrayid of the State
     * @return {Reference}    Returns the reference of the group object
     */
    self.drawState = function(id) {
        var state = self.config.states[id];
        var group = self.svgStates.append("g")
            .attr("transform", "translate(" + state.x + " " + state.y + ")")
            .attr("class", "state "+ "state-"+state.id)
            .attr("object-id", state.id); //save the state-id

        var circleSelection = group.append("circle")
            .attr("class", "state-circle")
            .attr("r", self.settings.nodeRadius);

        var text = group.append("text")
            .text(state.name)
            .attr("class", "state-text")
            .attr("dominant-baseline", "central")
            .attr("text-anchor", "middle");

            self.config.states[id].objReference = group;
        return group;
    }


    //Node drag and drop behaviour
    self.dragState = d3.behavior.drag()
        .on("dragstart", function() {
            self.settings.selected = true;
        })
        .on("drag", function() {
            //update the shown node
            d3.select(this)
                .attr("transform", "translate(" + d3.event.x + " " + d3.event.y + ")")
                .attr("x", d3.event.x);
            //update the node in the array
            
            var stateId = d3.select(this).attr("object-id");
            var stateArrayId = $scope.getArrayStateIdByStateId(stateId);

            $scope.$apply(function(){

            self.config.states[stateArrayId].x = d3.event.x;
            self.config.states[stateArrayId].y = d3.event.y;

            })
            
            //update the transitions after dragging a node
            self.updateTransitionsAfterStateDrag(d3.select(this).attr("object-id"));
        })
        .on("dragend", function() {
            self.settings.selected = false;
        });

    /**
     * Draw a Transition
     * @param  {Int} id 
     * @return {Reference}  Retruns the reference of the group object
     */
    self.drawTransition = function(id) {

        var transition = self.config.transitions[id];
        var fromId = transition.fromState;
        var toId = transition.toState;
        var x1 = self.config.states[fromId].x;
        var y1 = self.config.states[fromId].y;
        var x2 = self.config.states[toId].x;
        var y2 = self.config.states[toId].y;
        var richtungsvektor = {
            "x": x2 - x1,
            "y": y2 - y1
        };
        var richtungsVectorLength = Math.sqrt(richtungsvektor.x * richtungsvektor.x + richtungsvektor.y * richtungsvektor.y);
        var n = self.settings.nodeRadius / richtungsVectorLength;
        var x3 = x1 + n * richtungsvektor.x;
        var y3 = y1 + n * richtungsvektor.y;
        var x4 = x2 - n * richtungsvektor.x;
        var y4 = y2 - n * richtungsvektor.y;

        var group = self.svgTransitions.append("g")
            .attr("transform", "translate(" + x3 + " " + y3 + ")")
            .attr("class", "transition");

        var line = group.append("line")
            .attr("class", "transition-line")
            .attr("x2", x4 - x3)
            .attr("y2", y4 - y3)
            .attr("marker-end", "url(#marker-end-arrow)");

        var text = group.append("text")
            .attr("class", "transition-text")
            .text(transition.name)
            .attr("x", (x4 - x3) / 2)
            .attr("y", (y4 - y3) / 2);

        self.config.transitions[id].objReference = group;
        return group;
    }


    /**
     * Update the transitions in the svg after moving a state
     * @param  {Int} stateId Moved stateId
     */
    self.updateTransitionsAfterStateDrag = function(stateId) {
        var stateName = self.config.states[stateId].name;
        _.forEach(self.config.transitions, function(n, key) {
            if (n.fromState == stateId || n.toState == stateId) {
                var obj = n.objReference;
                var fromId = n.fromState;
                var toId = n.toState;
                var x1 = self.config.states[fromId].x;
                var y1 = self.config.states[fromId].y;
                var x2 = self.config.states[toId].x;
                var y2 = self.config.states[toId].y;
                var richtungsvektor = {
                    "x": x2 - x1,
                    "y": y2 - y1
                };
                var richtungsVectorLength = Math.sqrt(richtungsvektor.x * richtungsvektor.x + richtungsvektor.y * richtungsvektor.y);
                var n = self.settings.nodeRadius / richtungsVectorLength;
                var x3 = x1 + n * richtungsvektor.x;
                var y3 = y1 + n * richtungsvektor.y;
                var x4 = x2 - n * richtungsvektor.x;
                var y4 = y2 - n * richtungsvektor.y;

                obj.attr("transform", "translate(" + x3 + " " + y3 + ")");

                obj.select("line")
                    .attr("x2", x4 - x3)
                    .attr("y2", y4 - y3);

                obj.select("text")
                    .attr("x", (x4 - x3) / 2)
                    .attr("y", (y4 - y3) / 2);
            }

        });
    }

    //BETTER SOLUTION THIS IN THE OBJECT ..
    //CallListesner for moving the state objects in the svg
    self.callStateListener = function eventListener() {
        d3.selectAll(".state").call(self.dragState);
    }
}
