(function(S) {
    S.AttachmentsManager = function ($q, fileManager, fileUtils) {

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