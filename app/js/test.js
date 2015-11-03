
var GraphDesigner =  function(style){
	var self = this;
	self.style = {};
	self.style.nodeRadius = style.nodeRadius ||25;
	self.style.nodeBorder = style.nodeBorder || "#666";
};


var myGraphDesigner = new GraphDesigner({"nodeRadius": 50,"nodeBorder":5});

console.log(GraphDesigner({}));
console.log(myGraphDesigner);
//DEBUG
GraphDesigner.debugContainer = d3.select(".debug-container");
GraphDesigner.mousePosition = d3.select(".mouse-position");

//SETTINGS
GraphDesigner.nodeRadius = 25;
//NODE BORDER
GraphDesigner.nodeBorder = "#666";
GraphDesigner.nodeBorderWidth = 5;
//NODE COLORS
GraphDesigner.nodeColorPrimary = "#88C";
GraphDesigner.nodeColorSelected = "#C88";
//NODETEXT
GraphDesigner.nodeFontColor = "#000";
GraphDesigner.nodeFontSize = "15px";
//Transition
GraphDesigner.transitionColor = "#777";
GraphDesigner.transitionWidth = 2;
GraphDesigner.transitionTextSize ="15px";
GraphDesigner.transitionTextColor ="#000";

GraphDesigner.test = function(a){
	console.log(a);
};
GraphDesigner.test("Das geht");


console.log(GraphDesigner);
//SVG 
var svgSelection = d3.select("#diagramm")      
.attr("width", 500)
.attr("height", 500);


//Functions

/** Creates a new Node at posX,PosY and with the specified name */
function drawNode(posX,posY,name,id){
	var group = svgSelection.append("g")
	.attr("transform", "translate("+posX+" "+posY+")")
	.attr("class","draggableNode")
	.attr("object-id",id);

	var circleSelection = group.append("circle")
	.attr("r", nodeRadius)
	.attr("stroke-width",nodeBorderWidth)
	.attr("stroke", nodeBorder)
	.style("fill", nodeColorPrimary)

	var text = group.append("text")
	.text(name)
	.attr("dominant-baseline", "central")
	.attr("fill", "black")
	.attr("text-anchor","middle")
	.style("font-size","15px");
	return group;
}
/** Create a Line */

function drawLine(node1,node2,transition){
	var node1Id = getNodeIdByName(node1);
	var node2Id = getNodeIdByName(node2);
	var posX1= node[node1Id].x;
	var posY1= node[node1Id].y;
	var posX2= node[node2Id].x;
	var posY2= node[node2Id].y;

	var group = svgSelection.append("g")
	.attr("transform", "translate("+posX1+" "+posY1+")")
	.attr("class","draggable");

	var line = group.append("line")
	.attr("x2",posX2-posX1)
	.attr("y2",posY2-posY1)
	.attr("stroke-width", transitionWidth)
	.attr("stroke", transitionColor);

	var text = group.append("text")
	.text(name)
	.attr("dominant-baseline", "central")
	.attr("fill", "black")
	.attr("text-anchor","middle")
	.style("font-size","15px");
	return group;
}


//Drag & Drop
var dragNode = d3.behavior.drag()
.on("dragstart", function(){
	d3.select(this).select("circle").style('fill', nodeColorSelected);
})
.on("drag", function(){
	d3.select(this)
	.attr("transform", "translate("+d3.event.x+" "+d3.event.y+")")
	.attr("x",d3.event.x);
	node[d3.select(this).attr("object-id")].x =d3.event.x;
	node[d3.select(this).attr("object-id")].y =d3.event.y;

})
.on("dragend", function(){
	d3.select(this).select("circle").style('fill', nodeColorPrimary);
});

function getNodeIdByName(name){
	var tmp;
	d3.selectAll(node)
	.each(function(d,i){
		if(node[i].name == name){
			tmp = i;
		}	
	});
	return tmp;
}



//Start
//NODE x,y,name,type -> enum
var node = [
{"name": "SO","x":50,"y":50},
{"name": "S2","x":150,"y":150},
{"name": "S3","x":250,"y":250}
];

var transition = [
{"name": "test","node1":"SO","node2":"S2"},
{"name": "test","node1":"SO","node2":"S3"}
];


//Create all Nodes
d3.selectAll(node)
.each(function(d,i){
	return drawNode(node[i].x,node[i].y,node[i].name,i);
});

console.log(getNodeIdByName("SO"));

//Create all Transitions
d3.selectAll(transition)
.each(function(d,i){
	return drawLine(transition[i].node1,transition[i].node2,transition[i].name);
});



//AT THE END
d3.selectAll(".draggableNode").call(dragNode);
