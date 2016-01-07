'use strict';

// Declare app level module which depends on views, and components
var myApp = angular.module('myApp', [
  'ngRoute',
]).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/dfa',{
        templateUrl: 'view/dfa.html',
        controller: 'DFACtrl'
    })
  $routeProvider.otherwise({redirectTo: '/dfa'});
}]);
myApp.controller('DFACtrl',['$scope','$log',function($scope,$log){
    
}])
