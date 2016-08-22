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
//from https://coderwall.com/p/ngisma/safe-apply-in-angular-js
//fix for $apply already in progress
function scopeSaveApply(fn) {
    var phase = this.$root.$$phase;
    if (phase == '$apply' || phase == '$digest') {
        if (fn && (typeof (fn) === 'function')) {
            fn();
        }
    } else {
        this.$apply(fn);
    }
}
//from http://stackoverflow.com/questions/4994201/is-object-empty
// Speed up calls to hasOwnProperty
var hasOwnProperty = Object.prototype.hasOwnProperty;

function isObjectEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
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