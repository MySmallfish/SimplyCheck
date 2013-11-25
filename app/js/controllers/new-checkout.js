(function (S, SL) {

    SL.NewCheckoutController = function ($scope, locationsService, textResource, checkoutService, navigate) {
        $scope.changeHeader(textResource.get("NewCheckout"));
        $scope.selectedSite = null;
        $scope.selectSite = function (site) {
            if ($scope.selectedSite == site) {
                $scope.selectedSite = null;
            } else {
                $scope.selectedSite = site;
            }
        };
        
        $scope.startCheckout = function () {
            if ($scope.selectedSite) {
                $scope.$emit("progress-started");
                checkoutService.createNewCheckout(1, $scope.selectedSite.Id).then(function (checkout) {
                    navigate.checkout(checkout.Id);
                }).finally(function() {
                    $scope.$emit("progress-completed");
                });
            }
        };
        var employeeId = 1;
        $scope.$emit("progress-started");
        locationsService.getSites(employeeId).then(function (sites) {
            $scope.groups = _.groupBy(sites, function (site) {
                return site.SiteGeoGroup.Name;
            });
        }).finally(function () {
            $scope.$emit("progress-completed");
        });

        
    };

})(Simple, SimplyLog);