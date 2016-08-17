//This components is used for bulkTesting words
function BulkTesterDFA($scope) {
    var self = this;

    self.bulkTest = function () {
        console.log("starting bulkTest");
        self.testAcceptedInput();

        self.testRejectedInput();

    };

    self.testAcceptedInput = function () {
        var acceptedInputString = document.getElementById("acceptedInput").value;
        var acceptedInputArray = acceptedInputString.split("\n");

        _.forEach(acceptedInputArray, function (acceptedWord) {
            console.log($scope.simulator.isInputWordAccepted(acceptedWord));
        })
    };

    self.testRejectedInput = function () {
        var rejectedInputString = document.getElementById("rejectedInput").value;
        var rejectedInputArray = rejectedInputString.split("\n");

        _.forEach(rejectedInputArray, function (rejectedWord) {

        })
    };


}