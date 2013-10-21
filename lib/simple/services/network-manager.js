(function (S) {

    S.NetworkManager = function ($q,$rootScope, network) {
        var queuePromise, start = $q.defer();

        function initQ() {
            console.log("ONLINE", network.isOnline());
            if (network.isOnline()) {
                start.resolve();
            } else {
                start = $q.defer();
            }

            queuePromise = start.promise;
        }

        function runOnline(func) {
            console.log("ROL");
            queuePromise = queuePromise.then(func);
        }

        $rootScope.$on("Simple.NetworkStatusChanged", function () {
            initQ();
        });

        initQ();

        return {
            runOnline: runOnline
        };
    };

})(Simple);