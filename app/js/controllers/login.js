(function(S, SL) {
    SL.LoginController = function($q, $scope, loginManager,camera, fileManager, fileUtils) {
        $scope.Username = "mysmallfish@gmail.com";
        $scope.Password = "1234";
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