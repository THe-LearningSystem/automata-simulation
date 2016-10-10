autoSim.hotkeysGenerator = function ($scope, hotkeys) {
    //HOTKEY
    hotkeys.add({
        combo: 'ctrl+q',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        description: 'Create state',
        callback: function (event) {
            event.preventDefault();
            $scope.statediagram.createState();
        }
    });
    hotkeys.add({
        combo: 'ctrl+e',
        description: 'Create transition',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        callback: function (event) {
            event.preventDefault();
            $scope.statediagram.createTransition();
        }
    });

    //Simulation
    hotkeys.add({
        combo: 'ctrl+1',
        description: 'Simulation: Play/Pause??',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        callback: function (event) {
            event.preventDefault();
            $scope.simulator.playOrPause();
        }
    });
    hotkeys.add({
        combo: 'ctrl+2',
        description: 'Simulation: Stop',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        callback: function (event) {
            event.preventDefault();
            $scope.simulator.stop();
        }
    });
    hotkeys.add({
        combo: 'ctrl+3',
        description: 'Simulation: Step Backwards',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        callback: function (event) {
            event.preventDefault();
            $scope.simulator.stepBackwardWrapper();
        }
    });
    hotkeys.add({
        combo: 'ctrl+4',
        description: 'Simulation: Step Forward',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        callback: function (event) {
            event.preventDefault();
            $scope.simulator.stepForwardWrapper();
        }
    });

    //create image
    hotkeys.add({
        combo: 'ctrl+p',
        description: 'Download Svg as Png',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        callback: function (event) {
            var scope = angular.element(document.getElementById("portationCtrl")).scope();
            event.preventDefault();
            scope.saveAsPng();
        }
    });
    //zoomFit
    hotkeys.add({
        combo: 'ctrl+x',
        description: 'ZoomFit Window',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        callback: function (event) {
            event.preventDefault();
            $scope.statediagram.zoomFitWindow();

        }
    });
    $scope.openCheatSheet = function () {
        console.log("open cheatsheet");
        hotkeys.toggleCheatSheet()();
    };
};