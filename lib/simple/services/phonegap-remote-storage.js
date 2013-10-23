(function(S) {
    S.PhoneGapRemoteStorage = function ($q, phoneGap) {
        function uploadFile(options) {
            var result = $q.defer();
            var fileTransfer = new FileTransfer(),
                fileUploadOptions = new FileUploadOptions();

            fileUploadOptions.mimeType = options.contentType || "image/jpeg";
            fileUploadOptions.fileName = options.fileName;

            function onSuccess(args) {
                console.log("RETURN", args);
                result.resolve(args);
            }

            function onFailure(e) {
                result.reject(e);
            }

            fileTransfer.upload(options.localUrl, options.remoteUrl, onSuccess, onFailure, fileUploadOptions);

        }

        return {
            uploadFile: uploadFile
        };
    };
})(Simple);