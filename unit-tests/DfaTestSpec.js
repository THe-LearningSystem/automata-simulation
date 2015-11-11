describe("DFA test suite", function() {

    var dfa = new DFA({
      startState: 's0',
      finalStates: ['s5'],
      transitions: [
        ['s0', 'h', 's1'],
        ['s1', 'e', 's2'],
        ['s2', 'l', 's3'],
        ['s3', 'l', 's4'],
        ['s4', 'o', 's5'],
        ['s5', 'h', 's1']
      ]
    });

    it("should step through", function(){
      dfa.setInput('he');
      dfa.step();
      expect(dfa.status).toBe('step');
      expect(_.isEqual(dfa.statusSequence, ['s0','s1'])).toBe(true);
    });

    it("sould reset", function(){
      dfa.reset();
      expect(dfa.status).toBe('stoped');
      expect(_.isEqual(dfa.statusSequence, ['s0'])).toBe(true);
    });

    it("schould not accept a words", function() {
      dfa.setInput('helloh');
      dfa.reset();
      expect(dfa.run()).toBe(false);
      expect(_.isEqual(dfa.statusSequence, ['s0','s1','s2','s3','s4','s5','s1'])).toBe(true);
    });

    it("schould accept a single word", function() {
      dfa.setInput('hello');
      dfa.reset();
      expect(dfa.run()).toBe(true);
      expect(_.isEqual(dfa.statusSequence, ['s0','s1','s2','s3','s4','s5'])).toBe(true);
    });

    it("schould accept repeaded words", function() {
      dfa.setInput('hellohello');
      dfa.reset();
      expect(dfa.run()).toBe(true);
      expect(_.isEqual(dfa.statusSequence, ['s0','s1','s2','s3','s4','s5','s1','s2','s3','s4','s5'])).toBe(true);
    });

    it("should undo a step", function(){
      dfa.setInput('hello');
      dfa.reset();
      dfa.step();
      dfa.step();
      dfa.undo();
      expect(_.last(dfa.statusSequence)).toBe('s1');
    });

    it("should reset itself when undo is impossible", function(){
      dfa.setInput('hello');
      dfa.reset();
      dfa.step();
      dfa.undo();
      expect(dfa.status).toBe('stoped');
      expect(dfa.statusSequence.length).toBe(1);
    });
});

