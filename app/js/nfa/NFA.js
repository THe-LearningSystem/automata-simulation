//NFA
function NFA($scope, $translate) {
    "use strict";
    var self = this;
    DFA.apply(this, arguments);

    //Config Object
    $scope.config = cloneObject($scope.defaultConfig);


    /**
     * Checks if a transition with the params already exists
     * @param  {number}  fromState      Id of the fromstate
     * @param  {number}  toState        id from the toState
     * @param  {String}  transitionName The name of the transition
     * @return {Boolean}
     */
    $scope.existsTransition = function (fromState, toState, transitionName, transitionId) {
        var tmp = false;
        _.forEach($scope.config.transitions, function (transition) {
            if (transition.fromState == fromState && transition.name == transitionName && transition.toState == toState && transition.id !== transitionId) {
                tmp = true;
                return;
            }
        })
        return tmp;
    };

}