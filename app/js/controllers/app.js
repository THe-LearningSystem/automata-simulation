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
    $routeProvider.when('/graphdesigner',{
        templateUrl: 'view/graphdesigner.html',
        controller: 'simulationCtrl'
    })
    $routeProvider.when('/design-paper',{
        templateUrl: 'view/design-paper.html',
        controller: 'simulationCtrl'
    })
  $routeProvider.otherwise({redirectTo: '/simulation'});
}]);
myApp.controller('simulationCtrl',['$scope','$log',function($scope,$log){
    
}])
