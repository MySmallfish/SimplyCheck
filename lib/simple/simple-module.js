(function (S) {

    var simpleModule = angular.module("Simple", []);

    simpleModule.service("storageService", S.StorageService);
    simpleModule.service("geoLocation", S.GeoLocationService);
    simpleModule.service("languageService", S.LanguageService);
    simpleModule.service("textResource", S.TextResourceService);
    simpleModule.filter("l10n", S.LocalizeFilter);

})(Simple);
