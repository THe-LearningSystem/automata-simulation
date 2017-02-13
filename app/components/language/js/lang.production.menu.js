autoSim.ProductionMenu = function ($scope) {
    var self = this;

    console.log("langProductionMenu");
    
    self.edit = {};
    self.edit.isOpen = false;
    self.edit.state = null;
    self.edit.watcher = [];

    self.edit.openHandler = function () {
        event.preventDefault();
        $scope.productions.menu.edit.open($scope.productions.getById(parseInt(d3.select(this).attr("object-id"))));
    };

    self.edit.open = function (production) {
        $scope.core.closeMenus();
        if (d3.event !== null && d3.event.stopPropagation !== undefined)
            d3.event.stopPropagation();
        $scope.productions.selected = production;
        self.edit.production = _.cloneDeep(production);

        self.edit.watcher.push($scope.$watch('productions.menu.edit.production.id', function (newValue, oldValue) {
            if (newValue !== oldValue) {
                if (newValue !== "" && newValue != undefined ) {
                    !$scope.productions.rename($scope.productions.selected, newValue);
                }
            }
        }));
        self.edit.isOpen = true;

        $scope.saveApply();
    };

    self.edit.close = function () {
        _.forEach(self.edit.watcher, function (value) {
            value();
        });
        self.edit.watcher = [];
        self.edit.production = null;
        $scope.productions.selected = null;
        self.edit.isOpen = false;
        $scope.saveApply();
    };

    self.context = {};
    self.context.isOpen = false;
    self.context.position = {};

    self.context.openHandler = function () {
        self.edit.close();
        event.preventDefault();
        self.context.open($scope.productions.getById(parseInt(d3.select(this).attr("object-id"))));

    };

    self.context.open = function (production) {
        $scope.core.closeMenus();
        if (d3.event !== null && d3.event.stopPropagation !== undefined)
            d3.event.stopPropagation();

        $scope.productions.selected = production;
        self.context.position.x = event.layerX;
        self.context.position.y = event.layerY;
        self.context.isOpen = true;
        $scope.saveApply();
    };

    self.context.close = function (dontRemoveSelectedState) {
        self.context.position = {};
        if (dontRemoveSelectedState !== true)
            $scope.productions.selected = null;
        self.context.isOpen = false;
        $scope.saveApply();
    };


    self.close = function () {
        self.context.close();
        self.edit.close();
    };

    self.isOpen = function () {
        return self.edit.isOpen || self.context.isOpen;
    }
};