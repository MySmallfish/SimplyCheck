(function (S) {

    var simpleModule = angular.module("Simple", []);

    simpleModule.service("languageService", S.LanguageService);
    simpleModule.service("textResource", S.TextResourceService);
    simpleModule.filter("l10n", S.LocalizeFilter);

})(Simple);
