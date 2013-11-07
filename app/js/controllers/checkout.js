(function (S, SL) {

    SL.CheckoutController = function ($scope, $routeParams, navigate, checkoutService, textResource) {
        $scope.changeHeader(textResource.get("Checkout"));
        $scope.id = $routeParams.id;
        
        $scope.navigateToIncident = function(item, id) {
            navigate.incident($scope.id, item.Id, id);            
        };
        $scope.markAsValid = function(item) {
            item.Valid = true;
        };
        $scope.markAsInValid = function (item) {
            item.Valid = false;
            navigate.newIncident($scope.id, item.Id);
        };
        
        $scope.checkout = checkoutService.getCheckout($scope.id);
        

    };

})(Simple, SimplyLog);