describe("DEA test suite", function() {

    var dea = new DEA({
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
      dea.setInput('he');
      dea.step();
      expect(dea.status).toBe('step');
      expect(_.isEqual(dea.statusSequence, ['s0','s1'])).toBe(true);
    });

    it("sould reset", function(){
      dea.reset();
      expect(dea.status).toBe('stoped');
      expect(_.isEqual(dea.statusSequence, ['s0'])).toBe(true);
    });

    it("schould not accept a words", function() {
      dea.setInput('helloh');
      dea.reset();
      expect(dea.run()).toBe(false);
      expect(_.isEqual(dea.statusSequence, ['s0','s1','s2','s3','s4','s5','s1'])).toBe(true);
    });

    it("schould accept a single word", function() {
      dea.setInput('hello');
      dea.reset();
      expect(dea.run()).toBe(true);
      expect(_.isEqual(dea.statusSequence, ['s0','s1','s2','s3','s4','s5'])).toBe(true);
    });

    it("schould accept repeaded words", function() {
      dea.setInput('hellohello');
      dea.reset();
      expect(dea.run()).toBe(true);
      expect(_.isEqual(dea.statusSequence, ['s0','s1','s2','s3','s4','s5','s1','s2','s3','s4','s5'])).toBe(true);
    });
});

