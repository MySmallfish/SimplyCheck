(function (S, SL) {

    SL.IncidentController = function ($scope, $routeParams, incidentsService, camera, attachmentsManager) {
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
            uri = uri.toURL();
            var incidentDetails = {
                Id: 1,
                collapsed: true,
                Severity: {
                    Id: 1,
                    Name: "2",
                    Color: "#FF0000"
                },
                DueDate: new Date(),
                Description: "תקלה",
                Remarks: "פעולה",
                HandlingTarget: {
                    Id: 1,
                    Name: "מחלקת התברואה"
                },
                Attachments: [
                    { Index: 1, Url: uri },
                    { Index: 2, Url: "https://bt.ylm.co.il/Download.ashx?p=Attachments/Event/386/image[72ec29c9-ff32-4762-96d8-4180d1806663].jpg" },
                    { Index: 3, Url: "https://bt.ylm.co.il/Download.ashx?p=Attachments/Event/386/image[72ec29c9-ff32-4762-96d8-4180d1806663].jpg" },
                    { Index: 4, Url: "https://bt.ylm.co.il/Download.ashx?p=Attachments/Event/386/image[72ec29c9-ff32-4762-96d8-4180d1806663].jpg" }
                ]
            };
            $scope.incident = incidentDetails;
            $scope.$apply();
        }

        function notifyAttachmentError(error) {

        }

        $scope.addFromCamera = function () {
            attachmentsManager.add(camera.takePicture()).then(acceptAttachment, notifyAttachmentError);
        };
        $scope.addFromLibrary = function () {
            attachmentsManager.add(camera.takeFromLibrary()).then(acceptAttachment, notifyAttachmentError);
        };

    };

})(Simple, SimplyLog);