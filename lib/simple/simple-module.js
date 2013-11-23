(function (S) {

    var simpleModule = angular.module("Simple", []);

    simpleModule.factory("utils", S.Utilities);
    simpleModule.factory("fileUtils", S.FileUtils);

    simpleModule.factory("safeApply", [ S.SafeApply ]);

    simpleModule.service("network", S.NetworkService);
    simpleModule.service("networkManager", S.NetworkManager);

   
    simpleModule.factory("phoneGap", S.PhoneGap);
    simpleModule.service("camera", S.PhoneGapCameraService);
    simpleModule.service("remoteStorage", S.PhoneGapRemoteStorage);
    simpleModule.service("fileManager", S.PhoneGapFileManager);
    simpleModule.service("queueManager", S.QueueManager);
    simpleModule.service("stateManager", S.StateManager);
    
    simpleModule.service("attachmentsManager", S.AttachmentsManager);
    simpleModule.provider("configurationManager", S.ConfigurationManagerProvider);
    simpleModule.service("storageService", S.StorageService);
    simpleModule.service("geoLocation", S.GeoLocationService);
    simpleModule.service("languageService", S.LanguageService);
    simpleModule.service("textResource", S.TextResourceService);
    simpleModule.filter("l10n", S.LocalizeFilter);

    simpleModule.directive("simpleBack", S.BackDirective);
    simpleModule.directive("simpleHome", S.HomeDirective);
    //if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
    //    document.addEventListener("deviceready", onDeviceReady, false);
    //} else {
    //    onDeviceReady(); //this is the browser
    //}

})(Simple);
