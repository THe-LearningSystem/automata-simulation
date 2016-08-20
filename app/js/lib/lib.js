//FROM http://stackoverflow.com/questions/10151216/javascript-cloned-object-looses-its-prototype-functions
function cloneObject(obj) {
    obj = obj && obj instanceof Object ? obj : '';

    // Handle Date (return new Date object with old value)
    if (obj instanceof Date) {
        return new Date(obj);
    }

    // Handle Array (return a full slice of the array)
    if (obj instanceof Array) {
        return obj.slice();
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = new obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) {
                if (obj[attr] instanceof Object) {
                    copy[attr] = cloneObject(obj[attr]);
                } else {
                    copy[attr] = obj[attr];
                }
            }
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

//Constructor for state
function State(id, name, x, y) {
    var self = this;
    self.id = id;
    self.name = name;
    self.x = x;
    self.y = y;

}

function TransitionDFA(id, fromState, toState, transitionChar) {
    var self = this;
    self.id = id;
    self.fromState = fromState;
    self.name = transitionChar;
    self.toState = toState;
}

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
        self.stackContainer = [];
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