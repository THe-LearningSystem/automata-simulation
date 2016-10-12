describe('Simulation Automata', function () {
    var scope,
        controller;
    beforeEach(function () {
        module('automata-simulation');
    });

    describe('DFA-API', function () {
        beforeEach(inject(function ($rootScope, $controller) {
            scope = $rootScope.$new();
            controller = $controller('DFACtrl', {
                '$scope': scope
            });
        }));

        describe('States', function () {
            it('State should be created', function () {
                scope.states.create("S0", 10, 10);
                expect(scope.states.length).toBe(1);
            });
            it('StateWithPresets should be created', function () {
                scope.states.createWithPresets(10, 10);
                scope.states.createWithPresets(10, 10);
                scope.states.createWithPresets(10, 10);
                expect(scope.states.length).toBe(3);
                expect(scope.states[0].name).toBe("S0");
                expect(scope.states[1].name).toBe("S1");
            });

            it('Should find a state with a name', function () {
                scope.states.create("S0", 10, 10);
                expect(scope.states.existsWithName('S0')).toBe(true);
                expect(scope.states.existsWithName('S1')).toBe(false);
            });

            it('State should be Found by Id (exist)', function () {
                scope.states.create("S0", 10, 10);
                expect(scope.states.existsWithId(0)).toBe(true);
                expect(scope.states.existsWithId(1)).toBe(false);
            });

            it('Has state transition(s)', function () {
                scope.states.create("S0", 10, 10);
                scope.states.create("S1", 10, 10);
                scope.states.create("S3", 10, 10);
                scope.transitions.create(0, 1, "a");
                scope.transitions.create(1, 1, "b");

                expect(scope.states.hasTransitions(0)).toBe(true);
                expect(scope.states.hasTransitions(2)).toBe(false);
            });

            it('StateArrayId should be Found by id', function () {
                scope.states.create("S0", 10, 10);
                expect(scope.states.getIndexByStateId(0)).toBe(0);
                expect(scope.states.getIndexByStateId(4)).toBe(-1);
            });

            it('State should be returned back by id', function () {
                scope.states.create("S0", 10, 10);
                expect(scope.states.getById(0)).toBeDefined();
                expect(scope.states.getById(2)).not.toBeDefined();
            });

            it('State should be uniqe', function () {
                scope.states.create("S0", 10, 10);
                scope.states.create("S0", 10, 10);
                scope.states.create("S1", 10, 10);
                expect(scope.states.length).toBe(2);
            });

            it('State should be removed', function () {
                var tmp = scope.states.create("S0", 10, 10);
                scope.states.create("S1", 10, 10);
                scope.states.remove(tmp);
                expect(scope.states.existsWithName("S1")).toBe(true);
                expect(scope.states.length).toBe(1);
            });
            it('State Ids working, when adding state and adding new State', function () {
                var state1 = scope.states.create("S0", 10, 10);
                var state2 = scope.states.create("S1", 10, 10);
                var state3 = scope.states.create("S2", 10, 10);
                var state4 = scope.states.create("S3", 10, 10);
                scope.states.remove(state3);
                expect(scope.states.existsWithName("S1")).toBe(true);
                expect(scope.states.existsWithName("S2")).toBe(false);
                expect(scope.states.length).toBe(3);
                var state3 = scope.states.create("S2", 10, 10);
                expect(scope.states.length).toBe(4);


            });

            it('State should be modified, if name isnt in use', function () {
                var state1 = scope.states.create("S0", 10, 10);
                var state2 = scope.states.create("S1", 10, 10);
                scope.states.rename(state1, "S1");
                expect(state1.name).toBe('S0');
                scope.states.rename(state1, "S2");
                expect(state1.name).toBe('S2');
            });

            it('Should change the startstate', function () {
                var state1 = scope.states.create("S0", 10, 10);
                var state2 = scope.states.create("S1", 10, 10);
                scope.states.changeStartState(state1);
                expect(scope.states.startState).toBe(state1);
                scope.states.changeStartState(undefined);
                expect(scope.states.startState).toBe(undefined);
            });

            describe('FinalState', function () {
                it('Should add FinalState, but not if already exist', function () {
                    var state1 = scope.states.create("S0", 10, 10);
                    var state2 = scope.states.create("S1", 10, 10);
                    scope.states.final.create(state1);
                    expect(scope.states.final.length).toBe(1);
                    expect(scope.states.final[0]).toBe(state1);
                    scope.states.final.create(state2);
                    expect(scope.states.final.length).toBe(2);
                    expect(scope.states.final[1]).toBe(state2);
                    scope.states.final.create(state1);
                    expect(scope.states.final.length).toBe(2);
                });

                it('Should get the index of the finalState', function () {
                    var state1 = scope.states.create("S0", 10, 10);
                    var state2 = scope.states.create("S1", 10, 10);
                    scope.states.final.create(state1);
                    scope.states.final.create(state2);
                    expect(scope.states.final.getIndexByState(state1)).toBe(0);
                    expect(scope.states.final.getIndexByState(state2)).toBe(1);
                    expect(scope.states.final.getIndexByState(undefined)).toBe(-1);
                });

                it('Should remove the finalState', function () {
                    var state1 = scope.states.create("S0", 10, 10);
                    var state2 = scope.states.create("S1", 10, 10);
                    var state3 = scope.states.create("S2", 10, 10);
                    scope.states.final.create(state1);
                    scope.states.final.create(state2);
                    scope.states.final.create(state3);
                    scope.states.final.remove(state1);
                    expect(scope.states.final.length).toBe(2);
                });

                it('Is state a finalState', function () {
                    var state1 = scope.states.create("S0", 10, 10);
                    var state2 = scope.states.create("S1", 10, 10);
                    scope.states.final.create(state1);
                    expect(scope.states.final.isFinalState(state1)).toBe(true);
                    expect(scope.states.final.isFinalState(state2)).toBe(false);
                });
            });
        });

        describe('Transitions', function () {
            it('Transition should be created, ', function () {
                var state1 = scope.states.create("S0", 10, 10);
                var state2 = scope.states.create("S1", 10, 10);
                scope.transitions.create(state1, state1, "a");
                expect(scope.transitions.length).toBe(1);
                scope.transitions.create(state1, state2, "b");
                expect(scope.transitions.length).toBe(2);

            });

            it('ddeterministic shouldnt create transition', function () {
                var state1 = scope.states.create("S0", 10, 10);
                var state2 = scope.states.create("S1", 10, 10);
                scope.transitions.create(state1, state1, "a");
                scope.transitions.create(state1, state2, "a");

                console.log(scope.transitions);
                expect(scope.transitions.exists(state1, state2, "a")).toBe(true);
            });
            it('exist a transition like me', function () {
                var state1 = scope.states.create("S0", 10, 10);
                var state2 = scope.states.create("S1", 10, 10);
                scope.transitions.create(state1, state1, "a");
                scope.transitions.create(state1, state2, "c");
                scope.transitions.create(state2, state2, "c");
                scope.transitions.create(state2, state1, "c");
                console.log(scope.transitions);
                expect(scope.transitions.exists(state1, state1, "a")).toBe(true);
                expect(scope.transitions.exists(state1, state2, "c")).toBe(true);
                expect(scope.transitions.exists(state1, state1, "b")).toBe(false);
            });


            it('should get a transition by transitionId', function () {
                var state1 = scope.states.create("S0", 10, 10);
                var state2 = scope.states.create("S1", 10, 10);
                scope.transitions.create(state1, state1, "a");
                expect(scope.transitions.getById(0)).toBeDefined();
                expect(scope.transitions.getById(1)).not.toBeDefined();
            });

            it('should remove a transition by transitionId', function () {
                var state1 = scope.states.create("S0", 10, 10);
                var state2 = scope.states.create("S1", 10, 10);
                var trans1 = scope.transitions.create(state1, state1, "a");
                scope.transitions.create(state1, state1, "b");
                scope.transitions.remove(trans1);
                expect(scope.transitions.length).toBe(1);
            });

            it('should modify a transition by transitionId and newTransitionName', function () {
                var state1 = scope.states.create("S0", 10, 10);
                var state2 = scope.states.create("S1", 10, 10);
                var trans1 = scope.transitions.create(state1, state1, "a");
                var trans2 = scope.transitions.create(state1, state1, "b");
                var trans3 = scope.transitions.create(state1, state1, "c");
                scope.transitions.modify(trans1, "b");
                scope.transitions.modify(trans3, "d");
                expect(trans1.inputSymbol).toBe("a");
                expect(trans3.inputSymbol).toBe("d");

            });
        });
    });
});
