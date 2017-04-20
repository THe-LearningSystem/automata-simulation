String.prototype.replaceAll = function (target, replacement) {
    return this.split(target).join(replacement);
};


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


//from http://stackoverflow.com/questions/5999998/how-can-i-check-if-a-javascript-variable-is-function-type
//check if argument is a function
function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}


function prepareScope($scope) {
    window.rootScope = $scope;
    $scope.saveApply = scopeSaveApply;
    $scope.debug = true;
}