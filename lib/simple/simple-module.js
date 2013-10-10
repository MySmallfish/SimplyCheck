(function (S) {

    var simpleModule = angular.module("Simple", []);

    simpleModule.service("phoneGap", S.PhoneGap);

    document.addEventListener('deviceready', function () {
        notification.alert("Ready");
        notification.beep(2);
        simpleModule.service("camera", window.Cordova ? S.PhoneGapCameraService : S.NullCameraService);
    });
    
    simpleModule.service("storageService", S.StorageService);
    simpleModule.service("geoLocation", S.GeoLocationService);
    simpleModule.service("languageService", S.LanguageService);
    simpleModule.service("textResource", S.TextResourceService);
    simpleModule.filter("l10n", S.LocalizeFilter);

})(Simple);
