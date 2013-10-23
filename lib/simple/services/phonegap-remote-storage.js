(function(S) {
    S.PhoneGapRemoteStorage = function ($q, phoneGap) {
        function uploadFile(options) {
            console.log("UPLOADING FILE ", options);
            var result = $q.defer();
            console.log("local url", options.localUrl);
            console.log("remote url", options.remoteUrl);
            try {
                var fileTransfer = new FileTransfer(),
                    fileUploadOptions = new FileUploadOptions();
                cons.log("Setting options");
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
                cons.log("executing");
                fileTransfer.upload(options.localUrl, options.remoteUrl, onSuccess, onFailure, fileUploadOptions);
            } catch (e) {
                consol.log("Error", e);
            }
            return result.promise;
        }

        return {
            uploadFile: uploadFile
        };
    };
})(Simple);