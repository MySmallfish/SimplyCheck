(function (S) {
    S.LoginManager = ["storageService", "$q", "azureActiveDirectory", function (storageService, $q, azureActiveDirectory) {


        function authenticate(userName, password) {
            //var user = {
            //    userName: userName,
            //    name: "יאיר כהן",
            //    url: "https://bt.ylm.co.il",
            //    appDisplayName: "בטיחות הדגמה"
            //};

            return azureActiveDirectory.authenticate(userName, password).then(function (auth) {
                return auth;
            });
        }

        function sessionInfo(value) {
            return storageService.prefix("SimplyLog").session("User", value);
        }

        var currentUser;
        function login(user) {
            var result = sessionInfo(user).then(function () {
                currentUser = user;
            });

            return result;
        }

        function isValidToken(user) {
            return true;
            //var now = new Date();
            //return now < moment(token.expiredAt).add("d", 5);
        }

        function logout() {
            currentUser = null;
            return sessionInfo(null);
        }

        function isUserLoggedIn() {
            var result = $q.defer();
            if (currentUser) {
                result.resolve();
            } else {
                var userInfo = sessionInfo().then(function (info) {
                    if (info) {
                        if (isValidToken(info)) {
                            currentUser = info;
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

        function getAccessToken() {
            return sessionInfo().then(function (user) {
                return user.token.access_token;
            });
        }

        return {
            getAccessToken: getAccessToken,
            isUserLoggedIn: isUserLoggedIn,
            login: login,
            logout: logout,
            authenticate: authenticate
        };
    }];
})(Simple);