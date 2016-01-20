describe('Simulation Automata', function() {
    var scope,
        controller;
    beforeEach(function() {
        module('myApp');
    });


    describe('DFA Test', function() {
        beforeEach(inject(function($rootScope, $controller) {
            scope = $rootScope.$new();
            controller = $controller('DFACtrl', {
                '$scope': scope
            });
            //CREATE THE TEST DATA
            scope.config.finalStates.push(3);
            scope.inputWord = "abc";
            scope.addStateWithPresets(50, 50);
            scope.addStateWithPresets(50, 200);
            scope.addStateWithPresets(200, 200);
            scope.addStateWithPresets(200, 50);


            scope.addTransition(0, 1, "a");
            scope.addTransition(1, 2, "b");
            scope.addTransition(2, 3, "c");
            scope.addTransition(3, 0, "l");
        }));


        it("Just a title", function() {
            expect(true).toBe(true);
        });
        it('sets the name A', function() {
            expect(scope.default.statePrefix).toBe('S');
            expect(scope.default.statePrefix).not.toBe('A');
        });

        it('there are 4 states now',function(){
        	expect(scope.config.countStateId).toBe(4);
        });


    });




});
