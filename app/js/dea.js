function DEA(config){
  var self = this;
 
  self.config = config; 
  self.status;
  self.statusSequence = []; // TODO: Is there a better name for that?
  self.count; // TODO name this more meaningfull
  self.input = ''; // Set this to the empty string so that the simulation can be started

  // Sets an word for the simulation
  self.setInput = function(input){
    self.input = input;
    self.count = 0;
    self.status = 'stoped';
  }

  // Reset the simulation by setting the start stae as first state to the statusSequence and 
  // setting the status to 'stop'
  self.reset = function(){
    self.statusSequence = [self.config.startState];
    self.status = 'stoped';
  }

  // Step through the simulation TODO: more comments
  self.step = function(){
    if(self.status == 'stoped'){
      self.reset();
      self.status = 'step'
    } else if (self.status == ('accepted' || 'not accepted' || undefined)) {
      return;
    }

    var nextChar = self.input[self.count++];
    var nextState = _.filter(self.config.transitions, function(transition){
      if (nextChar == undefined ){
        self.status = 'not accepted';
        return;
      }

      return transition[0] == _.last(self.statusSequence) && transition[1] == nextChar;   
    });
    
    if (_.isEmpty(nextState)) {
      self.status = 'not accepted';
      return;
    }

    var newStatus = nextState[0][2];
    if((_.include(self.config.finalStates, newStatus)) && (self.input.length == self.count)){
      self.status = 'accepted';
    }
    self.statusSequence.push(newStatus);
  }

  // Running the simulation by repeadetly calling step untill status is 'accepted' or
  // 'not accepted' returning true for 'accepted' and false for 'not accepted'
  //  TODO: stop simulation and return undefined when endless loops was detected
  self.run = function(){
    while((self.status != 'accepted') && (self.status != 'not accepted')){
      self.step();
    }
    if(self.status == 'accepted') {return true}
    return false;
  }

}
