(function (S, SL) {

    SL.SitePermitsController = function ($scope,$routeParams,$location, locationsService, textResource) {
        $scope.changeHeader(textResource.get("RequiredPermits"));
        $scope.checkoutId = parseInt($routeParams.checkoutId, 10);
        $scope.siteId = parseInt($routeParams.siteId, 10);
       
        $scope.isOverdue = function (permit) {
            var result = false;
            if (permit.EffectiveDate) {
                result = permit.Type.DaysDuration > 100;
            }
            return result;
        };

        $scope.save = function () {

            $scope.$emit("progress-started");
            locationsService.saveSitePermits($scope.siteId, $scope.permits).then(function () {
                
                $location.path("/Checkout/" + $scope.checkoutId);
            }).finally(function () {
                $scope.$emit("progress-completed");
            });
            
        };
        
        $scope.$emit("progress-started");
        locationsService.getSitePermits($scope.siteId).then(function (permits) {
            console.log("PERMITS", permits);
            $scope.permits = permits;
        }).finally(function () {
            $scope.$emit("progress-completed");
        });

      
        
    };

})(Simple, SimplyLog);