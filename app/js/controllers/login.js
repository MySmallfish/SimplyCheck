(function(S, SL) {
    SL.LoginController = function($q, $scope, loginManager, queueManager) {
        $scope.Username = "mysmallfish@gmail.com";
        $scope.Password = "1234";
        function navigate() {
            location.href = "#/";
        }

        loginManager.isUserLoggedIn().then(function() {
            navigate();
        });

        $scope.login = function () {

            var q = queueManager.get({
                name: "test",
                processItemAction: function(item) {
                    console.log("processing...", item);
                    return $q.when(item).then(function(i) {
                        console.log("ITEM: ", i);
                    });
                }
            });
            //q.run();
            q.push(1);
            q.push(2);
            q.push(3);
            q.push(4);
            q.run();
            q.push(5);
            q.push(6);
            q.run();
            
            
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