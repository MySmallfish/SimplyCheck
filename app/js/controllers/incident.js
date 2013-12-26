(function (S, SL) {

    SL.IncidentController = function ($q, $scope, $routeParams, $route, incidentsService, checkoutService, camera, attachmentsManager, textResource, navigate) {
        $scope.categoryId = parseInt($routeParams.categoryId, 10);
        $scope.checkoutId = $routeParams.checkoutId;

        if ($routeParams.uniqueId) {
            $scope.uniqueId = $routeParams.uniqueId;

            $scope.changeHeader(textResource.get("EditIncident"));
        } else {
            $scope.changeHeader(textResource.get("NewIncident"));
        }

        function saveIncident() {
            return incidentsService.save($scope.incident);
        }
        $scope.save = function () {
            if ($scope.loaded && $scope.incident) {

                saveIncident().then(function () {
                    navigate.checkout($scope.checkoutId, $scope.categoryId);
                });
            }
        };

        $scope.saveAndNew = function () {
            if ($scope.loaded && $scope.incident) {
                saveIncident().then(function () {
                    if ($scope.incident.Id == 0) {
                        $route.reload();
                    } else {
                        navigate.newIncident($scope.checkoutId, $scope.categoryId);
                    }

                });
            }
        };

        function setDefaultSeverity() {
            if ($scope.incident && !$scope.incident.Severity && severities) {
                $scope.incident.Severity = severities[severities.length - 1];
            }
        }


        var severities;
        incidentsService.getSeverities().then(function (items) {
            severities = items;
            $scope.severities = severities;
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

        incidentsService.getHandlingTargets().then(function (targets) {
            $scope.targets = targets;
        });

        var incidentDetails;
        if ($scope.uniqueId) {
            incidentDetails = incidentsService.getIncidentDetails($scope.checkoutId, $scope.uniqueId);
        } else {
            var loadedCheckout = checkoutService.getCheckoutById($scope.checkoutId);
            incidentDetails = incidentsService.getNewIncidentDetails(loadedCheckout, $scope.categoryId);
        }

        $scope.loaded = false;

        incidentDetails.then(function (details) {
            $scope.incident = details;
            $scope.loaded = true;
            /*$scope.incident.Attachments = [
                {
                    Url: "data:image/jpeg;base64,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"
                }];*/
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

        $scope.deleteAttachment = function (attachment) {

            console.log("DELE", attachment);
        };

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