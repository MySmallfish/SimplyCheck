(function(S, SL) {
    SL.LoginManager = function(storageService, $q, zumoClient) {
        
        function authenticate(userName, password){
            var result = $q.defer();
            var users = zumoClient.getTable("Users");

            users.insert({
                userName: userName,
                password: password
            }).then(function(userInfo) {
                result.resolve(userInfo);
            }, function(error) {
                result.reject(error);
            });

            return result.promise;
        }
        
        function sessionInfo(value){
            return storageService.prefix("SimplyLog").session("User", value);
        }
        function login(user) {
            var result = sessionInfo(user).then(function () {
                zumoClient.currentUser = user;
            });
           
           return result;
        }
        
        function isValidToken(user) {
            return true;
            //var now = new Date();
            //return now < moment(token.expiredAt).add("d", 5);
        }

        function logout() {
            zumoClient.currentUser = null;
            return sessionInfo(null);
        }

        function isUserLoggedIn(){
            var result = $q.defer();
            if (zumoClient.currentUser) {
                result.resolve();
            } else {
                var userInfo = sessionInfo().then(function (info) {
                    if (info) {
                        if (isValidToken(info)) {
                            zumoClient.currentUser = info;
                            result.resolve();
                        } else {
                            result.reject();
                        }
                    } else {
                        result.reject();
                    }
                });
            }
            return result.promise;
        }

        
        return {
            isUserLoggedIn: isUserLoggedIn,
            login: login,
            logout: logout,
            authenticate: authenticate
        };
    };
})(Simple, SimplyLog);