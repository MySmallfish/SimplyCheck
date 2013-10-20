(function (S) {

    S.NetworkService = function ($rootScope, $window) {
        function isOnline() {
            return navigator.onLine;
        }

        function onNetworkStatusChanged() {
            $rootScope.$broadcast("Simple.NetworkStatusChanged", { online: isOnline() });
        }

        $window.addEventListener("offline", function () {
            $rootScope.$apply(function () {
                onNetworkStatusChanged();
            });
        }, false);
        $window.addEventListener("online", function () {
            $rootScope.$apply(function () {
                onNetworkStatusChanged();
            });
        }, false);

        return {
            isOnline: isOnline
        };

    };

})(Simple);