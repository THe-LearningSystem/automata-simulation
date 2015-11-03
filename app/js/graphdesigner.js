//TODO:
//NODE NAME UNIQE 
//
//Order of Paramater id,name,x,y
//x,y,name,id


//GRAPHDESIGNER
var GraphDesigner =  function(style, svgSelector){
	var self = this;
	
	//DEFAULT VALUES
	var defaultStyle ={
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
	self.style = _.merge(defaultStyle,style);
	self.svg = d3.select(svgSelector);

	//Node,Transition ect
	//
	//"name": "test","x":50,"y":50
	self.nodes = [];
	self.transitions = [];
	self.test = [];

	//NODE_START
	self.addNode = function(posX,posY,name){
		self.nodes.push({"name":name,"x":posX,"y":posY})
	}

	self.drawNode = function(posX,posY,name,id){
		var group = self.svg.append("g")
		.attr("transform", "translate("+posX+" "+posY+")")
		.attr("class","draggable-node")
		.attr("object-id",id);

		var circleSelection = group.append("circle")
		.attr("r", self.style.nodeRadius)
		.attr("stroke-width",self.style.nodeBorderWidth)
		.attr("stroke", self.style.nodeBorderColor)
		.style("fill", self.style.nodeColorPrimary);

		var text = group.append("text")
		.text(name)
		.attr("dominant-baseline", "central")
		.attr("fill", self.style.nodeFontColor)
		.attr("text-anchor","middle")
		.style("font-size", self.style.nodeFontSize);

		self.nodes[id].objReference = group;

		return group;
	}

	self.drawNodes= function(){
		_.forEach(self.nodes, function(n,key){
			self.drawNode(n.x,n.y,n.name, key);
		});
	};
	//NODE DRAG AND DROP

	self.dragNode = d3.behavior.drag()
	.on("dragstart", function(){
		d3.select(this).select("circle").style('fill', self.style.nodeColorSelected);
	})
	.on("drag", function(){
		d3.select(this)
		.attr("transform", "translate("+d3.event.x+" "+d3.event.y+")")
		.attr("x",d3.event.x);
		self.nodes[d3.select(this).attr("object-id")].x =d3.event.x;
		self.nodes[d3.select(this).attr("object-id")].y =d3.event.y;
		self.updateTransitionsAfterNodeDrag(d3.select(this).attr("object-id"));


	})
	.on("dragend", function(){
		d3.select(this).select("circle").style('fill', self.style.nodeColorPrimary);
	});

	//NODE_END
	
	//TRANSITION_START
	self.getNodeIdByName = function(nodeName){
		var tmp = null;
		_.forEach(self.nodes, function(n,key){
			if(n.name === nodeName){
				tmp = key;
			}
		});
		if(tmp != null)
			return tmp;
		else{
			console.log("Transition referenced to an undefinded Node");
			return null;
		}
	};

	self.drawTransition =function(node1,node2,transitionName,id){
		var node1Id = self.getNodeIdByName(node1);
		var node2Id = self.getNodeIdByName(node2);
		var posX1= self.nodes[node1Id].x;
		var posY1= self.nodes[node1Id].y;
		var posX2= self.nodes[node2Id].x;
		var posY2= self.nodes[node2Id].y;

		var group = self.svg.append("g")
		.attr("transform", "translate("+posX1+" "+posY1+")")
		.attr("transition-id",id);

		var line = group.append("line")
		.attr("x2",posX2-posX1)
		.attr("y2",posY2-posY1)
		.attr("stroke-width", self.style.transitionWidth)
		.attr("stroke", self.style.transitionColor);

		var text = group.append("text")
		.text(transitionName)
		.attr("dominant-baseline", "central")
		.attr("fill", self.style.transitionFontColor)
		.attr("text-anchor","middle")
		.style("font-size",self.style.transitionFontSize);

		self.transitions[id].objReference = group;
		return group;
	};

	self.drawTransitions = function(){
		_.forEach(self.transitions, function(n,key){
			self.drawTransition(n.node1,n.node2,n.name,key);
			
		});
	};

	self.updateTransitionsAfterNodeDrag = function(nodeId){
		var nodeName = self.nodes[nodeId].name;
		_.forEach(self.transitions, function(n,key){
			if(n.node1 == nodeName || n.node2 === nodeName){
				var obj = n.objReference;
				var node1Id = self.getNodeIdByName(n.node1);
				var node2Id = self.getNodeIdByName(n.node2);
				var posX1= self.nodes[node1Id].x;
				var posY1= self.nodes[node1Id].y;
				var posX2= self.nodes[node2Id].x;
				var posY2= self.nodes[node2Id].y;

				obj.attr("transform", "translate("+posX1+" "+posY1+")");

				obj.select("line")
				.attr("x2",posX2-posX1)
				.attr("y2",posY2-posY1);
			}
			
		});
};



};


//MY

var myGraphDesigner = new GraphDesigner({},"#diagramm");
myGraphDesigner.nodes =[
{"name": "S0","x":50,"y":50},
{"name": "S2","x":50,"y":150},
{"name": "S3","x":250,"y":250}
];
myGraphDesigner.transitions = [
{"name": "a","node1":"S0","node2":"S2"},
{"name": "test","node1":"S0","node2":"S3"}
];

console.log(myGraphDesigner);

myGraphDesigner.drawNodes();
myGraphDesigner.drawTransitions();




//BETTER SOLUTION THIS IN THE OBJECT ..
d3.selectAll(".draggable-node").call(myGraphDesigner.dragNode);