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

        $scope.save = function() {
            location.href = "#/Checkout/1";
        };
        
        $scope.$emit("progress-started");
        locationsService.getSitePermits($routeParams.id).then(function (permits) {
            $scope.permits = permits;
        }).finally(function () {
            $scope.$emit("progress-completed");
        });
        
    };

})(Simple, SimplyLog);