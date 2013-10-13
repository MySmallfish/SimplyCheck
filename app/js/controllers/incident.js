(function (S, SL) {

    SL.IncidentController = function ($scope, $routeParams, incidentsService, camera) {
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
        $scope.incident.Attachments = [];
        
        function acceptAttachment(uri) {
            
            $scope.incident.Attachments.push(uri);
            $scope.$apply();
        }

        function notifyAttachmentError(error) {

        }

        $scope.addFromCamera = function () {
            camera.takePicture().then(acceptAttachment, notifyAttachmentError);
        };
        $scope.addFromLibrary = function () {
            camera.takeFromLibrary().then(acceptAttachment, notifyAttachmentError);
        };

    };

})(Simple, SimplyLog);