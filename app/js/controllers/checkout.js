(function (S, SL) {

    SL.CheckoutController = function ($scope, $routeParams, checkoutService) {
        $scope.id = $routeParams.id;
        
        $scope.navigateToIncident = function(id) {
            location.href = '#/Incident/' + String(id);
        };
        $scope.markAsValid = function(item) {
            item.Valid = true;
        };
        $scope.markAsInValid = function (item) {
            item.Valid = false;
            location.href = '#/Incident/' + String(item.Id) + "/" + String($scope.id);
        };
        
        $scope.checkout = checkoutService.getCheckout($scope.id);
        

    };

})(Simple, SimplyLog);