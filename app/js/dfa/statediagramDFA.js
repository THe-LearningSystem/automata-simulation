//statediagram for the svg diagram
function StateDiagramDFA($scope, svgSelector) {
    "use strict";
    var self = this;
    self.svgSelector = svgSelector;
    self.selectedState = null;

    self.selectedTransition = null;


    self.isInitialized = false;

    //Create inner components
    new StateDiagramZoomAndClickHandlerDFA($scope, self);
    new StateDiagramDrawerDFA($scope, self);
    new StateDiagramMenuHandlerDFA($scope, self);


    /**
     * Initialise the statediagram
     */
    self.init = function () {
        console.log("init stateDiagram");

        self.svgOuter = self.createSvgOuterClickListeners();
        //add at the start
        self.addSvgOuterClickListener();
        //create svgGrid container
        self.svgGrid = self.svgOuter.append("g").attr("id", "grid");
        //create svgContainer this is gonna be moved and scaled
        self.svg = self.svgOuter.append("g").attr("id", "svg-items");
        //create svgTransitionContainer, the transitions are always above the states
        self.svgTransitions = self.svg.append("g").attr("id", "transitions");
        //create svgStateContainer
        self.svgStates = self.svg.append("g").attr("id", "states");


        self.createDefs();
        if (!$scope.debug) {
            self.updateWidthAndHeight();
            self.drawGrid();
        }

        self.isInitialized = true;
    };

    /**
     * create the defs
     */
    self.createDefs = function () {
        //DEFS
        self.defs = self.svg.append('svg:defs');
        //Marker-Arrow ( for the transitions)
        self.defs.append('svg:marker').attr('id', 'marker-end-arrow').attr('refX', 7.5).attr('refY', 3).attr('markerWidth', 10).attr('markerHeight', 10).attr('orient', 'auto').append('svg:path').attr('d', 'M0,0 L0,6 L9,3 z');
        self.defs.append('svg:marker').attr('id', 'marker-end-arrow-create').attr('refX', 7.5).attr('refY', 3).attr('markerWidth', 10).attr('markerHeight', 10).attr('orient', 'auto').append('svg:path').attr('d', 'M0,0 L0,6 L9,3 z');
        self.defs.append('svg:marker').attr('id', 'marker-end-arrow-animated').attr('refX', 7.5).attr('refY', 3).attr('markerWidth', 10).attr('markerHeight', 10).attr('orient', 'auto').append('svg:path').attr('d', 'M0,0 L0,6 L9,3 z');
        self.defs.append('svg:marker').attr('id', 'marker-end-arrow-hover').attr('refX', 7.5).attr('refY', 3).attr('markerWidth', 10).attr('markerHeight', 10).attr('orient', 'auto').append('svg:path').attr('d', 'M0,0 L0,6 L9,3 z');
        self.defs.append('svg:marker').attr('id', 'marker-end-arrow-selection').attr('refX', 4).attr('refY', 3).attr('markerWidth', 5).attr('markerHeight', 10).attr('orient', 'auto').append('svg:path').attr('d', 'M0,0 L0,6 L9,3 z');

    };

    /**
     * Reset all the AddListeners
     */
    self.resetAddActions = function () {
        self.closeStateMenu();
        self.closeTransitionMenu();
        self.svgOuter.on("click", null);
    };


    /**************
     **SIMULATION**
     *************/
    $scope.$watch('simulator.animated.currentState', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            if (oldValue !== null) {
                self.setStateClassAs(oldValue, false, "animated-currentstate-svg");
                self.setStateClassAs(oldValue, false, "animated-accepted-svg");
                self.setStateClassAs(oldValue, false, "animated-not-accepted-svg");
            }
            if (newValue !== null) {
                if ($scope.simulator.status === "accepted") {
                    self.setStateClassAs($scope.simulator.animated.currentState, true, "animated-accepted-svg");
                } else if ($scope.simulator.status === "not accepted") {
                    self.setStateClassAs($scope.simulator.animated.currentState, true, "animated-not-accepted-svg");
                } else {
                    self.setStateClassAs(newValue, true, "animated-currentstate-svg");
                }
            }
        }
    });

    $scope.$watch('simulator.animated.transition', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            if (oldValue !== null) {
                //noinspection JSUnresolvedVariable
                self.setTransitionClassAs(oldValue.id, false, "animated-transition");
            }
            if (newValue !== null) {
                //noinspection JSUnresolvedVariable
                self.setTransitionClassAs(newValue.id, true, "animated-transition");
            }
        }
    });
    $scope.$watch('simulator.animated.nextState', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            if (oldValue !== null) {
                self.setStateClassAs(oldValue, false, "animated-nextstate-svg");
            }
            if (newValue !== null) {
                self.setStateClassAs(newValue, true, "animated-nextstate-svg");
            }
        }
    });
    $scope.$watch('simulator.status', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            if ($scope.simulator.status === "accepted") {
                self.setStateClassAs($scope.simulator.animated.currentState, true, "animated-accepted-svg");
            } else if ($scope.simulator.status === "notAccepted") {
                self.setStateClassAs($scope.simulator.animated.currentState, true, "animated-not-accepted-svg");
            } else if ($scope.simulator.status === "unknown") {
                if ($scope.simulator.animated.currentState != null) {
                    self.setStateClassAs($scope.simulator.animated.currentState, false, "animated-accepted-svg");
                    self.setStateClassAs($scope.simulator.animated.currentState, false, "animated-not-accepted-svg");
                    self.setStateClassAs($scope.simulator.animated.currentState, true, "animated-currentState-svg");
                }
            }
        }
    });
}