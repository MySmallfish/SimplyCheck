(function (S, SL) {

    var simplyLogModule = angular.module("SimplyLog.Checkout", ["ngRoute", "ngTouch", "$strap", "Simple"]);



    
    simplyLogModule.service("checkoutDataService", SL.CheckoutDataService);
    simplyLogModule.service("incidentDataService", SL.IncidentDataService);
    simplyLogModule.service("incidentsService", SL.IncidentsService);
    simplyLogModule.service("checkoutQueueManager", SL.CheckoutQueueManager);
    simplyLogModule.service("checkoutService", SL.CheckoutService);
    simplyLogModule.service("locationsService", SL.LocationsService);

    simplyLogModule.config(["azureActiveDirectoryProvider", function (azureActiveDirectory) {
        azureActiveDirectory.configure("simplylog.onmicrosoft.com", {
            client_id: "HgJQOHO6jgYORkDYUF5lQb5vYvXOOhs7WbG0mtF90HQ=",
            client_secret: "369c5d3c-6b11-4a1a-97ae-1c49c2e62a64",
            grant_type: "password",
            resource: "https://simplylogapi.ylm.co.il",
        }, "http://localhost:59056/api/Token");
    }]);
        
    simplyLogModule.provider("navigate", SL.NavigationServiceProvider);

    simplyLogModule.directive("appHeader", function () {
        return SL.AppHeaderDirective;
    });

    simplyLogModule.directive("slCategoryIncidents", SL.CategoryIncidentsDirective);
    simplyLogModule.directive("slCategory", SL.CategoryDirective);
    
    simplyLogModule.directive('postRepeatDirective',
  ['$timeout', '$log',
  function ($timeout, $log) {
      return function (scope, element, attrs) {
          if (scope.$last) {
              $timeout(function () {
                  console.timeEnd("checkout");
                  //var ref = new Date(timeFinishedLoadingList);
                  
              });
          }
      };
  }
  ]);
    simplyLogModule.controller("LoginCtrl", SL.LoginController);
    simplyLogModule.controller("HomeCtrl", SL.HomeController);
    simplyLogModule.controller("CheckoutCtrl", SL.CheckoutController);
    simplyLogModule.controller("ConfigurationCtrl", SL.ConfigurationController);
    simplyLogModule.controller("SitePermitsCtrl", SL.SitePermitsController);
    simplyLogModule.controller("NewCheckoutCtrl", SL.NewCheckoutController);
    simplyLogModule.controller("IncidentCtrl", SL.IncidentController);
    simplyLogModule.value('$strapConfig', {
        datepicker: {
            language: 'he',
            format: 'dd/MM/yyyy'
        }
    });
    simplyLogModule.config(function (navigateProvider) {
        navigateProvider.configure();
    });

    simplyLogModule.config(function (configurationManagerProvider) {
        configurationManagerProvider.configure({
            "Api.Address": "http://simplylogapi.ylm.co.il/odata/",
            "Zumo.Address": "https://simplycheck.azure-mobile.net/"
        });
    });

    simplyLogModule.service("zumoClient", function (configurationManager) {
        return new WindowsAzure.MobileServiceClient(configurationManager.get("Zumo.Address"), 'IeFmiqEZkDybLqTiFONABOFvmYLVRG94');
    });
    simplyLogModule.run(function ($rootScope, $location, loginManager, navigate, incidentsService, network, checkoutService) {
        // register listener to watch route changes
        $rootScope.changeHeader = function (header) {
            $rootScope.header = header;
        };

        $rootScope.isOnline = network.isOnline();


        $rootScope.$on("Simple.NetworkStatusChanged", function () {
            $rootScope.isOnline = network.isOnline();
        });

        $rootScope.$on("progress-started", function () {
            $rootScope.isInProgress = true;
        });
        $rootScope.$on("progress-completed", function () {
            $rootScope.isInProgress = false;
        });

        $rootScope.navigatToConfiguration = function () {
            navigate.configuration();
        };


        $rootScope.refresh = function () {
            checkoutService.sendUpdates();
            incidentsService.sendUpdates();

            $rootScope.$broadcast("SimplyLog.RefreshRequired");
        };
        $rootScope.logout = function () {
            loginManager.logout().then(function () {
                $location.path("Login");
                $rootScope.$emit("progress-completed");
            });
        };
        var anonymousAllowed = ["views/login.html", "views/configuration.html"];
        $rootScope.$on("$routeChangeSuccess", function (event, next, current) {
            $rootScope.changeHeader("");
            if (next && next.locals) {
                $rootScope.pageInfo = next.locals.pageInfo;
            }
        });
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            loginManager.isUserLoggedIn().then(function () {
                $rootScope.isLoggedIn = true;

            }, function () {
                $rootScope.isLoggedIn = false;
                // no logged user, we should be going to #login
                if (anonymousAllowed.indexOf(next.templateUrl) >= 0) {
                    // already going to #login, no redirect needed
                } else {
                    // not going to #login, we should redirect now
                    $location.path("/Login");
                }
            });
        });

    });

    simplyLogModule.run(function (configurationManager) {
        configurationManager.load();
    });

    simplyLogModule.run(function (textResource) {
        textResource.load("he-IL", {
            "Edit": "עריכה",
            "Incidents": "ליקויים",
            "NoIncidents": "אין ליקויים",
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
            "Invalid": "הוסף ליקוי",
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
            "Configuration": "הגדרות",
            "ApiAddress": "כתובת API",
            "MobileServicesAddress": "כתובת Mobile Services",
            "Save": "שמור",
            "AuthenticationFailed": "שם המשתמש או הסיסמה שגויים או שאינך רשום",
            "PermitEffectiveDate": "תאריך",
            "SimplyCheck": "מבדק בטיחות",
            "FilteredForSite": "מבדקים לאתר:"
        });
    });




})(Simple, SimplyLog);
