(function (S) {

    S.PhoneGap = function () {
        var isReady = false;
        document.addEventListener('deviceready', function () {
            isReady = true;
        });

        return {
            isReady: function () {
                return isReady;
            }
        }
    };

})(Simple);