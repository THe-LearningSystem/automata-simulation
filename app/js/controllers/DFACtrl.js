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

}