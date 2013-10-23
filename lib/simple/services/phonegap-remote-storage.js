(function(S) {
    S.PhoneGapRemoteStorage = function ($q, phoneGap) {
        function uploadFile(options) {
            console.log("UPLOADING FILE ", options);
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
                consol.log("FAILURE", e);
                result.reject(e);
            }

            fileTransfer.upload(options.localUrl, options.remoteUrl, onSuccess, onFailure, fileUploadOptions);
            return result;
        }

        return {
            uploadFile: uploadFile
        };
    };
})(Simple);