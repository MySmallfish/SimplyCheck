(function (S) {

    S.PhoneGap = function () {
        
        return function(fn) {
            alert("INSERT");
            var queue = [];
            
            var impl = function() {
                queue.push(Array.prototype.slice.call(arguments));
                alert("qC" + queue.length);
            };

            document.addEventListener('deviceready', function() {
                alert("Device ready, " + queue.length);
                _.each(queue, function (args) {
                    fn.apply(this, args);
                });
                impl = fn;
            }, false);

            return function() {
                return impl.apply(this, arguments);
            };
        };
    };

})(Simple);