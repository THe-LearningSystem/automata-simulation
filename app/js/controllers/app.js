'use strict';

// Declare app level module which depends on views, and components
var myApp = angular.module('myApp', [
  'ngRoute',
]).

config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/simulation',{
        templateUrl: 'view/simulation.html',
        controller: 'simulationCtrl'
    })
  $routeProvider.otherwise({redirectTo: '/simulation'});
}]);

