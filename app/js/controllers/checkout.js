(function (S, SL) {

    SL.CheckoutController = function ($scope, $routeParams, navigate, checkoutService, textResource, stateManager, $anchorScroll, $location) {
        $scope.changeHeader(textResource.get("Checkout"));
        $scope.id = $routeParams.id;

        stateManager.register($scope, $scope.id, "search");

        if ($routeParams.categoryId) {
            $location.hash("_category_" + $routeParams.categoryId);
            $anchorScroll();
        }

        $scope.navigateToIncident = function (item, uniqueId) {
            navigate.incident($scope.id, item.Id, uniqueId);
        };
        $scope.markAsValid = function(item) {
            item.Valid = true;
        };
        $scope.markAsInValid = function (item) {
            item.Valid = false;
            navigate.newIncident($scope.id, item.Id);
        };

        $scope.displaySitePermits = function () {
            if ($scope.checkout && $scope.checkout.Site) {
                navigate.sitePermits($scope.id, $scope.checkout.Site.Id);
            }
        };

        $scope.$emit("progress-started");
        function collapseByIncidents(item) {
            var shouldExpand = false;
            if (item.Incidents && item.Incidents.length > 0) {
                item.Collapsed = false;
                shouldExpand = true;
            } else if (item.Items) {
                _.each(item.Items, function (childItem) {
                    if (collapseByIncidents(childItem)) {
                        shouldExpand = true;
                    }
                });
            }

            return shouldExpand;
        }
        checkoutService.getCheckout($scope.id).then(function (checkout) {

            //collapseByIncidents(checkout.Items);

            $scope.checkout = checkout;
            console.time('checkout');

        }).finally(function () {
            $scope.$emit("progress-completed");
        });
        
        

    };

})(Simple, SimplyLog);