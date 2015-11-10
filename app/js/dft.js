var DFT = function(config){
  var self = this;

  // Call constructor of DFA with self as context
  DFA.call(self, config);

  self.output = [];

  // Overwrite the reset function in order to reset the output word
  var _reset = self.reset;
  self.reset = function(){
    _reset();
    self.output = [];
  }

  // Overwrite the step function in order to construct the output 
  var _step = self.step;
  self.step = function(){
    var nextState = _step();
    if(self.status!=('not accepted' && undefined)){
      self.output.push(nextState[0][3]);
      return nextState;
    }
  }

  // Overwrite the undo function in order to pop the last added char from the output
  var _undo = self.undo;
  self.undo = function(){
    _undo();
    self.output.pop();  
  }
}
