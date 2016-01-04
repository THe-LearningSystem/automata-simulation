"use strict";


//GRAPHDESIGNER
var graphdesignerDFA = function(config,svgSelector) {
    var self = this;
    self.config = config;
    //graphdesigner settings
    self.settings = {
        stateRadius: 25,
        selected: false
    };
    self.svgOuter = d3.select(svgSelector);
    
    self.svg = self.svgOuter.call(d3.behavior.zoom().on("zoom", function() {
           
        }))
        .append("g").attr("id", "svg-items");

    //first draw the transitions -> states are in front of them if they overlap
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




    //draw the state with the id on the svg
    self.drawState = function(id) {
        var state = self.config.states[id];
        var group = self.svgStates.append("g")
            .attr("transform", "translate(" + state.x + " " + state.y + ")")
            .attr("class", "state")
            .attr("object-id", id);

        var circleSelection = group.append("circle")
            .attr("class", "state-circle")
            .attr("r", self.settings.stateRadius);

        var text = group.append("text")
            .text(state.name)
            .attr("class", "state-text")
            .attr("dominant-baseline", "central")
            .attr("text-anchor", "middle");

        return group;
    }

    //draw all the states
    self.drawStates = function() {
        _.forEach(self.config.states, function(state, key) {
            self.drawState(key);
        });
    }

    //state drag and drop behaviour
    self.dragState = d3.behavior.drag()
        .on("dragstart", function() {
            self.settings.selected = true;
        })
        .on("drag", function() {
            //update the shown state
            d3.select(this)
                .attr("transform", "translate(" + d3.event.x + " " + d3.event.y + ")")
                .attr("x", d3.event.x);
            //update the state in the array
            self.config.states[d3.select(this).attr("object-id")].x = d3.event.x;
            self.config.states[d3.select(this).attr("object-id")].y = d3.event.y;
            //update the transitions after dragging a state
            self.updateTransitionsAfterStateDrag(d3.select(this).attr("object-id"));
        })
        .on("dragend", function() {
            self.settings.selected = false;
        });

    //draw the transition with the id
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
        var n = self.settings.stateRadius / richtungsVectorLength;
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



    //draw all the transitions
    self.drawTransitions = function() {
        _.forEach(self.config.transitions, function(n, key) {
            self.drawTransition(key);

        });
    }

    //update the transitions when a state is moved
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
                var n = self.settings.stateRadius / richtungsVectorLength;
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
    self.callStateListener = function eventListener() {
        d3.selectAll(".state").call(self.dragState);
    }
}
