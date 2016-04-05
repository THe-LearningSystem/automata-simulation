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
            icon: '@',
            action: '&',
            tttext: '@'
        },
        template: '<button type="button" class="menu-button" ng-click="action()" aria-label="Left Align"  uib-tooltip="{{tttext | translate}}"><span class="icon icon-{{icon}}" aria-hidden="true"> </span> </button>'
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
            titlename: '@',
        },
        template: '<div class="menu-item"><p class="title" ng-click="extended=!extended"><span class="icon icon-triangle-bottom" aria-hidden="true" ng-show="extended"></span><span class="icon icon-triangle-right" aria-hidden="true" ng-show="!extended"></span>{{titlename | translate}}</p><div class="content" ng-transclude ng-show="extended"></div></div>'

    };

});
autoSim.directive("menuitem", function () {

    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            titlename: '@',
        },
        template: '<div class="menu-item"><p class="title">{{titlename | translate}}</p><div class="content" ng-transclude></div></div>'

    };

});




//Language Controller
autoSim.controller("LangCtrl", ['$scope', '$translate', function ($scope, $translate) {
    $scope.changeLang = function (key) {
        $translate.use(key).then(function (key) {
            console.log("Sprache zu " + key + " gewechselt.");
            $scope.getCurrentLanguage();
        }, function (key) {
            console.log("Irgendwas lief schief.");
        });
    };
    $scope.getCurrentLanguage = function () {
        var currentLanguage = $translate.proposedLanguage() || $translate.use();
        switch (currentLanguage) {
            case "de_DE":
                $scope.activeLanguage = '<span class="flag-icon flag-icon-de"></span> Deutsch';
                break;
            case "en_EN":
                $scope.activeLanguage = '<span class="flag-icon flag-icon-gb"></span> English';
                break;
        }
    };
    $scope.getCurrentLanguage();
}]);


autoSim.directive("importautomaton", function () {

});

autoSim.controller("portationCtrl", ['$scope', function ($scope) {
    $scope.export = function () {
        console.log("test");
        /**
         * Returns all transition without the objReference
         * @return {Array} array of transition objects
         */
        function getTransitions() {
            var allTransitions = [];
            _.forEach($scope.config.transitions, function (transition, key) {
                var tmpTransition = JSON.parse(JSON.stringify(transition));
                delete tmpTransition.objReference;
                allTransitions.push(tmpTransition);
            });
            return allTransitions;
        }

        /**
         * Returns all transition without the objReference
         * @return {Array} array of transition objects
         */
        function getStates() {
            var allStates = [];
            _.forEach($scope.config.states, function (state, key) {
                var tmpState = JSON.parse(JSON.stringify(state));
                delete tmpState.objReference;
                allStates.push(tmpState);
            });
            return allStates;
        }


        var exportData = {};
        exportData = $scope.config;
        exportData.transitions = getTransitions();
        exportData.states = getStates();
        var data = window.JSON.stringify(exportData);
        var blob = new Blob([data], {
            type: "text/plain;charset=utf-8;",
        });
        saveAs(blob, $scope.config.name + ".json");
    };

    $scope.import = function () {
        //Called when the user clicks on the import Button and opens the hidden-file-input

        angular.element('#hidden-file-upload').trigger('click');
        console.log($scope);
        //called when the user uploads a file



    };
}]);



//from: http://stackoverflow.com/questions/19415394/with-ng-bind-html-unsafe-removed-how-do-i-inject-html
autoSim.filter('to_trusted', ['$sce', function ($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    };
    }]);
