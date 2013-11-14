(function (S, SL) {
    
    SL.ConfigurationController = function ($scope, textResource, configurationManager, navigate) {
        $scope.changeHeader(textResource.get("Configuration"));
        
        $scope.configuration = {
            MobileServicesAddress: configurationManager.get("Zumo.Address"),
            ApiAddress: configurationManager.get("Api.Address")
        };

        $scope.save = function () {
            $scope.$emit("progress-started");
            var config = $scope.configuration;
            
            configurationManager.update("Api.Address", config.ApiAddress);
            configurationManager.update("Zumo.Address", config.MobileServicesAddress);

            configurationManager.save().then(navigate.back).finally(function () {
                $scope.$emit("progress-completed");
                $scope.$root.$broadcast("Simple.ConfigurationChanged");
            });


        };
    };

})(Simple, SimplyLog);