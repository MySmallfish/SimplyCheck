(function (S, SL) {
    
    SL.HomeController = function ($scope, checkoutService, loginManager, $location, textResource, navigate) {
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
                            memo = memo + item.open;
                            return memo;
                        }, 0);
                        var sumAll = _.reduce(group, function (memo, item) {
                            memo = memo + item.count;
                            return memo;
                        }, 0);
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

        $scope.clearSiteFilter = function() {
            $scope.selectedSiteId = null;
            $scope.selectedSiteName = null;
            loadCheckouts();
        };  
        

        $scope.select = function(item) {
            if (item.id) {
                navigate.checkout(item.id);
            } else {
                $scope.selectedSiteId = item.siteId;
                $scope.selectedSiteName = item.header;
                loadCheckouts();
            }
        };
        
        $scope.newCheckout = function () {
            navigate.newCheckout();
        };

        $scope.logout = function() {
            loginManager.logout().then(function() {
                navigate.login();
            });
        };
    };
    
})(Simple, SimplyLog);