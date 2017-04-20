/**
 * Constructor for the transitions object
 * @param $scope
 * @constructor
 */
autoSim.Transitions = function ($scope) {
    var self = this;
    self.selected = null;
    self.inputSymbolAlphabet = new autoSim.TransitionInputAlphabet($scope);
    self.transitionsId = 0;
    self.textLength = 8;
    self.selfTransitionTextLength = 10;


    self.selectTransitionGroup = function(transitionGroup){
        self.selected = transitionGroup;
        $scope.core.updateListener();
    };

    /**
     * Returns a transitionGroup
     * @param fromState
     * @param toState
     * @returns {object}
     */
    self.getTransitionGroup = function (fromState, toState) {
        var tmp = undefined;
        _.forEach(self, function (transitionGroup) {
            if (fromState === transitionGroup.fromState && toState === transitionGroup.toState) {
                tmp = transitionGroup;
                return false;
            }
        });
        return tmp;
    };


    /**
     * Checks if a transition with the params already exists, excepts the given transition
     * @param fromState
     * @param toState
     * @param inputSymbol
     * @param transitionId
     * @returns {boolean}
     */
    self.exists = function (fromState, toState, inputSymbol, transitionId) {
        var tmp = false;
        _.forEach(self, function (transitionGroup) {
            if (fromState === transitionGroup.fromState) {
                _.forEach(transitionGroup, function (transition) {
                    if (transition.inputSymbol === inputSymbol && transitionId !== transition.id) {
                        tmp = true;
                        return false;
                    }
                });
                if (tmp === true)
                    return false;
            }
        });
        return tmp;
    };

    /**
     * Return the next possible inputSymbol (a,b,c already used -> returns d)
     * @param fromState
     * @returns {string}
     */
    self.getNextInputSymbol = function (fromState) {
        var inputSymbols = [];
        for (var i = 0; i < self.length; i++) {
            if (self[i].fromState == fromState) {
                _.forEach(self[i], function (transition) {
                    inputSymbols.push(transition.inputSymbol);
                })
            }
        }
        var foundNextName = false;
        var tryChar = "a";
        while (!foundNextName) {
            var value = _.indexOf(inputSymbols, tryChar);
            if (value === -1) {
                foundNextName = true;
            } else {
                tryChar = String.fromCharCode(tryChar.charCodeAt() + 1);
            }
        }
        return tryChar;
    };

    /**
     * Creates a transition with the DefaultValues
     * @param fromState
     * @param toState
     * @returns {fromState}
     */
    self.createWithDefaults = function (fromState, toState) {
        return self.create(fromState, toState, self.getNextInputSymbol(fromState));
    };

    /**
     * Creates a transition at the end of the transitions array
     * @param fromState
     * @param toState
     * @param inputSymbol
     * @return {object}
     */
    self.create = function (fromState, toState, inputSymbol) {
        if (!self.exists(fromState, toState, inputSymbol)) {
            self.inputSymbolAlphabet.addIfNotExists(inputSymbol);
            return self.createWithId(self.transitionsId++, fromState, toState, inputSymbol);
        } else {
            console.error("Cant create transition,exists", self.exists(fromState, toState, inputSymbol));
        }
    };

    /**
     * Creates a transition at the end of the transitions array -> for import
     * !!!don't use at other places!!!!! ONLY FOR IMPORT
     * @param transitionId
     * @param fromState
     * @param toState
     * @param inputSymbol
     * @return {object}
     */
    self.createWithId = function (transitionId, fromState, toState, inputSymbol) {
        var transitionGroup = self.getTransitionGroup(fromState, toState);
        var transition = undefined;
        if (transitionGroup === undefined) {
            transitionGroup = new autoSim.TransitionGroup(fromState, toState);
            transition = transitionGroup.create(transitionId, inputSymbol);
            self.push(transitionGroup);
        } else {
            transition = transitionGroup.create(transitionId, inputSymbol);
        }
        //update the approach transition if there is one
        if (self.getTransitionGroup(transitionGroup.toState, transitionGroup.fromState) !== undefined) {
            var approachTransitionGroup = self.getTransitionGroup(transitionGroup.toState, transitionGroup.fromState);
            approachTransitionGroup.svgConfig = self.getTransitionSvgConfig(approachTransitionGroup, true);
        }
        $scope.core.updateListener();
        return transition;
    };

    /**
     * Returns the transition of the given transitionId
     * @param transitionId
     * @returns {object}        Returns the objectReference of the state
     */
    self.getById = function (transitionId) {
        var returnObject = undefined;
        _.forEach(self, function (transitionGroup) {
            _.forEach(transitionGroup, function (transition) {
                if (transition.id === transitionId) {
                    returnObject = transition;
                    return false;
                }
            });
            if (returnObject !== undefined)
                return false;
        });
        return returnObject;
    };

    /**
     * Returns the transition with the given information
     * @param fromState      Id of the fromState
     * @param toState        id from the toState
     * @param inputSymbol The name of the transition
     * @returns {Object}
     */
    self.get = function (fromState, toState, inputSymbol) {
        var transition = undefined;
        _.forEach(self, function (transitionGroup) {
            if (transitionGroup.fromState === fromState && transitionGroup.toState === toState) {
                _.forEach(transitionGroup, function (tmpTransition) {
                    if (tmpTransition.inputSymbol === inputSymbol) {
                        transition = tmpTransition;
                        return false;
                    }
                });
                if (transition !== undefined)
                    return false;
            }
        });
        return transition;
    };

    /**
     * Removes the transition
     * @param transition      The id from the transition
     */
    self.remove = function (transition) {
        self.inputSymbolAlphabet.removeIfNotUsedFromOthers(transition);
        var transitionGroup = self.getTransitionGroup(transition.fromState, transition.toState);
        if (transitionGroup.length === 1) {
            _.remove(self, function (transitionGroup) {
                return transitionGroup.toState === transition.toState && transitionGroup.fromState === transition.fromState;
            });
            if (self.getTransitionGroup(transition.toState, transition.fromState) !== undefined) {
                var approachTransitionGroup = self.getTransitionGroup(transition.toState, transition.fromState);
                approachTransitionGroup.svgConfig = self.getTransitionSvgConfig(approachTransitionGroup);
            }
        } else {
            _.remove(transitionGroup, function (tmpTransition) {
                return transition.id === tmpTransition.id;
            })
        }
        $scope.core.updateListener();
    };

    /**
     * Modify a transition if is unique with the new name
     * @param transition
     * @param newInputSymbol
     */
    self.modify = function (transition, newInputSymbol) {
        if (!self.exists(transition.fromState, transition.toState, newInputSymbol, transition.id)) {
            self.inputSymbolAlphabet.removeIfNotUsedFromOthers(transition);
            self.inputSymbolAlphabet.addIfNotExists(newInputSymbol);
            transition.inputSymbol = newInputSymbol;
            $scope.core.updateListener();
        }
    };

    /**CONST FOR TRANSITION_SVG_CONFIG**/
        //the distance the endPoint of the transition is away from the state
    const gapBetweenTransitionLineAndState = 3;
    //is for the selfReference
    const STRETCH_X = 40;
    const STRETCH_Y = 18;
    const stateSelfReferenceNumber = Math.sin(45 * (Math.PI / 180)) * $scope.states.radius;
    /**
     * Returns the transitionDrawConfig with all the data like xstart, xEnd, xText....
     * @param   {object}  transitionGroup    the transitionObj
     * @param   {boolean} forceApproach if we force an approachedTransition ->needed when the transition was written to the array, or for the addTransition
     * @returns {object}  the drawConfig
     */
    self.getTransitionSvgConfig = function (transitionGroup, forceApproach) {
        if (transitionGroup.fromState === transitionGroup.toState) {
            return self.getSelfTransitionSvgConfig(transitionGroup);
        } else {
            var obj = {};
            /** Check if there is a transition approach our transition**/
            obj.approachTransition = forceApproach || self.getTransitionGroup(transitionGroup.toState, transitionGroup.fromState);

            /**Calc Important Data for both**/
            var fromState = transitionGroup.fromState;
            var toState = transitionGroup.toState;
            //needed for the calculation of the coordinates
            var directionVector = {
                x: toState.x - fromState.x,
                y: toState.y - fromState.y
            };
            var directionVectorLength = Math.sqrt(directionVector.x * directionVector.x + directionVector.y * directionVector.y);
            var nStart, nEnd;
            if ($scope.states.final.isFinalState(transitionGroup.fromState))
                nStart = ($scope.states.radius + 5) / directionVectorLength;
            else
                nStart = ($scope.states.radius) / directionVectorLength;
            if ($scope.states.final.isFinalState(transitionGroup.toState))
                nEnd = ($scope.states.radius + gapBetweenTransitionLineAndState + 5) / directionVectorLength;
            else
                nEnd = ($scope.states.radius + gapBetweenTransitionLineAndState) / directionVectorLength;


            obj.xStart = fromState.x + nStart * directionVector.x;
            obj.yStart = fromState.y + nStart * directionVector.y;
            obj.xEnd = toState.x - nEnd * directionVector.x;
            obj.yEnd = toState.y - nEnd * directionVector.y;
            obj.xDiff = toState.x - fromState.x;
            obj.yDiff = toState.y - fromState.y;
            obj.xMid = (fromState.x + toState.x) / 2;
            obj.yMid = (fromState.y + toState.y) / 2;
            obj.distance = Math.sqrt(obj.xDiff * obj.xDiff + obj.yDiff * obj.yDiff);
            var vecA = {
                x: obj.xMid - obj.xStart,
                y: obj.yMid - obj.yStart,
                z: 0
            };
            var vecB = {
                x: 0,
                y: 0,
                z: 1
            };
            var vecX = {
                x: 1,
                y: 0,
                z: 0
            };
            var stretchValue,
                movingPoint;
            /**4:Calc the curveStart and end if there is and approach transition**/
            if (obj.approachTransition) {

                var xStart = MathHelper.getAngles({
                    x: obj.xStart - transitionGroup.fromState.x,
                    y: obj.yStart - transitionGroup.fromState.y
                }, {
                    x: $scope.states.radius,
                    y: 0
                });
                var xEnd = MathHelper.getAngles({
                    x: obj.xEnd - transitionGroup.toState.x,
                    y: obj.yEnd - transitionGroup.toState.y
                }, {
                    x: $scope.states.radius,
                    y: 0
                });
                obj.xStart = transitionGroup.fromState.x + ($scope.states.radius * Math.cos(MathHelper.toRadians(xStart.upperAngle)));
                obj.yStart = transitionGroup.fromState.y - ($scope.states.radius * Math.sin(MathHelper.toRadians(xStart.upperAngle)));
                obj.xEnd = transitionGroup.toState.x + ($scope.states.radius * Math.cos(MathHelper.toRadians(xEnd.lowerAngle)));
                obj.yEnd = transitionGroup.toState.y - ($scope.states.radius * Math.sin(MathHelper.toRadians(xEnd.lowerAngle)));
            }

            //OLD:stretchValue = (70 * (1 / obj.distance * 1.1) * 1.4);
            stretchValue = 35;
            movingPoint = MathHelper.crossPro(vecA, vecB);
            movingPoint = MathHelper.fixedVectorLength(movingPoint);
            movingPoint = MathHelper.expandVector(movingPoint, stretchValue);
            obj.xMidCurv = movingPoint.x + obj.xMid;
            obj.yMidCurv = movingPoint.y + obj.yMid;
            /**5:Calc the textPosition**/
            var transNamesLength;
            if (transitionGroup) {
                transNamesLength = transitionGroup.length;
            } else {
                transNamesLength = 1;
            }
            var angleAAndX = MathHelper.AngleBetweenTwoVectors(vecA, vecX);
            var textStretchValue,
                textPoint;
            var textAngle = angleAAndX.degree;
            if (textAngle > 90) {
                if (textAngle == 180) {
                    textAngle = 0;
                } else {
                    textAngle = 90 - (textAngle % 90);
                }
            }
            var x = Math.pow((textAngle / 90), 1 / 2);
            if (obj.approachTransition) {
                textStretchValue = (40 + self.textLength * transNamesLength * x);
            } else {
                textStretchValue = (12 + self.textLength * transNamesLength * x);
            }

            textPoint = MathHelper.crossPro(vecA, vecB);
            textPoint = MathHelper.fixedVectorLength(textPoint);
            textPoint = MathHelper.expandVector(textPoint, textStretchValue);


            obj.xText = textPoint.x + obj.xMid;
            obj.yText = textPoint.y + obj.yMid;
            /**6:Calc the path**/

            if (obj.approachTransition) {
                var pathWithApproachTransition = d3.path();
                pathWithApproachTransition.moveTo(obj.xStart, obj.yStart);
                pathWithApproachTransition.quadraticCurveTo(obj.xMidCurv, obj.yMidCurv, obj.xEnd, obj.yEnd);
                obj.path = pathWithApproachTransition.toString();
                pathWithApproachTransition.closePath();
            } else {
                var path = d3.path();
                path.moveTo(obj.xStart, obj.yStart);
                path.lineTo(obj.xEnd, obj.yEnd);
                obj.path = path.toString();
                path.closePath();
            }
            return new autoSim.SvgConfig(obj.path, obj.xText, obj.yText);
        }
    };

    /**
     * Returns the svgConfig -> if the transitions is a selfReference
     * @param transitionGroup
     * @returns {autoSim.SvgConfig}
     */
    self.getSelfTransitionSvgConfig = function (transitionGroup) {
        var obj = {};
        var x = transitionGroup.fromState.x;
        var y = transitionGroup.fromState.y;
        var path = d3.path();
        path.moveTo(x - stateSelfReferenceNumber, y - stateSelfReferenceNumber);
        path.bezierCurveTo(
            x - stateSelfReferenceNumber - STRETCH_X, y - stateSelfReferenceNumber - STRETCH_Y,
            x - stateSelfReferenceNumber - STRETCH_X, y + stateSelfReferenceNumber + STRETCH_Y,
            x - stateSelfReferenceNumber, y + stateSelfReferenceNumber
        );
        obj.path = path.toString();
        path.closePath();
        obj.x = x - $scope.states.radius - 35 - self.selfTransitionTextLength * transitionGroup.length;
        obj.y = y;
        return new autoSim.SvgConfig(obj.path, obj.x, obj.y)
    };

    /**
     * updates the TransitionSvgConfig from all Transitions that are connected to the given state, used when moving a state
     * @param state
     */
    self.updateTransitionSvgConfig = function (state) {
        _.forEach(self, function (transitionGroup) {
            if (transitionGroup.fromState === state || transitionGroup.toState === state) {
                transitionGroup.svgConfig = self.getTransitionSvgConfig(transitionGroup);
            }
        });
    };

    /**
     * Export the transitionData
     * @returns {object}
     */
    self.export = function () {
        var exportData = {};
        exportData.array = [];
        _.forEach(self, function (transitionGroup) {
            exportData.array.push(_.cloneDeep(transitionGroup));
        });
        exportData.transitionsId = self.transitionsId;
        exportData.inputSymbolAlphabet = self.inputSymbolAlphabet.export();
        return exportData;
    };

    /**
     * Imports transitions
     * @param importData
     */
    self.import = function (importData) {
        self.clear();
        _.forEach(importData.array, function (transitionGroup) {
            _.forEach(transitionGroup, function (transition) {
                self.create($scope.states.getById(transition.fromState.id), $scope.states.getById(transition.toState.id), transition.inputSymbol);
            });
        });
        self.transitionsId = importData.transitionsId;
        self.inputSymbolAlphabet.import(importData.inputSymbolAlphabet);

    };

    /**
     * Clears the transitions
     */
    self.clear = function () {
        _.forEach(self, function () {
            self.pop();
        });
        self.transitionsId = 0;
        self.inputSymbolAlphabet.clear();
    };
};
autoSim.Transitions.prototype = Array.prototype;