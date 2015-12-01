var myGraphDesigner = new GraphDesigner({}, "#diagramm");
myGraphDesigner.node.nodes = [{
    "name": "S0",
    "x": 50,
    "y": 50
}, {
    "name": "S2",
    "x": 50,
    "y": 150
}, {
    "name": "S4",
    "x": 350,
    "y": 150
}, {
    "name": "S3",
    "x": 250,
    "y": 250
}];
myGraphDesigner.transitions = [{
    "name": "a",
    "from": "S0",
    "to": "S2"
}, {
    "name": "b",
    "from": "S4",
    "to": "S2"
}, {
    "name": "v",
    "from": "S0",
    "to": "S3"
}];


myGraphDesigner.drawNodes();
myGraphDesigner.drawTransitions();

myGraphDesigner.callNodeListener();
