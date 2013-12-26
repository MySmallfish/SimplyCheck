(function (S, SL) {
    SL.ApiClient = [
        "$resource",
        "configurationManager",
        "loginManager",
        function($resource, configurationManager, loginManager) {

            function getIncidentResource() {
                var url = configurationManager.get("Api.Address");
                var result = loginManager.getAccessToken().then(function(token) {
                    var incidentResource =
                        $resource(url + "/api/Events", {}, {
                            update: {
                                method: "PUT",
                                headers: {
                                    "Authorization": "Bearer " + token
                                }
                            },
                            create: {
                                method: "POST",
                                headers: {
                                    "Authorization": "Bearer " + token
                                }

                            }
                        });
                    return incidentResource;
                });
                return result;
            }

            return {
                getIncidentResource: getIncidentResource
            }
        }
    ];
})(Simple, SimplyLog);
