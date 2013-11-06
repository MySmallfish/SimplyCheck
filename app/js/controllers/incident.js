(function (S, SL) {

    SL.IncidentController = function ($scope, $routeParams, incidentsService, camera, attachmentsManager) {
        if ($routeParams.id) {
            $scope.id = parseInt($routeParams.id, 10);
        } else {
            $scope.categoryId = parseInt($routeParams.categoryId, 10);
            $scope.checkoutId = parseInt($routeParams.checkoutId, 10);
        }

        $scope.save = function () {
            location.href = "#/Checkout/1";
        };

        $scope.saveAndNew = function () {
            location.href = "#/Incident/1/1";
        };
        var severities;
        $scope.severities = incidentsService.getSeverities().then(function (items) {
            severities = items;
            return items;
        });

        $scope.selectSeverity = function (id) {
            if (severities && $scope.incident) {
                var severity = _.find(severities, function (item) {
                    return item.Id == id;
                });
                $scope.incident.Severity = severity;
            }
        };
        
        $scope.targets = incidentsService.getHandlingTargets();
        var incidentDetails;
        if ($scope.id) {
            incidentDetails = incidentsService.getIncidentDetails($scope.id);
        } else {
            incidentDetails = incidentsService.getNewIncidentDetails($scope.checkoutId, $scope.categoryId);
        }

        incidentDetails.then(function (details) {
            $scope.incident = details;
        });

        function acceptAttachment(uri) {
            if ($scope.incident) {
                if (!$scope.incident.Attachments) {
                    $scope.incident.Attachments = [];
                }
                $scope.incident.Attachments.push({ Index: $scope.incident.Attachments.length, Url: uri });

                $scope.$apply();
            }
            return uri;
        }

        function notifyAttachmentError(error) {

        }

        $scope.addFromCamera = function () {
            if (camera.isAvailable() && $scope.incident) {
                attachmentsManager.add(camera.takePicture()).then(acceptAttachment, notifyAttachmentError);
            }
        };
        $scope.addFromLibrary = function () {
            if (camera.isAvailable() && $scope.incident) {
                attachmentsManager.add(camera.takeFromLibrary()).then(acceptAttachment, notifyAttachmentError);
            }
        };

    };

})(Simple, SimplyLog);