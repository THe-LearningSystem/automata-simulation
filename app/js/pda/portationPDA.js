function PortationPDA($scope) {
    "use strict";

    var self = this;

    PortationDFA.apply(self, arguments);
    self.type = "PDA";


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