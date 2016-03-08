// Declare app level module which depends on views, and components
var autoSim = angular.module('automata-simulation', [
  'ngRoute',
  'ui.bootstrap',
  'pascalprecht.translate'
]).config(['$routeProvider', function ($routeProvider) {
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



}]).config(['$translateProvider', function ($translateProvider) {
    //translation
    $translateProvider.useStaticFilesLoader({
        prefix: 'translations/lang-',
        suffix: '.json'
    });
    // Enable escaping of HTML
    $translateProvider.useSanitizeValueStrategy('escape');

    $translateProvider.preferredLanguage('de_DE');
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
        template: '<button type="button" class="menu-button" ng-click="action()" aria-label="Left Align"  uib-tooltip="{{tttext | translate}}"><span class="glyphicon glyphicon-{{glyphicon}}" aria-hidden="true"> </span> </button>'
    };
});

autoSim.directive("menuitemextendable", function () {

    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        controller: function ($scope) {
            $scope.extended = true;
        },
        scope: {
            title: '@',
        },
        template: '<div class="menu-item"><p class="title" ng-click="extended=!extended"><span class="glyphicon glyphicon-triangle-bottom" aria-hidden="true" ng-show="extended"></span><span class="glyphicon glyphicon-triangle-right" aria-hidden="true" ng-show="!extended"></span>{{title | translate}}</p><div class="content" ng-transclude ng-show="extended"></div></div>'

    };

});
autoSim.directive("menuitem", function () {

    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            title: '@',
        },
        template: '<div class="menu-item"><p class="title">{{title}}</p><div class="content" ng-transclude></div></div>'

    };

});

autoSim.directive("automatontable", function () {
    return {
        restrict: 'E',
        scope: {
            automaton: '='
        },
        link: function ($scope, element, attrs) {
            var dfa = $scope.automaton;
            $scope.alphabet = dfa.alphabet;
            $scope.transitions = dfa.transitions;
            //fromid
            //arr
            $scope.$watchCollection('automaton', function () {
                $scope.states = [];
                for (var i = 0; i < dfa.states.length; i++) {
                    var tmpState = dfa.states[i];
                    var tmpObject = {};
                    tmpObject.id = tmpState.id;
                    tmpObject.name = tmpState.name;
                    tmpObject.trans = [];
                    //
                    for (var alphabetCounter = 0; alphabetCounter < dfa.alphabet.length; alphabetCounter++) {
                        var tmpTransitionName = dfa.alphabet[alphabetCounter];
                        var foundedTransition = null;
                        for (var transitionCounter = 0; transitionCounter < dfa.transitions.length; transitionCounter++) {
                            var tmpTransition = dfa.transitions[transitionCounter];
                            if (tmpTransition.fromState === tmpState.id && tmpTransition.name === tmpTransitionName) {
                                foundedTransition = tmpTransition;
                            }
                        }
                        var trans = {};
                        trans.alphabet = tmpTransitionName;
                        if (foundedTransition !== null) {
                            var tmpToState = $scope.$parent.getStateById(foundedTransition.toState);
                            trans.State = tmpToState.name;
                        } else {
                            trans.State = "";
                        }
                        tmpObject.trans.push(trans);
                    }
                    $scope.states.push(tmpObject);
                }
            });
        },
        templateUrl: 'templates/automatontable.html'
    };
});



//Language Controller
autoSim.controller("LangCtrl", ['$scope', '$translate', function ($scope, $translate) {
    $scope.changeLang = function (key) {
        $translate.use(key).then(function (key) {
            console.log("Sprache zu " + key + " gewechselt.");
        }, function (key) {
            console.log("Irgendwas lief schief.");
        });
    };
}]);


autoSim.directive("importautomaton",function(){
    
});

autoSim.directive("exportautomaton",function(){
    
});
