describe('Simulation Automata', function () {
    var scope,
        controller;
    beforeEach(function () {
        module('automata-simulation');
    });


    describe('DFA Test', function () {
        beforeEach(inject(function ($rootScope, $controller) {
            scope = $rootScope.$new();
            controller = $controller('DFACtrl', {
                '$scope': scope
            });
            //Prepare the scope for the unittest
            scope.graphdesigner.isGrid = false;
        }));

        describe('States', function () {
            it('State should be created', function () {
                scope.addState("S0", 10, 10);
                expect(scope.config.countStateId).toBe(1);
                expect(scope.config.states.length).toBe(1);
            });

            it('Should find a state with a name', function () {
                scope.addState("S0", 10, 10);
                expect(scope.existsStateWithName('S0')).toBe(true);
                expect(scope.existsStateWithName('S1')).toBe(false);
            });

            it('State should be Found by Id (exist)', function () {
                scope.addState("S0", 10, 10);
                expect(scope.existsStateWithId(0)).toBe(true);
                expect(scope.existsStateWithId(1)).toBe(false);
            });

            it('Has state transition(s)', function () {
                scope.addState("S0", 10, 10);
                scope.addState("S1", 10, 10);
                scope.addState("S3", 10, 10);
                scope.addTransition(0, 1, "a");
                scope.addTransition(1, 1, "b");

                expect(scope.hasStateTransitions(0)).toBe(true);
                expect(scope.hasStateTransitions(2)).toBe(false);
            });

            it('StateArrayId should be Found by id', function () {
                scope.addState("S0", 10, 10);
                expect(scope.getArrayStateIdByStateId(0)).toBe(0);
                expect(scope.getArrayStateIdByStateId(4)).toBe(-1);
            });

            it('State should be returned back by id', function () {
                scope.addState("S0", 10, 10);
                expect(scope.getStateById(0)).toBeDefined();
                expect(scope.getStateById(2)).not.toBeDefined();
            });

            it('State should be uniqe', function () {
                scope.addState("S0", 10, 10);
                scope.addState("S0", 10, 10);
                scope.addState("S1", 10, 10);
                expect(scope.config.countStateId).toBe(2);
            });

            it('State shouldnt be  easy removed if they have a transition', function () {
                scope.addState("S0", 10, 10);
                scope.addState("S1", 10, 10);
                scope.addTransition(0, 1, "a");
                scope.removeState(1);
                expect(scope.config.countStateId).toBe(2);
                expect(scope.config.states.length).toBe(2);
            });

            it('State should be removed', function () {
               var tmp =  scope.addState("S0", 10, 10);
                scope.addState("S1", 10, 10);
                scope.removeState(tmp.id);
                expect(scope.existsStateWithName("S1")).toBe(true);
                expect(scope.config.states.length).toBe(1);
            });

            it('State should be renamed, if name isnt in use', function () {
                scope.addState("S0", 10, 10);
                scope.addState("S1", 10, 10);
                scope.renameState(0, "S1");
                expect(scope.getStateById(0).name).toBe('S0');
                scope.renameState(0, "S2");
                expect(scope.getStateById(0).name).toBe('S2');
            });

            it('Should change the startstate, if exist!', function () {
                scope.addState("S0", 10, 10);
                scope.addState("S1", 10, 10);
                scope.changeStartState(1);
                expect(scope.config.startState).toBe(1);
                scope.changeStartState(3);
                expect(scope.config.startState).toBe(1);
            });

            describe('FinalState', function () {
                it('Should add FinalState, but not if already exist', function () {
                    scope.addState("S0", 10, 10);
                    scope.addState("S1", 10, 10);
                    scope.addFinalState(1);
                    expect(scope.config.finalStates.length).toBe(1);
                    expect(scope.config.finalStates[0]).toBe(1);
                    scope.addFinalState(0);
                    expect(scope.config.finalStates.length).toBe(2);
                    expect(scope.config.finalStates[1]).toBe(0);
                    //TODO:TEST IF FINALSTATE ALREADY EXIST
                    scope.addFinalState(1);
                    expect(scope.config.finalStates.length).toBe(2);
                });

                it('Should get the index of the finalState', function () {
                    scope.addState("S0", 10, 10);
                    scope.addState("S1", 10, 10);
                    scope.addFinalState(1);
                    scope.addFinalState(0);
                    expect(scope.getFinalStateIndexByStateId(1)).toBe(0);
                    expect(scope.getFinalStateIndexByStateId(0)).toBe(1);
                    expect(scope.getFinalStateIndexByStateId(2)).toBe(-1);
                });

                it('Should remove the finalState', function () {
                    scope.addState("S0", 10, 10);
                    scope.addState("S1", 10, 10);
                    scope.addState("S2", 10, 10);
                    scope.addFinalState(1);
                    scope.addFinalState(0);
                    scope.addFinalState(2);
                    scope.removeFinalState(1);
                    expect(scope.config.finalStates[scope.getFinalStateIndexByStateId(0)]).toBe(0);
                    expect(scope.config.finalStates.length).toBe(2);
                });

                it('Is state a finalState', function () {
                    scope.addState("S0", 10, 10);
                    scope.addState("S1", 10, 10);
                    scope.addFinalState(1);
                    expect(scope.isStateAFinalState(1)).toBe(true);
                    expect(scope.isStateAFinalState(0)).toBe(false);
                });
            });
        });

        describe('Transitions', function () {
            it('Transition should be created, if states created before', function () {
                scope.addState("S0", 10, 10);
                scope.addTransition(0, 0, "a");
                expect(scope.config.countTransitionId).toBe(1);
                expect(scope.config.transitions.length).toBe(1);
                scope.addTransition(0, 1, "a");
                scope.addTransition(1, 0, "a");
                expect(scope.config.countTransitionId).toBe(1);
                expect(scope.config.transitions.length).toBe(1);

            });

            it('exist a transition like me', function () {
                scope.addState("S0", 10, 10);
                scope.addState("S1", 10, 10);
                scope.addTransition(0, 0, "a");
                scope.addTransition(0, 1, "c");
                scope.addTransition(1, 1, "c");
                scope.addTransition(1, 0, "c");


                expect(scope.existsTransition(0, 0, "a")).toBe(true);
                expect(scope.existsTransition(0, 1, "c")).toBe(true);
                expect(scope.existsTransition(0, 0, "b")).toBe(false);

            });

            it('Should get the right transitionArrayId', function () {
                scope.addState("S0", 10, 10);
                scope.addState("S1", 10, 10);
                scope.addTransition(0, 0, "a");
                scope.addTransition(0, 0, "b");
                scope.addTransition(0, 0, "c");
                expect(scope.getArrayTransitionIdByTransitionId(0)).toBe(0);
                expect(scope.getArrayTransitionIdByTransitionId(1)).not.toBe(0);
            });

            it('should get a transition by transitionId', function () {
                scope.addState("S0", 10, 10);
                scope.addState("S1", 10, 10);
                scope.addTransition(0, 0, "a");
                expect(scope.getTransitionById(0)).toBeDefined();
                expect(scope.getTransitionById(1)).not.toBeDefined();
            });

            it('should remove a transition by transitionId', function () {
                scope.addState("S0", 10, 10);
                scope.addState("S1", 10, 10);
                scope.addTransition(0, 0, "a");
                scope.addTransition(0, 0, "b");
                scope.removeTransition(0);
                expect(scope.config.transitions.length).toBe(1);
            });

            it('should rename a transition by transitionId and newTransitionName', function () {
                scope.addState("S0", 10, 10);
                scope.addState("S1", 10, 10);
                scope.addTransition(0, 0, "A");
                scope.addTransition(0, 0, "B");
                scope.renameTransition(0, "B");
                scope.renameTransition(1, "D");
                expect(scope.getTransitionById(0).name).toBe("A");
                expect(scope.getTransitionById(1).name).toBe("D");

            });
        });
    });
});