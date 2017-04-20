describe('', function() {
	var scope,
	    controller;
	beforeEach(function() {
		module('automata-simulation');
	});

	describe('PDA-API', function() {
		beforeEach(inject(function($rootScope, $controller) {
			scope = $rootScope.$new();

			controller = $controller('PDACtrl', {
				'$scope' : scope
			});
			//Prepare the scope for the unittest

		}));

		describe('Transitions', function() {
			it('Transition should be created, if states created before', function() {
				scope.addState("S0", 10, 10);
				scope.addTransition(0, 0, "a", "#", "A");
				expect(scope.config.countTransitionId).toBe(1);
				expect(scope.config.transitions.length).toBe(1);
				scope.addTransition(0, 1, "a", "#", "A");
				scope.addTransition(1, 0, "a", "#", "A");
				expect(scope.config.countTransitionId).toBe(1);
				expect(scope.config.transitions.length).toBe(1);

			});
			
			it('exist a transition like me', function() {
				scope.addState("S0", 10, 10);
				scope.addState("S1", 10, 10);
				scope.addTransition(0, 0, "a", "#", "A");
				scope.addTransition(0, 1, "c", "A", "B");
				scope.addTransition(1, 1, "c", "#", "A");
				scope.addTransition(1, 0, "c", "#", "A");

				expect(scope.existsTransition(0, 0, "a","#","A")).toBe(true);
				expect(scope.existsTransition(0, 0, "a","#","B")).toBe(false);
				expect(scope.existsTransition(0, 1, "c","A","B")).toBe(true);
				expect(scope.existsTransition(0, 0, "c","A","B")).toBe(false);
			});

		});
	});
});
