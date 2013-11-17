(function (S, SL) {
    
    SL.HomeController = function ($scope, checkoutService, loginManager, $location, textResource) {
        $scope.changeHeader(textResource.get("Checkouts"));
        $scope.orderBy = "header";
        $scope.selectedSiteId = null;
        $scope.selectedSiteName = null;
        var employeeId = 0;
        function loadCheckouts() {
            $scope.$emit("progress-started");


            checkoutService.getCheckouts(employeeId, $scope.selectedSiteId).then(function (items) {
                if ($scope.selectedSiteId) {
                    $scope.items = items;
                } else {
                    var groupped = _.groupBy(items, "siteId");
                    $scope.items = _.map(groupped, function (group) {
                        var sorted = _.sortBy(group, "date");
                        sorted = sorted.reverse();
                        var sumOpen = _.reduce(group, function (memo, item) {
                            return memo.open + item.open;
                        });
                        var sumAll = _.reduce(group, function (memo, item) {
                            return memo.count + item.count;
                        });
                        if (isNaN(sumOpen)) sumOpen = 0;
                        if (isNaN(sumAll)) sumAll = 0;
                        return {
                            id: sorted.length > 1? 0: sorted[0].id,
                            header: sorted[0].header,
                            multiple: sorted.length > 1,
                            siteId: sorted[0].siteId,
                            status: sorted[0].status,
                            open: sumOpen,
                            count: sumAll,
                            date: sorted[0].date,
                            checkouts: sorted.length
                        };
                    });

                    
                }
            }).finally(function () {
                $scope.$emit("progress-completed");
            });
        }

        loadCheckouts();

        $scope.$on("SimplyLog.RefreshRequired", loadCheckouts);
        $scope.$on("Simple.ConfigurationChanged", function () {
            checkoutService.clearCache();
            loadCheckouts();
        });

        $scope.clearSiteFilter = function () {
            $scope.selectedSiteId = null;
            $scope.selectedSiteName = null;
            loadCheckouts();
        }

        

        $scope.select = function (item) {
            if (item.id) {
                $location.path("/Checkout/" + item.id);
            } else {
                $scope.selectedSiteId = item.siteId;
                $scope.selectedSiteName = item.header;
                loadCheckouts();
            }
        }

        $scope.logout = function() {
            loginManager.logout().then(function() {
                $location.path("Login");
            });
        };
    };
    
})(Simple, SimplyLog);