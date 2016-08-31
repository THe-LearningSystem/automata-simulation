function AutomatonDataDFA() {
    var self = this;

    self.type = "DFA";
    self.font = "'Roboto', sans-serif";
    //the default prefix for auto naming for example S0,S1,... after the prefix it saves the id
    self.statePrefix = 'S';
    self.diagram = {
        x: 0,
        y: 0,
        scale: 1,
        updatedWithZoomBehavior: false
    };
    //Number of statesIds given to states
    self.countStateId = 0;
    //Number of transitionIds given to transitions
    self.countTransitionId = 0;
    self.states = [];
    self.startState = null;

    self.transitions = [];
    //alphabet
    self.alphabet = [];
    //the name of the inputWord
    self.inputWord = '';
    //the default name
    self.name = "Untitled Automaton";
    //if there is something unsaved
    self.unSavedChanges = false;

}