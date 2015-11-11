describe("DFT test suite", function() {

    var dft = new DFT({
      startState: 's0',
      finalStates: ['s5'],
      transitions: [
        ['s0', 'h', 's1', 'o'],
        ['s1', 'e', 's2', 'l'],
        ['s2', 'l', 's3', 'l'],
        ['s3', 'l', 's4', 'e'],
        ['s4', 'o', 's5', 'h'],
        ['s5', 'h', 's1', 'o']
      ]
    });

    function outputAsString(x){
      return _.reduce(x.output, function(res, c){return res+c}, '')
    }

    it("should step through", function(){
      dft.setInput('he');
      dft.step();
      expect(dft.status).toBe('step');
      expect(outputAsString(dft)).toBe('o');
      expect(_.isEqual(dft.statusSequence, ['s0','s1'])).toBe(true);
    });

    it("sould reset", function(){
      dft.reset();
      expect(dft.status).toBe('stoped');
      expect(outputAsString(dft)).toBe('');
      expect(_.isEqual(dft.statusSequence, ['s0'])).toBe(true);
    });

    it("schould not accept a word", function() {
      dft.setInput('helloh');
      dft.reset();
      expect(dft.run()).toBe(false);
      expect(outputAsString(dft)).toBe('olleho');
      expect(_.isEqual(dft.statusSequence, ['s0','s1','s2','s3','s4','s5','s1'])).toBe(true);
    });

    it("schould accept a single word", function() {
      dft.setInput('hello');
      dft.reset();
      expect(dft.run()).toBe(true);
      expect(outputAsString(dft)).toBe('olleh');
      expect(_.isEqual(dft.statusSequence, ['s0','s1','s2','s3','s4','s5'])).toBe(true);
    });

    it("schould accept repeaded words", function() {
      dft.setInput('hellohello');
      dft.reset();
      expect(dft.run()).toBe(true);
      expect(outputAsString(dft)).toBe('olleholleh');
      expect(_.isEqual(dft.statusSequence, ['s0','s1','s2','s3','s4','s5','s1','s2','s3','s4','s5'])).toBe(true);
    });

    it("should undo a step", function(){
      dft.setInput('hello');
      dft.reset();
      dft.step();
      dft.step();
      dft.undo();
      expect(outputAsString(dft)).toBe('o');
      expect(_.last(dft.statusSequence)).toBe('s1');
    });

    it("should reset itself when undo is impossible", function(){
      dft.setInput('hello');
      dft.reset();
      dft.step();
      dft.undo();
      expect(dft.status).toBe('stoped');
      expect(outputAsString(dft)).toBe('');
      expect(dft.statusSequence.length).toBe(1);
    });
});

