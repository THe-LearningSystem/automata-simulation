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
    $routeProvider.when('/dfa2', {
        templateUrl: 'view/dfa2.html',
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

/**DIRECTIVES**/

//menuButton
autoSim.directive("menubutton", function () {
    return {
        restrict: 'EA',
        replace: true,
        transclude: false,
        scope: {
            glyphicon: '@',
            action: '&',
            tttext: '@'
        },
        template: '<button type="button" class="menu-button" ng-click="action()" aria-label="Left Align"  uib-tooltip="{{tttext}}"><span class="glyphicon glyphicon-{{glyphicon}}" aria-hidden="true"> </span> </button>'
    };
});

autoSim.directive("menuitem", function () {

    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        controller: function($scope){
            $scope.extended = true;
   
        },
        scope: {
            title: '@',
        },
        template: '<div class="menu-item" ng-click="extended=!extended"><p class="title"><span class="glyphicon glyphicon-triangle-bottom" aria-hidden="true" ng-show="extended"></span><span class="glyphicon glyphicon-triangle-right" aria-hidden="true" ng-show="!extended"></span>{{title}}</p><div class="content" ng-transclude ng-show="extended"></div></div>'

    };
});