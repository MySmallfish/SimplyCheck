(function(S, SL) {

    var simplyLogModule = angular.module("SimplyLog.Checkout", ["ngRoute","Simple"]);

    simplyLogModule.service("incidentsService", SL.IncidentsService);
    simplyLogModule.service("checkoutService", SL.CheckoutService);
    simplyLogModule.service("locationsService", SL.LocationsService);

    simplyLogModule.controller("HomeCtrl", SL.HomeController);
    simplyLogModule.controller("CheckoutCtrl", SL.CheckoutController);
    simplyLogModule.controller("ConfigurationCtrl", SL.ConfigurationController);
    simplyLogModule.controller("SitePermitsCtrl", SL.SitePermitsController);
    simplyLogModule.controller("NewCheckoutCtrl", SL.NewCheckoutController);
    simplyLogModule.controller("IncidentCtrl", SL.IncidentController);

    simplyLogModule.config(function ($routeProvider) {
        $routeProvider
            .when("/", { templateUrl: "views/home.html", controller: "HomeCtrl" })
            .when("/Incident/:checkoutId/:categoryId", { templateUrl: "views/incident.html", controller: "IncidentCtrl" })
            .when("/Incident/:id", { templateUrl: "views/incident.html", controller: "IncidentCtrl" })
            .when("/Checkout/:id", { templateUrl: "views/checkout.html", controller: "CheckoutCtrl" })
            .when("/NewCheckout", { templateUrl: "views/new-checkout.html", controller: "NewCheckoutCtrl" })
            .when("/SitePermits/:id", { templateUrl: "views/site-permits.html", controller: "SitePermitsCtrl" })
            .when("/Configuration", { templateUrl: "views/configuration.html", controller: "ConfigurationCtrl" })
            .otherwise({ redirectTo: "/" });
    });
    
    simplyLogModule.run(function (textResource) {
        textResource.load("he-IL", {
            "Edit":"עריכה",
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
            "StartCheckout": "התחל מבדק"
        });
    });


})(Simple, SimplyLog);
