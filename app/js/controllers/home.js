(function (S, SL) {
    
    SL.HomeController = function ($scope, checkoutService, loginManager, $location, textResource) {
        $scope.changeHeader(textResource.get("Checkouts"));
        $scope.orderBy = "header";
        $scope.$emit("progress-started");
        checkoutService.getCheckouts().then(function (items) {
            $scope.items = items;
        }).finally(function () {
            $scope.$emit("progress-completed");
        });
        
        
        $scope.logout = function() {
            loginManager.logout().then(function() {
                $location.path("Login");
            });
        };
    };
    
})(Simple, SimplyLog);