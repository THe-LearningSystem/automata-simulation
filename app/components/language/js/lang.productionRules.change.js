autoSim.LangProductionRulesChange = function ($scope) {
    var self = this;
    
    self.beginInput = false;
    self.checkUpdateLeft = true;
    self.checkUpdateRight = true;
    self.showStartRuleDropdown = false;

    /**
     * Adds the epsilon to the right side of a production rule.
     */
    self.addEpsilonToRightSide = function (id, edit) {

        if (edit) {
            $scope.langProductionRules.getByRuleId(id).right = "ε";

        } else {
            $scope.langProductionRules.menuRight = "ε";
        }
        $scope.langCore.langUpdateListener();

        /* Only for inserting the epsilon to a specific position.
        var startPosition = myElement.selectionStart;
        var endPosition = myElement.selectionEnd;

        // Check if you've selected text
        if (startPosition == endPosition) {
            alert("The position of the cursor is (" + startPosition + "/" + myElement.value.length + ")");
        } else {
            alert("Selected text from (" + startPosition + " to " + endPosition + " of " + myElement.value.length + ")");
        }
        */
    };

    /**
     * For checking, that the rule is a type 3 rule and holds the conventions.
     * @param   {[[Type]]} left  [[Description]]
     * @param   {[[Type]]} right [[Description]]
     * @returns {boolean}  [[Description]]
     */
    self.noErrorsInInput = function (left, right) {
        var leftLetter = false;
        var rightLetter = false;

        if (self.checkLeftForLetter(left)) {
            leftLetter = true;
        }

        if (self.checkRightForLetter(right)) {
            rightLetter = true;

        }

        if (leftLetter && rightLetter && !self.beginInput) {
            return true;
        }

        if (self.beginInput) {
            self.beginInput = false;
        }

        return false;
    };
    
    /**
     * Updates the rule from the available rules.
     * @param {object} prod [[Description]]
     */
    self.updateRule = function (prod, left) {

        if (self.checkLeftForLetter(prod.left) && left) {
            self.checkUpdateLeft = true;

        } else if (left) {
            self.checkUpdateLeft = false;
        }  
        
        if (self.checkRightForLetter(prod.right) && !left) {
            self.checkUpdateRight = true;

        } else if (!left) {
            self.checkUpdateRight = false;
        }

        if (self.checkUpdateLeft, self.checkUpdateRight) {
            $scope.langCore.langUpdateListener();
        }
    };
    
    /**
     * Checks the left value of a production rule, for only letters.
     * @param   {[[Type]]} string [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.checkLeftForLetter = function (string) {

        if (string !== undefined) {

            return /^[A-Z]/.test(string);
            
        } else {
            self.beginInput = true;
            
            return true;
        }
    };

    /**
     * Checks the right value of a production rule, for only letters.
     * @param   {[[Type]]} string [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.checkRightForLetter = function (string) {

        if (string !== undefined) {
            
            if (string === 'ε') {
                
                return true;
            }

            if (string.length == 1) {

                return /[a-z]/.test(string);

            } else {

                return /[a-z][A-Z]/.test(string);
            }

        } else {
            self.beginInput = true;

            return true;
        }
    };
    
    /**
     * For showing of the start rule dropdown.
     */
    self.checkStartRuleDropdown = function () {
        
        if ($scope.langProductionRules.length > 0) {
            self.showStartRuleDropdown = true;
            
        } else {
            self.showStartRuleDropdown = false;
        }
    };
};
