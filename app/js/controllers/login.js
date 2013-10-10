(function(S, SL) {
    SL.LoginController = function($scope, loginManager, camera) {

        function navigate() {
            location.href = "#/";
        }

        loginManager.isUserLoggedIn().then(function() {
            navigate();
        });

        $scope.loginError = "cam";

        $scope.login = function () {
            camera.takePicture().then(function (uri) {
                $scope.loginError = uri;
            }, function(error) {
                $scope.loginError = JSON.stringify(error);
            });
            //camera.takeFromLibrary().then(function (uri) {
            //    $scope.loginError = uri;
            //}, function (error) {
            //    $scope.loginError = JSON.stringify(error);
            //});
            return;
            var authResult = loginManager.authenticate($scope.Username, $scope.Password);

            function loginUser(user) {
                loginManager.login(user).then(navigate);
            }

            function authenticationFailed(error) {
                $scope.loginError = "AuthenticationFailed";
            }

            authResult.then(loginUser, authenticationFailed);

        };
    };
})(Simple, SimplyLog);