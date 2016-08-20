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
        self.testAcceptedInputs();
        self.testRejectedInputs();
        self.testRegularExpressions();

    };
    /**
     * prepares the acceptedInput
     */
    self.testAcceptedInputs = function () {
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
    self.testRejectedInputs = function () {
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
     * tests the regular Expression
     */
    self.testRegularExpressions = function () {
        self.regularExpression = [];
        var regularExpressionString = document.getElementById("regularExpression").value;
        var regularExpressionArray = regularExpressionString.split("\n");

        _.forEach(regularExpressionArray, function (regularExpression) {
            if (regularExpression !== "") {
                var tmpObj = {};
                tmpObj.word = regularExpression;
                var bool = true;
                for (var i = 1; i < 100; i++) {
                    bool = $scope.simulator.isInputWordAccepted(self.fillRegularExpressionPower(regularExpression, i));
                    if (bool == false) {
                        break;
                    }
                }
                tmpObj.accepted = bool;
                self.regularExpression.push(tmpObj);
            }


        });
    };

    self.fillRegularExpressionPower = function (string, value) {

        while (string.indexOf('^n') !== -1) {
            var position = string.indexOf('^n') - 1;
            var tmpChar = string[position];
            for (var i = 0; i < value; i++) {
                string = [string.slice(0, position), tmpChar, string.slice(position)].join('');
            }
            string = string.replace(tmpChar, "");
            string = string.replace('^n', "");
        }
        return string;
    }

    /**
     * updateFunction for the Listener
     */
    self.updateFunction = function () {
        self.bulkTest();
    }


}