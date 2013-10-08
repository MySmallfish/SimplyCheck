(function (S, SL) {

    SL.IncidentController = function ($scope, $routeParams, incidentsService) {
        $scope.id = parseInt($routeParams.id, 10);


        $scope.save = function() {
            location.href = "#/Checkout/1";
        };

        $scope.saveAndNew = function() {
            location.href = "#/Incident/1/1";
        };

        $scope.severities = incidentsService.getSeverities();
        
        $scope.targets = incidentsService.getHandlingTargets();

        $scope.incident = incidentsService.getIncidentDetails($scope.id);
    };

})(Simple, SimplyLog);