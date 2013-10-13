(function (S) {

    var simpleModule = angular.module("Simple", []);

    simpleModule.factory("phoneGap", S.PhoneGap);

    simpleModule.service("camera", S.PhoneGapCameraService);
    //simpleModule.service("fileManager", S.PhoneGapFileManager);
    alert(window.PhoneGap);
    simpleModule.service("storageService", S.StorageService);
    simpleModule.service("geoLocation", S.GeoLocationService);
    simpleModule.service("languageService", S.LanguageService);
    simpleModule.service("textResource", S.TextResourceService);
    simpleModule.filter("l10n", S.LocalizeFilter);

})(Simple);
