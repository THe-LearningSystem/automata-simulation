//PDA
function NPDA($scope, $translate) {
    "use strict";
    PDA.apply(this, arguments);
    $scope.config.type = "NPDA";
    $scope.portation = new PortationPDA($scope, "NPDA");


    /**
     * Checks if a transition with the params already exists
     * @param  {number}  fromState      Id of the fromState
     * @param  {number}  toState        id from the toState
     * @param name
     * @param readFromStack
     * @param writeToStack
     * @param transitionId
     * @return {Boolean}
     */
    $scope.existsTransition = function (fromState, toState, name, readFromStack, writeToStack, transitionId) {
        var tmp = false;
        _.forEach($scope.config.transitions, function (transition) {
            if (transition.fromState == fromState && transition.toState == toState && transition.name == name && transition.readFromStack == readFromStack && transition.writeToStack == writeToStack && transitionId !== transition.id) {
                tmp = true;
                return false;
            }
        });
        return tmp;
    };


}