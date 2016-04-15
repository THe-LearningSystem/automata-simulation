angular
    .module('automata-simulation')
    .controller('DFACtrl', DFACtrl);


function DFACtrl($scope, hotkeys) {
    console.log("created DFA");
    var dfa = new DFA($scope);


    $scope.scrollConfig = {
        autoHideScrollbar: false,
        theme: 'dark-thick',
        advanced: {
            updateOnContentResize: true
        },
        setHeight: 220,
        scrollInertia: 0
    };
    //HOTKEY
    hotkeys.add({
        combo: 'ctrl+q',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        description: 'Create a new state.',
        callback: function () {
            $scope.graphdesigner.addState();
        }
    });
    hotkeys.add({
        combo: 'ctrl+e',
        description: 'Create transition',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        callback: function () {
            $scope.graphdesigner.addTransition();
        }
    });
    $scope.openCheatSheet = function () {
        console.log("open cheatsheet");
        hotkeys.toggleCheatSheet()();
    };



    //INTRO
    $scope.intro = {};
    $scope.intro.Active = false;
    $scope.intro.Start = function () {
        console.log("startIntro");
        $scope.intro.Active = true;
    };

    $scope.intro.Finish = function () {
        console.log("introFinish");
    };

    $scope.intro.Skip = function () {
        console.log("introskip");
    };

    $scope.intro.Config = [
        {
            type: "title",
            heading: "This is a demo",
            text: 'This is a Demo Text!<em>This can have custom html too !!!</em></span>'

            }, {
            type: "title",
            heading: "Next Demo Page",
            text: 'And Content.'

            }
        ];
}