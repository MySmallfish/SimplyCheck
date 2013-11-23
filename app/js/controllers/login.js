(function(S, SL) {
    SL.LoginController = function ($q, $scope, loginManager, queueManager, network, networkManager, $log, textResource, incidentsService, utils, $filter) {
        $scope.changeHeader(textResource.get("SimplyCheck"));
        $scope.Username = "mysmallfish@gmail.com";
        $scope.Password = "1234";


        function navigate() {
            location.href = "#/";
        }

        loginManager.isUserLoggedIn().then(function() {
            navigate();
        });

        $scope.networkStatus = "Unknown";
        function updateNetworkStatus() {
            $scope.networkStatus = network.isOnline() ? "Online" : "Offline";
        }
        $scope.$on("Simple.NetworkStatusChanged", function (args) {
            updateNetworkStatus();
        });


        updateNetworkStatus();
        $scope.login = function () {

            //var incident = {
            //    Id: 0,
            //    Severity: {
            //        Id: 1,
            //        Name: "1"
            //    },
            //    StartTime: new Date(),
            //    ParentEventId:388,
            //    UniqueId: utils.guid.create(),
            //    Description: "תקלה רצינית",
            //    DueTime: new Date(),
            //    Remarks: "Remarks",
            //    LocationId: 5,
            //    LocationType: "Site",
            //    Category: {
            //        Id: 17,
            //        Name: "Some Category"
            //    }
            //}
            //incidentsService.sendIncident(incident)
            //return;

            $scope.$emit("progress-started");
            var authResult = loginManager.authenticate($scope.Username, $scope.Password);
            function loginUser(user) {
                loginManager.login(user).then(navigate);
            }

            function authenticationFailed(error) {
                $scope.loginError = "AuthenticationFailed";
            }

            authResult.then(loginUser, authenticationFailed).finally(function () {
                $scope.$emit("progress-completed");
            });

        };
    };
})(Simple, SimplyLog);