(function(S) {
    S.AttachmentsManager = function ($q, $rootScope, fileManager, fileUtils, queueManager, networkManager, zumoClient) {
        var filesQueue = queueManager.get({
            name: "Attachments",
            processItemAction: function (uri) {
                console.log("PROCESS: ", uri);
                var attachments = zumoClient.getTable("Attachments");
                return attachments.insert({
                    entityName: "Attachment",
                    contentType: "image/jpg",
                    fileName: fileUtils.fileName(uri)
                });
            }
        });

        function queue(uri) {
            uri = uri.toURL();
            return filesQueue.push(uri).then(function (r) {
                
                try {
                    networkManager.whenOnline(function () {
                        filesQueue.run();
                    });
                } catch (e) {
                    console.log("ERROR! ", e);
                }
                console.log("RETURNING!!!", r);
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