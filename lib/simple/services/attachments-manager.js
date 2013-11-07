(function(S) {
    S.AttachmentsManager = function ($q, $rootScope, fileManager, fileUtils, queueManager, networkManager, zumoClient, remoteStorage) {
        var filesQueue = queueManager.get({
            name: "Attachments",
            processItemAction: function (uri) {
                var result = $q.defer();
                var attachments = zumoClient.getTable("Attachments");
                attachments.insert({
                    entityName: "Attachment",
                    contentType: "image/jpeg",
                    fileName:  fileUtils.fileName(uri)
                }).then(result.resolve, result.reject);
                
                return result.promise.then(function (item) {
                    console.log("UPLOADING...", item);
                    return remoteStorage.uploadFile({
                        localUrl: uri,
                        remoteUrl: item.sasQueryUrl,
                        contentType: item.contentType,
                        fileName: item.fileName
                    }).then(function (args) {
                        console.log("UPLOADED", args);
                    }, function (e) {
                        console.log("ERROR", e);
                    });
                });

            }
        });

        function queue(uri) {
            uri = uri.toURL();
            return filesQueue.push(uri).then(function (r) {
                networkManager.runOnline(function () {
                    filesQueue.run();
                });
                return r;
            });
        }

        function add(uri) {
            if (!uri) {
                throw new Error("'uri' must be specified.");
            }
            return $q.when(uri).then(function(fileUri) {
                return fileManager.move(fileUri, "Attachments", fileUtils.uniqueFileName(fileUri));
            }).then(queue);
        }

        return {
            add: add
        };
    };
})(Simple);