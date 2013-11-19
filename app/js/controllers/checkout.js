(function (S, SL) {

    SL.CheckoutController = function ($scope, $routeParams, navigate, checkoutService, textResource) {
        $scope.changeHeader(textResource.get("Checkout"));
        $scope.id = $routeParams.id;
        
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
        $scope.incidentPriorityPredicate = function (incident1, incident2) {
            console.log("I1", incident1);
            console.log("I2", incident2);
        }
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
        }).finally(function () {
            $scope.$emit("progress-completed");
        });
        
        

    };

})(Simple, SimplyLog);