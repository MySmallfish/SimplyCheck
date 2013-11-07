(function (S, SL) {

    SL.IncidentController = function ($q, $scope, $routeParams, incidentsService, camera, attachmentsManager, textResource, navigate) {
        $scope.categoryId = parseInt($routeParams.categoryId, 10);
        $scope.checkoutId = parseInt($routeParams.checkoutId, 10);

        if ($routeParams.id) {
            $scope.id = parseInt($routeParams.id, 10);
            $scope.changeHeader(textResource.get("NewIncident"));
        } else {
            $scope.changeHeader(textResource.get("EditIncident"));
        }

        function saveIncident() {
            console.log("INCIDENt", $scope.incident);
            return incidentsService.save($scope.incident);
            
            var result = $q.defer();

            result.resolve();

            return result.promise;
        }
        $scope.save = function () {
            if ($scope.incident) {
                saveIncident().then(function () {
                    navigate.back();
                });
            }
        };

        $scope.saveAndNew = function () {
            if ($scope.incident) {
                saveIncident().then(function () {
                    navigate.newIncident($scope.checkoutId, $scope.categoryId);
                });
            }
        };

        function setDefaultSeverity() {
            if ($scope.incident && !$scope.incident.Severity && severities) {
                $scope.incident.Severity = severities[severities.length - 1];
            }
        }


        var severities;
        $scope.severities = incidentsService.getSeverities().then(function (items) {
            severities = items;
            setDefaultSeverity();
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
            setDefaultSeverity();
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