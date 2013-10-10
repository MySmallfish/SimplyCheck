(function(S) {
    S.PhoneGapCameraService = function($q,phoneGap) {

        function isAvailable() {
            return phoneGap.isReady() && navigator.camera;
        }

        function capture(options) {
            options = _.defaults(options, {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                encodingType: Camera.EncodingType.JPEG,
                sourceType: Camera.PictureSourceType.CAMERA,
                saveToPhotoAlbum: true,
                correctOrientation: true,
                targetWidth: 1024,
                targetHeight: 768
            });
            var defer = $q.defer();
            if (isAvailable()) {
                navigator.camera.getPicture(function (imageUri) {
                    defer.resolve(imageUri);
                }, function (error) {
                    defer.reject(error);
                }, options);
            } else {
                defer.reject({ message: "Camera not available" });
            }
            return defer.promise;
        }

        function takePicture(options) {
            options = options || {};
            options.sourceType = Camera.PictureSourceType.CAMERA;
            return capture(options);
        }

        function takeFromLibrary() {
            options = options || {};
            options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
            return capture(options);
        }

        return {
            isAvailable: isAvailable,
            takePicture: takePicture,
            takeFromLibrary: takeFromLibrary
        };

    };
})(Simple);