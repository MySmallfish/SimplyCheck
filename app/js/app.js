(function (S, SL) {

    var simplyLogModule = angular.module("SimplyLog.Checkout", ["ngRoute", "Simple"]);

    simplyLogModule.value("zumoClient", new WindowsAzure.MobileServiceClient('https://simplycheck.azure-mobile.net/', 'IeFmiqEZkDybLqTiFONABOFvmYLVRG94'));

    simplyLogModule.service("loginManager", SL.LoginManager);
    simplyLogModule.service("incidentsService", SL.IncidentsService);
    simplyLogModule.service("checkoutService", SL.CheckoutService);
    simplyLogModule.service("locationsService", SL.LocationsService);

    simplyLogModule.controller("LoginCtrl", SL.LoginController);
    simplyLogModule.controller("HomeCtrl", SL.HomeController);
    simplyLogModule.controller("CheckoutCtrl", SL.CheckoutController);
    simplyLogModule.controller("ConfigurationCtrl", SL.ConfigurationController);
    simplyLogModule.controller("SitePermitsCtrl", SL.SitePermitsController);
    simplyLogModule.controller("NewCheckoutCtrl", SL.NewCheckoutController);
    simplyLogModule.controller("IncidentCtrl", SL.IncidentController);

    simplyLogModule.config(function ($routeProvider) {
        $routeProvider
            .when("/", { templateUrl: "views/home.html", controller: "HomeCtrl" })
            .when("/Login", { templateUrl: "views/login.html", controller: "LoginCtrl" })
            .when("/Incident/:checkoutId/:categoryId", { templateUrl: "views/incident.html", controller: "IncidentCtrl" })
            .when("/Incident/:id", { templateUrl: "views/incident.html", controller: "IncidentCtrl" })
            .when("/Checkout/:id", { templateUrl: "views/checkout.html", controller: "CheckoutCtrl" })
            .when("/NewCheckout", { templateUrl: "views/new-checkout.html", controller: "NewCheckoutCtrl" })
            .when("/SitePermits/:id", { templateUrl: "views/site-permits.html", controller: "SitePermitsCtrl" })
            .when("/Configuration", { templateUrl: "views/configuration.html", controller: "ConfigurationCtrl" })
            .otherwise({ redirectTo: "/" });
    });

    simplyLogModule.run(function ($rootScope, $location, loginManager) {
        // register listener to watch route changes
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            loginManager.isUserLoggedIn().catch(function () {
                // no logged user, we should be going to #login
                if (next.templateUrl == "views/login.html") {
                    // already going to #login, no redirect needed
                } else {
                    // not going to #login, we should redirect now
                    $location.path("/Login");
                }
            });
        });
    });

    simplyLogModule.run(function (textResource) {
        textResource.load("he-IL", {
            "Edit": "עריכה",
            "Incidents": "ליקויים",
            "OrderBy": "מיין לפי",
            "header": "מיקום",
            "date": "תאריך",
            "status": "סטטוס",
            "Search": "חפש",
            "Valid": "תקין",
            "RequiredPermits": "אישורים נדרשים",
            "Checkout": "מבדק",
            "Back": "חזרה",
            "NewIncident": "הוספת ממצא",
            "EditIncident": "עריכת ממצא",
            "Invalid": "לא תקין",
            "Checkouts": "מבדקים",
            "CheckoutDetails": "ביצוע מבדק",
            "TypeToSearch": "הקלד מילות מפתח לחיפוש...",
            "Severity": "קדימות",
            "Handling": "טיפול בליקוי",
            "DueTime": "עד:",
            "HandlingTarget": "ע\"י",
            "SelectHandlingTarget": "בחר גורם מטפל",
            "IncidentDescription": "מהות הפער",
            "IncidentRemarks": "פעולה מתקנת",
            "Attachments": "תמונות",
            "Save": "שמור",
            "SaveAndNew": "שמור והוסף ממצא",
            "EffectiveDate": "תאריך:",
            "BackToCheckout": "חזרה למבדק",
            "NewCheckout": "מבדק חדש",
            "StartCheckout": "התחל מבדק",
            "SystemLogin": "כניסה למערכת",
            "Login": "כניסה",
            "Username": "שם משתמש",
            "Password": "סיסמה",
            "Logout": "יציאה",
            "AuthenticationFailed": "שם המשתמש או הסיסמה שגויים או שאינך רשום"
        });
    });


    simplyLogModule.factory("entityManager", function () {

        var serverAddress = "http://localhost:49712/odata/";
        var defaultHandler = OData.defaultHandler;
        
        breeze.config.initializeAdapterInstances({
            dataService: "OData"
        });
        var dataService = new breeze.DataService({
            serviceName: serverAddress
        })
        var manager = new breeze.EntityManager(serverAddress);
        //manager.metadataStore.fetchMetadata(dataService, function (data) {
        //    console.log("MD", data);

        //    console.log("Types", manager.metadataStore.getEntityTypes());
        //});


        return manager;
    });

})(Simple, SimplyLog);
