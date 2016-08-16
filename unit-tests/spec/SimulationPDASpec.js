describe('', function() {
	var scope,
	    controller;
	beforeEach(function() {
		module('automata-simulation');
	});

	describe('', function() {
		beforeEach(inject(function($rootScope, $controller) {
			scope = $rootScope.$new();
		
			controller = $controller('PDACtrl', {
				'$scope' : scope
			});
			//Prepare the scope for the unittest

		}));

		describe('Simulation', function() {

			it('Test', function() {
				expect(1).toBe(1);
				scope.addState("S0", 10, 10);
				expect(scope.config.countStateId).toBe(1);
				expect(scope.config.states.length).toBe(1);

			});

		});
	});
});
