(function(S, SL) {
    SL.LoginController = function($scope, loginManager,camera, fileManager, fileUtils) {

        function navigate() {
            location.href = "#/";
        }

        loginManager.isUserLoggedIn().then(function() {
            navigate();
        });

        $scope.login = function () {
            
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