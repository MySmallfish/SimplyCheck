(function (S, SL) {

    SL.SitePermitsController = function ($scope,$routeParams, locationsService, textResource) {
        $scope.changeHeader(textResource.get("RequiredPermits"));
        $scope.isOverdue = function (permit) {
            var result = false;
            if (permit.EffectiveDate) {
                result = permit.Type.DaysDuration > 100;
            }
            return result;
        };

        $scope.backToCheckout = function() {
            location.href = "#/Checkout/1";
        };
        
        $scope.permits = locationsService.getSitePermits($routeParams.id);
    };

})(Simple, SimplyLog);