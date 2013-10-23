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
                fileUploadOptions.fileKey = "file";
                fileUploadOptions.httpMethod = "PUT";
                fileUploadOptions.mimeType = options.contentType || "image/jpeg";
                fileUploadOptions.fileName = options.fileName;
                fileUploadOptions.chunkedMode = false;
                function onSuccess(args) {
                    console.log("RETURN", args);
                    result.resolve(args);
                }

                function onFailure(e) {
                    console.log("FAILURE", e);
                    console.log("ERrror text", e.body);
                    result.reject(e);
                }
                fileTransfer.upload(options.localUrl,options.remoteUrl, onSuccess, onFailure, fileUploadOptions, true);
            } catch (e) {
                console.log("Error", e);
            }
            return result.promise;
        }

        return {
            uploadFile: uploadFile
        };
    };
})(Simple);