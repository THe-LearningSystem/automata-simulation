autoSim.LangTransitions = function ($scope) {
    var self = this;

    console.log("create Transitions");

    self.id = 0;

    /**
     * Removes the transition with the given production id.
     */
    self.removeWithId = function (prId) {
        var toDelete = [];

        _.forEach(self, function (transition) {

            if (prId == transition.from.id || prId == transition.to.id) {
                toDelete.push(self.getIndexByTransitionId(transition.id));
            }
        });

        _.forEach(toDelete, function (value) {
            self.splice(toDelete.pop(), 1);
        });
    };

    /**
     * Get the array index from the transition with the given id.
     * @param productionId
     * @returns  {Boolean} Returns the index and -1 when production with productionId not found
     */
    self.getIndexByTransitionId = function (transitionId) {
        return _.findIndex(self, function (transition) {
            if (transition.id === transitionId) {
                return transition;
            }
        });
    };

    /**
     * Checks the terminal transitions for existance and creates them in both directions.
     */
    self.checkTerminalTranstition = function () {

        _.forEach($scope.productions.nonTerminalObject, function (nonTerminal) {

            _.forEach($scope.productions.terminalObject, function (terminal) {

                if (nonTerminal.id == terminal.nonTerminalOwner) {
                    var prod1 = $scope.productions.getByNonTerminalId(nonTerminal.id);
                    var prod2 = $scope.productions.getByTerminalId(terminal.id);

                    if (!self.checkIfTransitionExists(prod1, prod2)) {
                        self.create(prod1, prod2, true);
                    }
                }
            });
        });
    };

    /**
     * Checks the non terminal transitions for existance and creates them in both directions.
     */
    self.checkNonTerminalTransitions = function () {

        _.forEach($scope.productions.nonTerminalObject, function (production) {

            _.forEach($scope.productions.nonTerminalObject, function (production2) {

                _.forEach(production2.follower, function (follow) {

                    if (production.id == follow) {
                        var prod1 = $scope.productions.getByNonTerminalId(production2.id);
                        var prod2 = $scope.productions.getByNonTerminalId(production.id);

                        if (!self.checkIfTransitionExists(prod1, prod2)) {
                            self.create(prod1, prod2);
                        }
                    }
                });
            });
        });
    };

    /**
     * Checks if the transition between two productions exists.
     * @param   {[[Type]]} production1 [[Description]]
     * @param   {[[Type]]} production2 [[Description]]
     * @returns {boolean}  [[Description]]
     */
    self.checkIfTransitionExists = function (production1, production2) {
        var check = false;

        _.forEach(self, function (transition) {

            if (production1 == transition.from && production2 == transition.to) {
                check = true;

            } else if (production1 == transition.to && production2 == transition.from) {
                check = true;
            }
        });
        return check;
    };

    /**
     * Calls the "createWithId" method, to create a new transition.
     * @param {[[Type]]} from [[Description]]
     * @param {[[Type]]} to   [[Description]]
     */
    self.create = function (from, to, isTerminal) {
        self.createWithId(self.id++, from, to, isTerminal);
    };

    /**
     * Creates a new transition.
     * @param {[[Type]]} id   [[Description]]
     * @param {[[Type]]} from [[Description]]
     * @param {[[Type]]} to   [[Description]]
     */
    self.createWithId = function (id, from, to, isTerminal) {
        var transtition = new autoSim.Transition(id, from, to, self.calculatePath(from, to, isTerminal));
        self.push(transtition);
    };

    /**
     * Calculates the path of the transition.
     * @param   {object}   from [[Description]]
     * @param   {object}   to   [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.calculatePath = function (from, to, isTerminal) {
        var obj = {};

        var directionVector = {
            x: to.posX - from.posX,
            y: to.posY - from.posY
        };

        var directionVectorLength = Math.sqrt(directionVector.x * directionVector.x + directionVector.y * directionVector.y);

        //Non Terminals in grid are bigger, transition is not completly correct, but works for now.
        var nStart = ($scope.productions.radiusT) / directionVectorLength;
        var nEnd = ($scope.productions.radiusT) / directionVectorLength;

        obj.xStart = from.posX + nStart * directionVector.x;
        obj.yStart = from.posY + nStart * directionVector.y;
        obj.xEnd = to.posX - nEnd * directionVector.x;
        obj.yEnd = to.posY - nEnd * directionVector.y;

        var path = d3.path();
        path.moveTo(obj.xStart, obj.yStart);
        path.lineTo(obj.xEnd, obj.yEnd);
        obj = path.toString();
        path.closePath();
        return obj;
    };

    /**
     * Updates the current path to a newer one.
     * @param {[[Type]]} production [[Description]]
     */
    self.updateTransitionPosition = function (production, isTerminal) {

        _.forEach(self, function (value) {

            if (value.from === production || value.to === production) {
                value.path = self.calculatePath(value.from, value.to, isTerminal);
            }
        });
    };

};
autoSim.LangTransitions.prototype = Array.prototype;
