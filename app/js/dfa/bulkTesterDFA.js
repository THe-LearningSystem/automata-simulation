//This components is used for bulkTesting words
function BulkTesterDFA($scope) {
    var self = this;
    self.acceptedInput = [];
    self.rejectedInput = [];

    self.bulkTest = function () {
        self.acceptedInput = [];
        self.rejectedInput = [];
        console.log("starting bulkTest");
        self.testAcceptedInput();

        self.testRejectedInput();

    };
    self.testAcceptedInput = function () {
        var acceptedInputString = document.getElementById("acceptedInput").value;
        var acceptedInputArray = acceptedInputString.split("\n");

        _.forEach(acceptedInputArray, function (acceptedWord) {
            if (acceptedWord !== "") {
                var tmpObj = {};
                tmpObj.word = acceptedWord;
                tmpObj.accepted = $scope.simulator.isInputWordAccepted(acceptedWord);
                console.log();
                self.acceptedInput.push(tmpObj);
            }
        })
    };

    self.testRejectedInput = function () {
        var rejectedInputString = document.getElementById("rejectedInput").value;
        var rejectedInputArray = rejectedInputString.split("\n");

        _.forEach(rejectedInputArray, function (rejectedWord) {
            if (rejectedWord !== "") {
                var tmpObj = {};
                tmpObj.word = rejectedWord;
                tmpObj.rejected = !$scope.simulator.isInputWordAccepted(rejectedWord);
                console.log();
                self.rejectedInput.push(tmpObj);
            }
        })
    };


}