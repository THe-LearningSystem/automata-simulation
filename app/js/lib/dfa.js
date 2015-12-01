var DFA = function(config){
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
    self.count = 0;
    self.status = 'stoped';
  }

  // Step through the simulation TODO: more comments
  self.step = function(){
    if(self.status == 'stoped'){
      self.reset();
    } else if (_.include([undefined, 'accepted','not accepted'], self.status)) {
      return;
    }

    self.status = 'step';

    var nextChar = self.input[self.count++];
    var nextState = _.filter(self.config.transitions, function(transition){
      if (nextChar == undefined ){
        self.status = 'not accepted';
        return;
      }
      return transition[0] == _.last(self.statusSequence) && transition[1] == nextChar;   
    });
    if(_.isEmpty(nextState)){
      self.status = 'not accepted';
      return;
    }
    
    var newStatus = nextState[0][2];
    if(self.input.length == self.count){ 
      if(_.include(self.config.finalStates, newStatus)){
        self.status = 'accepted';
      }
      else{ 
        self.status = 'not accepted';
      }
    }
    self.statusSequence.push(newStatus);
    return nextState;
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

  // Undo function to step backwards
  self.undo = function(){
    // return if utomat is not running
    if (!(_.include(['step', 'accepted', 'not accepted'], self.status))){
      return;
    }
    self.status = 'step';
    
    // Reset if no more undoing is impossible
    if(self.count == 0){
      self.reset();
    }else{ 
      // Decrease count and remove last element from statusSequence
      self.count--;
      self.statusSequence.pop();
    }
  }

}
