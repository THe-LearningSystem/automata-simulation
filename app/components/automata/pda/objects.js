function TransitionPDA(id, fromState, toState, transitionChar, readFromStack, writeToStack) {
    var self = this;
    self.id = id;
    self.fromState = fromState;
    self.toState = toState;
    self.name = transitionChar;
    self.readFromStack = readFromStack;
    self.writeToStack = writeToStack;
}


function PDAStack(stackArray) {
    var self = this;
    self.stackFirstSymbol = "⊥";
    if (stackArray === undefined)
        self.stackContainer = ["⊥"];
    else
        self.stackContainer = _.cloneDeep(stackArray);
    self.listener = [];

    self.push = function (char) {
        if (char === "\u03b5") {
        } else {
            for (var i = 0; i < char.length; i++) {
                self.stackContainer.push(char[i]);
                _.forEach(self.listener, function (value) {
                    value.addToStack(char[i]);
                });
            }
        }

    };

    self.pop = function () {
        _.forEach(self.listener, function (value) {
            value.removeFromStack();
        });
        return self.stackContainer.pop();
    };

    self.tryToPop = function (char) {
        if (char === "\u03b5") {
        } else {
            for (var i = 0; i < char.length; i++) {
                self.stackContainer.pop();
                _.forEach(self.listener, function (value) {
                    value.removeFromStack();
                });
            }
        }
    };

}