(function (S, SL) {
    var client = new WindowsAzure.MobileServiceClient('https://simplycheck.azure-mobile.net/', 'IeFmiqEZkDybLqTiFONABOFvmYLVRG94');
    SL.HomeController = function($scope, checkoutService) {
        $scope.orderBy = "header";
        $scope.items = checkoutService.getCheckouts();
        
        
        $scope.login = function() {
            
            client.login("google").then(function(result) {
                console.log("RESULT", result);
                $scope.isUserLoggedIn = client.currentUser != null;
                $scope.$apply();
            }, function(error) {
                console.log("ERROR", error);
            });

        };
        $scope.logout = function() {
            client.logout();
            $scope.isUserLoggedIn = client.currentUser != null;
        };
    };
    
})(Simple, SimplyLog);