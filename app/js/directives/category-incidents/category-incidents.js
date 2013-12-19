(function (S, SL) {
    SL.CategoryIncidentsDirective = function() {
        return {
            restrict: "E",
            templateUrl: 'app/js/directives/category-incidents/category-incidents.html',
            scope: true,
            replace: true,
            compile: function(el, attributes, trunsclude) {
                return {
                    post: function(scope, element, attrs) {
                        //var re = /\$(.*)\$/gi;
                        //var matches = re.exec(element.text());
                        //console.log("M", matches);
                        //if (matches) {
                        //    for (var i = 0; i < matches.length; i++) {

                        //    }
                        //}
                        
                        //element.html();
                    }
                };
            }
        };
    };
    
})(Simple, SimplyLog);