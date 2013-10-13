(function(S, SL) {
    SL.LoginController = function($scope, loginManager,camera, fileManager, fileUtils) {

        function navigate() {
            location.href = "#/";
        }

        loginManager.isUserLoggedIn().then(function() {
            navigate();
        });

        $scope.login = function () {
            if (camera.isAvailable()) {
                camera.takeFromLibrary().then(function(uri) {
                    $scope.loginError = uri;

                    fileManager.move(uri, "Attachments", fileUtils.uniqueFileName(uri)).then(function(file) {
                        $scope.loginError = "New File: " + file.toURL();
                    }, function(error) {
                        $scope.loginError = JSON.stringify(error);
                    });
                }, function(error) {
                    $scope.loginError = JSON.stringify(error);
                });
            }
            
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