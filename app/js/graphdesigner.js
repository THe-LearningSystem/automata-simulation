//TODO:
//NODE NAME UNIQE 


//GRAPHDESIGNER
var GraphDesigner = function(style, svgSelector) {
    var self = this;

    //DEFAULT VALUES
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
        }
        //values
    self.style = _.merge(defaultStyle, style);
    self.svg = d3.select(svgSelector);

    //Node,Transition ect
    self.nodes = [];
    self.transitions = [];

    //NODE_START
    self.addNode = function(x, y, name) {
        if (self.isNodeNameUnique(name)) {
            self.nodes.push({
                "name": name,
                "x": x,
                "y": y
            })
            self.drawNode(_.last(self.nodes));
        } else {
            console.log("The nodeName already exists!");
        }
    }

    self.isNodeNameUnique = function(name) {
        var tmp = true;
        _.forEach(self.nodes, function(node) {
            if (node.name == name)
                return tmp = false;
        });
        return tmp;
    }

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

    self.drawNodes = function() {
            _.forEach(self.nodes, function(node, key) {
                self.drawNode(key);
            });
        }
        //NODE DRAG AND DROP

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

    //NODE_END

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

    self.drawTransition = function(id) {
     
        var transition = self.transitions[id];
        var node1Id = self.getNodeIdByName(transition.node1);
        var node2Id = self.getNodeIdByName(transition.node2);
        var x1 = self.nodes[node1Id].x;
        var y1 = self.nodes[node1Id].y;
        var x2 = self.nodes[node2Id].x;
        var y2 = self.nodes[node2Id].y;

        var group = self.svg.append("g")
            .attr("transform", "translate(" + x1 + " " + y1 + ")");

        var line = group.append("line")
            .attr("x2", x2 - x1)
            .attr("y2", y2 - y1)
            .attr("stroke-width", self.style.transitionWidth)
            .attr("stroke", self.style.transitionColor);

        var text = group.append("text")
            .text(transition.name)
            .attr("dominant-baseline", "middle")
            .attr("fill", self.style.transitionFontColor)
            .attr("text-anchor", "middle");



        self.transitions[id].objReference = group;
        return group;
    }

    self.drawTransitions = function() {
        _.forEach(self.transitions, function(n, key) {
            self.drawTransition(key);

        });
    }

    self.updateTransitionsAfterNodeDrag = function(nodeId) {
            var nodeName = self.nodes[nodeId].name;
            _.forEach(self.transitions, function(n, key) {
                if (n.node1 == nodeName || n.node2 === nodeName) {
                    var obj = n.objReference;
                    var node1Id = self.getNodeIdByName(n.node1);
                    var node2Id = self.getNodeIdByName(n.node2);
                    var x1 = self.nodes[node1Id].x;
                    var y1 = self.nodes[node1Id].y;
                    var x2 = self.nodes[node2Id].x;
                    var y2 = self.nodes[node2Id].y;

                    obj.attr("transform", "translate(" + x1 + " " + y1 + ")");

                    obj.select("line")
                        .attr("x2", x2 - x1)
                        .attr("y2", y2 - y1);
                }

            });
        }
        //TRANSITION_END



}


//MY
/*
var myGraphDesigner = new GraphDesigner({},"#diagramm");
myGraphDesigner.nodes =[
{"name": "S0","x":50,"y":50},
{"name": "S2","x":50,"y":150},
{"name": "S4","x":350,"y":150},
{"name": "S3","x":250,"y":250}
];
myGraphDesigner.transitions = [
{"name": "a","node1":"S0","node2":"S2"},
{"name": "b","node1":"S4","node2":"S2"},
{"name": "v","node1":"S0","node2":"S3"}
];

console.log(myGraphDesigner);

myGraphDesigner.drawNodes();
myGraphDesigner.drawTransitions();

console.log(myGraphDesigner.isNodeNameUnique("S2"));
console.log(myGraphDesigner.isNodeNameUnique("S2asd"));


*/
//BETTER SOLUTION THIS IN THE OBJECT ..
d3.selectAll(".draggable-node").call(myGraphDesigner.dragNode);
