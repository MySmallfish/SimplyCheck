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
            ]
        };
        function acceptAttachment(uri) {
            console.log("ACCEPTING: ", uri);

            incidentDetails.Attachments.push({ Index: incidentDetails.Attachments.length, Url: uri });
 
            $scope.incident = incidentDetails;
            $scope.$apply();

            return file;
        }

        function notifyAttachmentError(error) {

        }

        $scope.addFromCamera = function () {
            if (camera.isAvailable()) { 
                attachmentsManager.add(camera.takePicture()).then(acceptAttachment, notifyAttachmentError);
            }
        };
        $scope.addFromLibrary = function () {
            if (camera.isAvailable()) {
                attachmentsManager.add(camera.takeFromLibrary()).then(acceptAttachment, notifyAttachmentError);
            }
        };

    };

})(Simple, SimplyLog);