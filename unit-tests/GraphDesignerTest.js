describe("GraphDesigner", function() {

  var myGraphDesigner = new GraphDesigner();
  myGraphDesigner.nodes =[
  {"name": "S0","x":50,"y":50},
  {"name": "S2","x":50,"y":150},
  {"name": "S4","x":100,"y":150},
  {"name": "S3","x":250,"y":250}
  ];
  myGraphDesigner.transitions = [
  {"name": "a","node1":"S0","node2":"S2"},
  {"name": "b","node1":"S4","node2":"S2"},
  {"name": "v","node1":"S0","node2":"S3"}
  ];

  it("fack", function(){
   expect(true).toBe(true);
  });
});

