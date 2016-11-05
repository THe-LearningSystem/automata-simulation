autoSim.LanguageData = function () {
    var self = this;
    self.type = "LANGUAGE";
    self.font = "'Roboto', sans-serif";
    self.diagram = {
        x: 0,
        y: 0,
        scale: 1,
        updatedWithZoomBehavior: false
    };
    //the default name
    self.name = "Untitled LANGUAGE";
    //if there is something unsaved
    self.unSavedChanges = false;
    self.inputWord = '';
    //bulkTestData
    self.acceptedInputRaw = "";
    self.rejectedInputRaw = "";
};