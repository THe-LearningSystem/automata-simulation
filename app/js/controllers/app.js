// Declare app level module which depends on views, and components
var autoSim = angular.module('automata-simulation', [
  'ngRoute',
  'ui.bootstrap'
]).
config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/dfa', {
        templateUrl: 'view/dfa.html',
        controller: 'DFACtrl'
    });
    $routeProvider.when('/dpa', {
        templateUrl: 'view/dpa.html',
        controller: 'DPACtrl'
    });
    $routeProvider.otherwise({
        redirectTo: '/dfa'
    });
}]);
autoSim.controller('DFACtrl', ['$scope', '$log', function ($scope, $log) {

}]);
