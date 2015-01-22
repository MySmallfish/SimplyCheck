﻿(function (S) {

    S.EntityManager = [
        "$rootScope",
        "$q",
        "configurationManager",
        "loginManager",
        function ($rootScope, $q, configurationManager, loginManager) {
            var manager = null;
            function getEntityManager() {
                var result = $q.defer();
                if (!manager) {
                    loginManager.getAccessToken().then(function (token) {
                        var serverAddress = configurationManager.get("Api.Address");
                        var oldClient = OData.defaultHttpClient;

                        var myClient = {
                            request: function (request, success, error) {
                                request.headers.Authorization = "Bearer " + token;
                                return oldClient.request(request, success, error);
                            }
                        };

                        OData.defaultHttpClient = myClient;

                        breeze.config.initializeAdapterInstances({
                            dataService: "OData"
                        });


                        manager = new breeze.EntityManager(serverAddress + "/odata");
                        resolve();
                    });
                } else {
                    resolve();
                }

                function fetchMetadata() {
                    if (manager.metadataStore.isEmpty()) {
                        return $q.when(manager.fetchMetadata());
                    }
                    return $q.when({});
                }

                function resolve() {
                    fetchMetadata().then(function () {
                        result.resolve(manager);
                    });
                }


                $rootScope.$on("Simple.ConfigurationChanged", function () {
                    manager = null;
                });

                return result.promise;
            }

            function queryEntityManager(query) {
                return getEntityManager().then(function (entityManager) {
                    return $q.when(entityManager.executeQuery(query));
                });
            }

            function getByKey(entity, key, checkLocal) {
                return getEntityManager().then(function (entityManager) {
                    return entityManager.fetchEntityByKey(entity, key, checkLocal);
                });
            }

            return {
                get: getEntityManager,
                query: queryEntityManager,
                getByKey: getByKey
            };
        }];
})(Simple);
