angular
    .module('automata-simulation')
    .controller('DFACtrl', DFACtrl);


function DFACtrl($scope) {
    console.log("created DFA");
    var dfa = new DFA($scope);


    $scope.scrollConfig = {
        autoHideScrollbar: false,
        theme: 'dark-2',
        advanced: {
            updateOnContentResize: true
        },
        setHeight: 220,
        scrollInertia: 0
    };

}