autoSim.AutomatonData = function () {
    var self = this;

    self.type = "DFA";
    self.font = "'Roboto', sans-serif";
    self.diagram = {
        x: 0,
        y: 0,
        scale: 1,
        updatedWithZoomBehavior: false
    };
    //the default name
    self.name = "Untitled Automaton";
    //if there is something unsaved
    self.unSavedChanges = false;
    self.inputWord = '';
    //bulkTestData
    self.acceptedInputRaw = "";
    self.rejectedInputRaw = "";
};