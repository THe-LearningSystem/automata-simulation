"use strict";
var dbug = function($scope) {
	var self = this;

    self.debugDanger = function(Msg) {
    	$scope.alertDanger = Msg;
    	console.log(Msg);

    }
}
