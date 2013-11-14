(function (S, SL) {
    
    SL.HomeController = function ($scope, checkoutService, loginManager, $location, textResource) {
        $scope.changeHeader(textResource.get("Checkouts"));
        $scope.orderBy = "header";

        function loadCheckouts() {
            $scope.$emit("progress-started");


            checkoutService.getCheckouts().then(function (items) {
                $scope.items = items;
            }).finally(function () {
                $scope.$emit("progress-completed");
            });
        }

        loadCheckouts();

        $scope.$on("SimplyLog.RefreshRequired", loadCheckouts);
        $scope.$on("Simple.ConfigurationChanged", loadCheckouts);

        $scope.logout = function() {
            loginManager.logout().then(function() {
                $location.path("Login");
            });
        };
    };
    
})(Simple, SimplyLog);