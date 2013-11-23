(function (S, SL) {
    SL.NavigationServiceProvider = function ($routeProvider) {

        function configure() {
            $routeProvider
                .when("/", { templateUrl: "views/home.html", controller: "HomeCtrl", resolve: { pageInfo: function () { return { configuration: true, back: false, logout: true, home: false, refresh: true }; } } })
                .when("/Login", { templateUrl: "views/login.html", controller: "LoginCtrl", resolve: { pageInfo: function () { return { configuration: true, back: false, logout: false, home: false }; } } })
                .when("/Incident/:checkoutId/:categoryId", { templateUrl: "views/incident.html", controller: "IncidentCtrl" })
                .when("/Incident/:checkoutId/:categoryId/:uniqueId", { templateUrl: "views/incident.html", controller: "IncidentCtrl" })
                .when("/Checkout/:id", { templateUrl: "views/checkout.html", controller: "CheckoutCtrl" })
                .when("/Checkout/:id/:categoryId", { templateUrl: "views/checkout.html", controller: "CheckoutCtrl" })
                .when("/NewCheckout", { templateUrl: "views/new-checkout.html", controller: "NewCheckoutCtrl" })
                .when("/SitePermits/:checkoutId/:siteId", { templateUrl: "views/site-permits.html", controller: "SitePermitsCtrl" })
                .when("/Configuration", { templateUrl: "views/configuration.html", controller: "ConfigurationCtrl", resolve: { pageInfo: function () { return { configuration:false,  back: true, logout: false, home: false }; } } })
                .otherwise({ redirectTo: "/" });
        }

        return {
            configure: configure,
            $get: SL.NavigationService
        }
    };

    SL.NavigationService = function ($location, $window) {

        function configuration() {
            $location.path("/Configuration");
        }
        function back() {
            $window.history.back();
        }
        function newIncident(checkoutId, categoryId) {
            return incident(checkoutId, categoryId);
        }

        function incident(checkoutId, categoryId, uniqueId) {
            var path = "Incident/" + String(checkoutId) + "/" + String(categoryId);
            if (uniqueId) {
                path += "/" + String(uniqueId);
            }
            return $location.path(path);
        }

        function sitePermits(checkoutId, siteId) {
            var path = "SitePermits/" + String(checkoutId) + "/" + String(siteId);

            return $location.path(path);
        }

        function checkout(checkoutId, categoryId) {
            var path = "Checkout/" + String(checkoutId);
            if (categoryId) {
                path += "/" + String(categoryId);
            }
            return $location.path(path);
        }
        return {
            newIncident: newIncident,
            incident: incident,
            sitePermits: sitePermits,
            back: back,
            configuration: configuration,
            checkout: checkout
        }

    };
})(Simple, SimplyLog);
