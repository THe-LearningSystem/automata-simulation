app/js/controllers/app.js
// Declare app level module which depends on views, and components
var autoSim = angular.module('automata-simulation', ['ngRoute', 'ui.bootstrap', 'pascalprecht.translate', 'jsonFormatter', 'rzModule', 'cfp.hotkeys']).config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.when('/dfa', {
            templateUrl: 'view/dfa.html',
            controller: 'DFACtrl'
        });
        $routeProvider.when('/dta', {
            templateUrl: 'view/dta.html',
            controller: 'DTACtrl'
        });
        $routeProvider.when('/pda', {
            templateUrl: 'view/pda.html',
            controller: 'PDACtrl'
        });
        $routeProvider.when('/nfa', {
            templateUrl: 'view/nfa.html',
            controller: 'NFACtrl'
        });
        $routeProvider.otherwise({
            redirectTo: '/dfa'
        });

    }]).config(['$translateProvider',
    function ($translateProvider) {
        //translation
        $translateProvider.useStaticFilesLoader({
            prefix: 'translations/lang-',
            suffix: '.json'
        });
        // Enable escaping of HTML
        $translateProvider.useSanitizeValueStrategy('escape');

        $translateProvider.preferredLanguage('de_DE');
    }]);

//Language Controller
autoSim.controller("LangCtrl", ['$scope', '$translate',
    function ($scope, $translate) {
        $scope.changeLang = function (key) {
            $translate.use(key).then(function (key) {
                $scope.getCurrentLanguage();
            }, function (key) {
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

//from: http://stackoverflow.com/questions/19415394/with-ng-bind-html-unsafe-removed-how-do-i-inject-html
autoSim.filter('to_trusted', ['$sce',
    function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }]);
//create nameSpace
window.autoSim = window.autoSim || {};

// Declare app level module which depends on views, and components
var autoSim = angular.module('automata-simulation', ['ngRoute', 'ui.bootstrap', 'pascalprecht.translate', 'jsonFormatter', 'rzModule', 'cfp.hotkeys']).config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.when('/dfa', {
            templateUrl: 'components/automata/dfa/views/dfa.html',
            controller: 'DFAController'
        });
        $routeProvider.when('/dta', {
          templateUrl: 'components/automata/dta/views/dta.html',
          controller: 'DTAController'
        });
        $routeProvider.when('/nfa', {
            templateUrl: 'components/automata/nfa/views/nfa.html',
            controller: 'NFAController'
        });
        $routeProvider.when('/pda', {
            templateUrl: 'components/automata/pda/views/pda.html',
            controller: 'PDAController'
        });
        $routeProvider.when('/npda', {
            templateUrl: 'components/automata/npda/views/npda.html',
            controller: 'NPDAController'
        });

        $routeProvider.otherwise({
            redirectTo: '/dfa'
        });

    }]).config(['$translateProvider',
    function ($translateProvider) {
        //translation
        $translateProvider.useStaticFilesLoader({
            prefix: 'translations/lang-',
            suffix: '.json'
        });
        // Enable escaping of HTML
        $translateProvider.useSanitizeValueStrategy('escape');

        $translateProvider.preferredLanguage('de_DE');
    }]);

//Language Controller
autoSim.controller("LangCtrl", ['$scope', '$translate',
    function ($scope, $translate) {
        $scope.changeLang = function (key) {
            $translate.use(key).then(function (key) {
                $scope.getCurrentLanguage();
            }, function (key) {
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

//from: http://stackoverflow.com/questions/19415394/with-ng-bind-html-unsafe-removed-how-do-i-inject-html
autoSim.filter('to_trusted', ['$sce',
    function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }]);
autoSim.filter('ifEmpty', function () {
    return function (input, defaultValue) {
        if (angular.isUndefined(input) || input === null || input === '') {
            return defaultValue;
        }

        return input;
    }
});
autoSim.filter('orderObjectBy', function () {
    return function (input, attribute) {
        if (!angular.isObject(input)) return input;

        var array = [];
        for (var objectKey in input) {
            array.push(input[objectKey]);
        }

        array.sort(function (a, b) {
            a = parseInt(a[attribute]);
            b = parseInt(b[attribute]);
            return a - b;
        });
        return array;
    }
});
