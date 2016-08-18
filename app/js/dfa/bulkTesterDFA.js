//This components is used for bulkTesting words
function BulkTesterDFA($scope) {
    var self = this;

    //add to pdaListeners
    $scope.updateListeners.push(self);
    self.acceptedInput = [];
    self.rejectedInput = [];

    /**
     * executes the bulkTest
     */
    self.bulkTest = function () {
        self.testAcceptedInput();
        self.testRejectedInput();

    };
    /**
     * prepares the acceptedInput
     */
    self.testAcceptedInput = function () {
        self.acceptedInput = [];
        var acceptedInputString = document.getElementById("acceptedInput").value;
        var acceptedInputArray = acceptedInputString.split("\n");

        _.forEach(acceptedInputArray, function (acceptedWord) {
            if (acceptedWord !== "") {
                var tmpObj = {};
                tmpObj.word = acceptedWord;
                tmpObj.accepted = $scope.simulator.isInputWordAccepted(acceptedWord);
                self.acceptedInput.push(tmpObj);
            }
        })
    };
    /**
     * prepares the rejectedInput
     */
    self.testRejectedInput = function () {
        self.rejectedInput = [];
        var rejectedInputString = document.getElementById("rejectedInput").value;
        var rejectedInputArray = rejectedInputString.split("\n");

        _.forEach(rejectedInputArray, function (rejectedWord) {
            if (rejectedWord !== "") {
                var tmpObj = {};
                tmpObj.word = rejectedWord;
                tmpObj.rejected = !$scope.simulator.isInputWordAccepted(rejectedWord);
                self.rejectedInput.push(tmpObj);
            }
        })
    };
    /**
     * updateFunction for the Listener
     */
    self.updateFunction = function () {
        self.bulkTest();
    }


}