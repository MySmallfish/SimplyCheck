(function (S) {
    S.PhoneGapFileManager = function ($q, phoneGap) {
        function moveFile(sourceUri, directoryName, newFileName) {
            var result = $q.defer();

            getDirectory(directoryName).then(function (directory) {
                resolveFileUri(sourceUri).then(function(file) {
                    file.moveTo(directory,newFileName || file.name, result.resolve, result.reject);
                });
            }, result.reject);

            return result.promise;
        }
        function copyFile(sourceUri, directoryName, newFileName) {
            var result = $q.defer();

            getDirectory(directoryName).then(function (directory) {
                resolveFileUri(sourceUri).then(function(file) {
                    file.copyTo(directory, file.name, newFileName, result.resolve, result.reject);
                });
            }, result.reject);

            return result.promise;
        }

        function resolveFileUri(uri) {
            var result = $q.defer();
            alert("RESOLVE URI" + uri);
            window.resolveLocalFileSystemURI(uri, function (file) {
                alert("RESOLVED!" + file.name);
                result.resolve(file);
            }, result.reject);
            return result.promise;
        }

        function requestFileSystem() {
            var result = $q.defer();

            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, result.resolve, result.reject);
            
            return result.promise;
        }

        function getDirectory(name) {
            var result = $q.defer();

            requestFileSystem.then(function (fileSystem) {
                alert("FILE SYSTEM!")
                fileSystem.root.getDirectory(name, { create: true, exclusive: false }, result.resolve, result.reject);
            }, result.reject);
            return result.promise;
        }

        return {
            copy: phoneGap(copyFile),
            move: phoneGap(moveFile),
            getDirectory: phoneGap(getDirectory)
        };
    };
})(Simple);