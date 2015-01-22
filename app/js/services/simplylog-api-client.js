(function (S, SL) {
    SL.ApiClient = [
        "$resource",
        "configurationManager",
        "loginManager",
        function($resource, configurationManager, loginManager) {

            function run(api) {
                var url = configurationManager.get("Api.Address");
                var result = loginManager.getAccessToken().then(function(token) {
                    return {
                        url: url + "/api/" + api,
                        headers: {
                            "Authorization": "Bearer " + token
                        }
                    };
                });

                return result;
           }

            function createResource(name) {
                return run(name).then(function(info) {
                    var resource =
                         $resource(info.url, {}, {
                             update: {
                                 method: "PUT",
                                 headers: _.extend({}, info.headers)
                             },
                             create: {
                                 method: "POST",
                                 headers: _.extend({}, info.headers)

                             }
                         });
                    return resource;

                });

            }

            function getIncidentResource() {
                return createResource("Events");
            }

            function getEquipmentResource() {
                return createResource("Equipment");
            }

            function findBarcode(barCode) {
                return run("BarCode").then(function(info) {
                    return $http({
                        url: info.url,
                        headers: _.extend({}, info.headers),
                        method: "GET",
                        params: { barCode: barCode }
                    });
                }).then(function(results) {
                    return results.data;
                });
            }

            return {
                getIncidentResource: getIncidentResource,
                getEquipmentResource: getEquipmentResource,
                findBarcode: findBarcode
            };
        }
    ];
})(Simple, SimplyLog);
