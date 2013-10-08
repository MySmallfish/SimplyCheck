(function (S, SL) {

    SL.NewCheckoutController = function ($scope, locationsService) {
        $scope.selectedSite = null;
        $scope.selectSite = function (site) {
            if ($scope.selectedSite == site) {
                $scope.selectedSite = null;
            } else {
                $scope.selectedSite = site;
            }
        };
        
        $scope.startCheckout = function() {
            location.href = "#/Checkout/1";
        };

        locationsService.getSites().then(function(sites) {
            $scope.groups = _.groupBy(sites, function (site) {
                return site.SiteGeoGroup.Name;
            });
        });

        
    };

})(Simple, SimplyLog);