(function (S) {

    S.NetworkService = function ($rootScope) {
        function isOnline() {
            return navigator.onLine;
        }

        function onNetworkStatusChanged() {
            $rootScope.$broadcast("Simple.NetworkStatusChanged", { online: isOnline() });
        }


        window.addEventListener("online", onNetworkStatusChanged);
        window.addEventListener("offline", onNetworkStatusChanged);

        return {
            isOnline: isOnline
        };

    };

})(Simple);