(function (S) {

    var simpleModule = angular.module("Simple", []);

    simpleModule.service("phoneGap", S.PhoneGap);

    simpleModule.service("camera", S.NullCameraService);
    
    document.addEventListener('deviceready', function () {
        alert("Ready");
        var reg = simpleModule.service("camera", S.PhoneGapCameraService);
        alert(typeof reg);

    });
    
    simpleModule.service("storageService", S.StorageService);
    simpleModule.service("geoLocation", S.GeoLocationService);
    simpleModule.service("languageService", S.LanguageService);
    simpleModule.service("textResource", S.TextResourceService);
    simpleModule.filter("l10n", S.LocalizeFilter);

})(Simple);
