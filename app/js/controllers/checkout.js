(function (S, SL) {

    SL.CheckoutController = function ($scope, $routeParams, checkoutService, camera) {
        $scope.id = $routeParams.id;
        
        $scope.navigateToIncident = function(id) {
            location.href = '#/Incident/' + String(id);
        };
        $scope.markAsValid = function(item) {
            item.Valid = true;
        };
        $scope.markAsInValid = function (item) {
            camera.takePicture().then(function (uri) {
                $scope.loginError = uri;
            }, function (error) {
                $scope.loginError = JSON.stringify(error);
            });
            return;
            item.Valid = false;
            location.href = '#/Incident/' + String(item.Id) + "/" + String($scope.id);
        };
        
        $scope.checkout = checkoutService.getCheckout($scope.id);
        

    };

})(Simple, SimplyLog);