/*jshint -W030*/
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
            /*jshint -W020 */
            simulator = scope.simulator;
            scope.inputWord = "abc";
            scope.addStateWithPresets(50, 50);
            scope.addStateWithPresets(50, 200);
            scope.addStateWithPresets(200, 200);
            scope.addStateWithPresets(200, 50);
            scope.addTransition(0, 1, "a");
            scope.addTransition(1, 2, "b");
            scope.addTransition(2, 3, "c");
            scope.addTransition(3, 0, "l");
            scope.addFinalState(3);
            scope.changeStartState(0);
        }));

        it('At the beginning the inputWord should be undefined', function() {
            console.log(simulator.inputWord);
            expect(simulator.inputWord).toBeUndeFined;
        });

        it('When resetting', function() {
            simulator.reset();
            expect(simulator.transition).toBeNull();
            expect(simulator.inputWord).toBeUndeFined;
        });
        /*
        it('When press Play', function() {
            simulator.playOrPause();
            expect(simulator.transition).toBeNull();
            expect(simulator.inputWord).toBeUndeFined;
        });

         it('State should be created', function() {
             expect(scope.config.countStateId).toBe(1);
             expect(scope.config.states.length).toBe(1);
         });*/

    });
});
