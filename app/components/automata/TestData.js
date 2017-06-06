//2TESTDATA
function TestData($scope) {
    "use strict";
    var self = this;

    self.testDFA = function () {
        var state1 = $scope.states.createWithPresets(100, 100);
        var state2 = $scope.states.createWithPresets(100, 300);
        var state3 = $scope.states.createWithPresets(300, 300);
        var state4 = $scope.states.createWithPresets(300, 100);
        $scope.states.final.create(state3);
        $scope.states.final.create(state4);

        $scope.transitions.create(state1, state2, "a");
        $scope.transitions.create(state1, state2, "b");
        $scope.transitions.create(state1, state2, "c");
        $scope.transitions.create(state2, state3, "b");
        $scope.transitions.create(state3, state4, "c");
        $scope.transitions.create(state4, state1, "l");
        $scope.transitions.create(state1, state3, "l");

        $scope.automatonData.inputWord = "abc";
        $scope.automatonData.acceptedInputRaw = "abc\nab\nl\nbb";

    };

    self.testTM = function () {
      $scope.automatonData.inputWord = "";

      // TestData1
      // var state1 = $scope.states.createWithPresets(100, 200);
      // var state2 = $scope.states.createWithPresets(300, 200);
      // var state3 = $scope.states.createWithPresets(500, 200);
      // var state4 = $scope.states.createWithPresets(700, 200);
      // // var state5 = $scope.states.createWithPresets(700, 100);
      //
      // $scope.states.final.create(state4);
      //
      // $scope.transitions.create(state1, state2, "a", "c", "→");
      // $scope.transitions.create(state2, state3, "b", "c", "→");
      // $scope.transitions.create(state3, state4, "c", "d", "→");
      // // $scope.transitions.create(state4, state5, "d", "e", "←");


      // TestData2 (Subtrahieren von zwei unären Zahlen getrennt durch eine 0)
      // var state0 = $scope.states.createWithPresets(100,200);
      // var state1 = $scope.states.createWithPresets(300,200);
      // var state2 = $scope.states.createWithPresets(300,400);
      // var state3 = $scope.states.createWithPresets(600,200);
      // var state4 = $scope.states.createWithPresets(600,400);
      //
      // $scope.states.final.create(state4);
      //
      // $scope.transitions.create(state0, state1, "0", "0", "→");
      // $scope.transitions.create(state0, state0, "1", "1", "→");
      // $scope.transitions.create(state1, state1, "0", "0", "→");
      // $scope.transitions.create(state1, state2, "1", "0", "←");
      // $scope.transitions.create(state1, state3, "☐", "☐", "←");
      // $scope.transitions.create(state2, state2, "0", "0", "←");
      // $scope.transitions.create(state2, state1, "1", "0", "→");
      // $scope.transitions.create(state3, state3, "0", "☐", "←");
      // $scope.transitions.create(state3, state3, "1", "1", "←");
      // $scope.transitions.create(state3, state4, "☐", "☐", "→");


      //TestData3 (binäre Ganzahl um 1 erhöhen)
      // var state0 = $scope.states.createWithPresets(100,200);
      // var state1 = $scope.states.createWithPresets(300,200);
      // var state2 = $scope.states.createWithPresets(300,400);
      // var state3 = $scope.states.createWithPresets(600,200);
      //
      // $scope.states.final.create(state3);
      //
      // $scope.transitions.create(state0, state0, "0", "0", "→");
      // $scope.transitions.create(state0, state0, "1", "1", "→");
      // $scope.transitions.create(state0, state1, "☐", "☐", "←");
      //
      // $scope.transitions.create(state1, state2, "0", "1", "←");
      // $scope.transitions.create(state1, state1, "1", "0", "←");
      // $scope.transitions.create(state1, state2, "☐", "1", "←");
      //
      // $scope.transitions.create(state2, state2, "0", "0", "←");
      // $scope.transitions.create(state2, state2, "1", "1", "←");
      // $scope.transitions.create(state2, state3, "☐", "☐", "→");

      //TestData4 (erhöht eine Dualzahl um 1; muss von rechts starten)
      var state0 = $scope.states.createWithPresets(100,200);
      var state1 = $scope.states.createWithPresets(500,200);
      var state2 = $scope.states.createWithPresets(300,400);

      $scope.states.final.create(state2);

      $scope.transitions.create(state0, state1, "0", "1", "←");
      $scope.transitions.create(state0, state0, "1", "0", "←");
      $scope.transitions.create(state0, state1, "0", "1", "←");
      $scope.transitions.create(state0, state2, "☐", "1", "↺");
      $scope.transitions.create(state1, state1, "0", "0", "←");
      $scope.transitions.create(state1, state1, "1", "1", "←");
      $scope.transitions.create(state1, state2, "☐", "☐", "→");
      //
      // $scope.automatonData.acceptedInputRaw = "11";

      //Automat um Grenzen zu testen
      // var state0 = $scope.states.createWithPresets(100,200);
      //
      // $scope.transitions.create(state0, state0, "☐", "☐", "→");
    };


    self.testNFA = function () {
        var state1 = $scope.states.createWithPresets(100, 100);
        var state2 = $scope.states.createWithPresets(100, 300);
        var state3 = $scope.states.createWithPresets(300, 300);
        var state4 = $scope.states.createWithPresets(300, 100);
        $scope.states.final.create(state3);
        $scope.states.final.create(state4);

        $scope.transitions.create(state1, state2, "a");
        $scope.transitions.create(state1, state3, "a");
        $scope.transitions.create(state1, state2, "b");
        $scope.transitions.create(state1, state2, "c");
        $scope.transitions.create(state2, state3, "b");
        $scope.transitions.create(state3, state4, "c");
        $scope.transitions.create(state4, state1, "l");
        $scope.transitions.create(state1, state3, "l");

        $scope.automatonData.inputWord = "abc";
        $scope.automatonData.acceptedInputRaw = "abc\nab";
    };

    self.testPDA = function () {
        $scope.automatonData.inputWord = "ab";
        var state1 = $scope.states.createWithPresets(200, 200);
        var state2 = $scope.states.createWithPresets(500, 200);

        $scope.transitions.create(state1, state1, "a", "⊥", "A");
        $scope.transitions.create(state1, state1, "a", "A", "AA");
        $scope.transitions.create(state1, state2, "b", "A", "ε");
        $scope.transitions.create(state2, state2, "b", "A", "ε");
        $scope.automatonData.acceptedInputRaw = "ab\naabb";
        $scope.automatonData.rejectedInputRaw = "abx\na";

    };
    self.testNPDA = function () {
        $scope.automatonData.inputWord = "ab";
        var state1 = $scope.states.createWithPresets(200, 200);
        var state2 = $scope.states.createWithPresets(500, 200);
        var state3 = $scope.states.createWithPresets(200, 500);

        $scope.transitions.create(state1, state1, "a", "⊥", "A");
        $scope.transitions.create(state1, state1, "a", "A", "AA");
        $scope.transitions.create(state1, state2, "b", "A", "ε");
        $scope.transitions.create(state2, state2, "b", "A", "ε");
        $scope.transitions.create(state1, state3, "b", "A", "ε");
        $scope.transitions.create(state3, state3, "b", "A", "ε");
        $scope.automatonData.acceptedInputRaw = "ab\naabb";
        $scope.automatonData.rejectedInputRaw = "abx\na";

    };

    self.testPDA2 = function () {
        $scope.automatonData.inputWord = "ab";
        var state1 = $scope.states.createWithPresets(200, 200);
        var state2 = $scope.states.createWithPresets(500, 200);

        $scope.transitions.create(state1, state1, "a", "⊥", "A");
        $scope.transitions.create(state1, state2, "b", "A", "ε");
    };


}
