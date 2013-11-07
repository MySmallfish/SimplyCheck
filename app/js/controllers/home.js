(function (S, SL) {
    
    SL.HomeController = function ($scope, checkoutService, loginManager, $location, textResource) {
        $scope.changeHeader(textResource.get("Checkouts"));
        $scope.orderBy = "header";
        $scope.items = checkoutService.getCheckouts();
        
        $scope.logout = function() {
            loginManager.logout().then(function() {
                $location.path("Login");
            });
        };
    };
    
})(Simple, SimplyLog);