(function(S) {
    S.AttachmentsManager = function ($q,$rootScope, fileManager, fileUtils) {

        function add(uri) {
            return $q.when(uri).then(function(fileUri) {
                return fileManager.move(fileUri, "Attachments", fileUtils.uniqueFileName(fileUri));
            });
        }

        return {
            add: add
        };
    };
})(Simple);