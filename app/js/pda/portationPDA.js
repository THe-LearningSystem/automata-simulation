function PortationPDA($scope, type) {
    "use strict";

    var self = this;

    PortationDFA.apply(self, arguments);
    if (type === undefined)
        self.type = "PDA";
    else
        self.type = type;

    /**
     * Creates the imported transitions
     * @param jsonObj
     */
    self.createTransitions = function (jsonObj) {
        _.forEach(jsonObj.transitions, function (value) {
            $scope.addTransitionWithId(value.id, value.fromState, value.toState, value.name, value.readFromStack, value.writeToStack);
        });

    };

}