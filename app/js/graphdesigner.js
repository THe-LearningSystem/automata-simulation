"use strict";


//GRAPHDESIGNER
var GraphDesigner = function (style, svgSelector) {
    var self = this;

    //default style values
    var defaultStyle = {
            nodeRadius: 25,
            nodeBorderColor: "#666",
            nodeBorderWidth: 1,
            nodeColorPrimary: "#8CC",
            nodeColorSelected: "#C88",
            nodeFontColor: "#000",
            nodeFontSize: "15px",
            transitionColor: "#000",
            transitionWidth: 2,
            transitionFontSize: "15px",
            transitionFontColor: "#000"
        };

    self.style = _.merge(defaultStyle, style);
    self.svg = d3.select(svgSelector);
    
    //DEFS
    self.defs = self.svg.append('svg:defs');
        self.defs.append('svg:marker')
      .attr('id', 'marker-end-arrow')
      .attr('refX', 8)
       .attr('refY', 3)
      .attr('markerWidth', 10)
      .attr('markerHeight', 10)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,0 L0,6 L9,3 z');
    

    //Node,Transition ect
    self.nodes = [];
    self.transitions = [];

    //Add a Node
    self.addNode = function (x, y, name) {
        if (self.isNodeNameUnique(name)) {
            self.nodes.push({
                "name": name,
                "x": x,
                "y": y
            });
            self.drawNode(self.nodes.length-1);
            self.callNodeListener();
        } else {
            console.log("The nodeName already exists!");
        }
    };
    
    //check if the nodename is unique
    self.isNodeNameUnique = function (name) {
        var tmp = true;
        _.forEach(self.nodes, function (node) {
            if (node.name === name)
                return tmp = false;
        });
        return tmp;
    }
    
    //check if a node exist with the given name
    self.existsNodeWithName = function (name) {
        for(var i = 0; i< self.nodes.length;i++){
            if(self.nodes[i].name === name){
                return  true;
            }
        }
        return false;
    }

    //draw the node with the id on the svg
    self.drawNode = function(id) {
        var node = self.nodes[id];
        var group = self.svg.append("g")
            .attr("transform", "translate(" + node.x + " " + node.y + ")")
            .attr("class", "draggable-node")
            .attr("object-id", id);

        var circleSelection = group.append("circle")
            .attr("r", self.style.nodeRadius)
            .attr("stroke-width", self.style.nodeBorderWidth)
            .attr("stroke", self.style.nodeBorderColor)
            .style("fill", self.style.nodeColorPrimary);

        var text = group.append("text")
            .text(node.name)
            .attr("dominant-baseline", "central")
            .attr("fill", self.style.nodeFontColor)
            .attr("text-anchor", "middle")
            .style("font-size", self.style.nodeFontSize);

        self.nodes[id].objReference = group;

        return group;
    }

    //draw all the nodes
    self.drawNodes = function() {
            _.forEach(self.nodes, function(node, key) {
                self.drawNode(key);
            });
    }
        

    //Node drag and drop behaviour
    self.dragNode = d3.behavior.drag()
        .on("dragstart", function() {
            d3.select(this).select("circle").style('fill', self.style.nodeColorSelected);
        })
        .on("drag", function() {
            d3.select(this)
                .attr("transform", "translate(" + d3.event.x + " " + d3.event.y + ")")
                .attr("x", d3.event.x);
            self.nodes[d3.select(this).attr("object-id")].x = d3.event.x;
            self.nodes[d3.select(this).attr("object-id")].y = d3.event.y;
            self.updateTransitionsAfterNodeDrag(d3.select(this).attr("object-id"));


        })
        .on("dragend", function() {
            d3.select(this).select("circle").style('fill', self.style.nodeColorPrimary);
        });


    //TRANSITION_START
    self.getNodeIdByName = function(nodeName) {
        var tmp = null;
        _.forEach(self.nodes, function(node, key) {
            if (node.name === nodeName) {
                tmp = key;
            }
        });
        if (tmp != null)
            return tmp;
        else {
            console.log("Transition referenced to an undefinded Node");
            return null;
        }
    }
    

    //draw the transition with the id
    self.drawTransition = function(id) {
     
        var transition = self.transitions[id];
        var fromId = self.getNodeIdByName(transition.from);
        var toId = self.getNodeIdByName(transition.to);
        var x1 = self.nodes[fromId].x;
        var y1 = self.nodes[fromId].y;
        var x2 = self.nodes[toId].x;
        var y2 = self.nodes[toId].y;
        var richtungsvektor  = { "x":x2-x1,"y":y2-y1};
        var richtungsVectorLength = Math.sqrt(richtungsvektor.x*richtungsvektor.x +richtungsvektor.y*richtungsvektor.y);
        var n = self.style.nodeRadius /richtungsVectorLength;
        console.log(n);
        var x3 = x1+n*richtungsvektor.x;
        var y3 = y1 + n*richtungsvektor.y;
        var x4 = x2 -n*richtungsvektor.x;
        var y4 = y2-n*richtungsvektor.y;

        var group = self.svg.append("g")
            .attr("transform", "translate(" + x3 + " " + y3 + ")");

        var line = group.append("line")
            .attr("x2", x4 - x3)
            .attr("y2", y4 - y3)
            .attr("stroke-width", self.style.transitionWidth)
            .attr("stroke", self.style.transitionColor)
            .attr("marker-end","url(#marker-end-arrow)");

        var text = group.append("text")
            .text(transition.name)
            .attr("x",(x4-x3)/2)
            .attr("y",(y4-y3)/2)
            .attr("fill", self.style.transitionFontColor);


self.transitions[id].objReference = group;
        return group;
    }
    
    //add a transition
    self.addTransition = function (from, to, name) {
        if (self.existsNodeWithName(from) && self.existsNodeWithName(to)){
            if(!self.existTransition(from,to,name)){
                self.transitions.push(
                    {"name": name,"from":from,"to":to}
                );
                self.drawTransition(self.transitions.length-1);
            }else{
                console.log("the transition already exist")
            }
        } else {
            console.log("The nodes doesnt exist");
        }
    };

    
    //check if a transition exists
    self.existTransition = function(from, to, name){
        for(var i = 0;  i < self.transitions.length; i++){
         if(self.transitions[i].name === name && self.transitions[i].from === from && self.transitions[i].to === to){
                return true;
            }   
            
        }
        return false;
    }
    
    //draw all the transitions
    self.drawTransitions = function() {
        _.forEach(self.transitions, function(n, key) {
            self.drawTransition(key);

        });
    }

    //update the transitions when a node is moved
    self.updateTransitionsAfterNodeDrag = function(nodeId) {
            var nodeName = self.nodes[nodeId].name;
            _.forEach(self.transitions, function(n, key) {
                if (n.from == nodeName || n.to === nodeName) {
                    var obj = n.objReference;
                    var fromId = self.getNodeIdByName(n.from);
                    var toId = self.getNodeIdByName(n.to);
                    var x1 = self.nodes[fromId].x;
                    var y1 = self.nodes[fromId].y;
                    var x2 = self.nodes[toId].x;
                    var y2 = self.nodes[toId].y;
                            var richtungsvektor  = { "x":x2-x1,"y":y2-y1};
        var richtungsVectorLength = Math.sqrt(richtungsvektor.x*richtungsvektor.x +richtungsvektor.y*richtungsvektor.y);
        var n = self.style.nodeRadius /richtungsVectorLength;
        console.log(n);
        var x3 = x1+n*richtungsvektor.x;
        var y3 = y1 + n*richtungsvektor.y;
        var x4 = x2 -n*richtungsvektor.x;
        var y4 = y2-n*richtungsvektor.y;

                    obj.attr("transform", "translate(" + x3 + " " + y3 + ")");

                    obj.select("line")
                        .attr("x2", x4 - x3)
                        .attr("y2", y4 - y3);
                    
                    obj.select("text")
                      .attr("x",(x4-x3)/2)
            .attr("y",(y4-y3)/2);
                }

            });
        }
    //BETTER SOLUTION THIS IN THE OBJECT ..
self.callNodeListener = function eventListener(){
    d3.selectAll(".draggable-node").call(myGraphDesigner.dragNode);
}


}



var myGraphDesigner = new GraphDesigner({},"#diagramm");
myGraphDesigner.nodes =[
{"name": "S0","x":50,"y":50},
{"name": "S2","x":50,"y":150},
{"name": "S4","x":350,"y":150},
{"name": "S3","x":250,"y":250}
];
myGraphDesigner.transitions = [
{"name": "a","from":"S0","to":"S2"},
{"name": "b","from":"S4","to":"S2"},
{"name": "v","from":"S0","to":"S3"}
];

console.log(myGraphDesigner);



myGraphDesigner.drawNodes();
myGraphDesigner.drawTransitions();

myGraphDesigner.callNodeListener();




