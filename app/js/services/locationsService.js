(function (S, SL) {

    SL.LocationsService = function ($q, queueManager, $http, configurationManager, $cacheFactory) {
        var sitePermitsCache = $cacheFactory("sitePermits");

        var permitsQueue = queueManager.get({
            name: "Permits",
            processItemAction: sendPermit
        });

        function sendPermit(permit) {
            console.log("SENDING PERMIT: ", permit);
            var result = $q.defer();
            result.resolve(permit);
            return result.promise;
        }

        function saveSitePermits(siteId, permits) {
            return validateSitePermits(permits)
                            .then(function (items) {
                                var cachedPermits = sitePermitsCache.get(siteId);
                                if (!cachedPermits) {
                                    cachedPermits = [];
                                    sitePermitsCache.put(siteId, cachedPermits);
                                }
                                
                                items = _.map(items, function (item) {
                                    return {
                                        SiteId: siteId,
                                        PermitTypeId: item.Type.Id,
                                        EffectiveDate: item.EffectiveDate
                                    };
                                });

                                _.each(items, function (permit) {
                                    permitsQueue.push(permit);
                                    cachedPermits.push(permit);
                                });
                            })
                            .then(runPermitsQueue);
        }

        function validateSitePermits(permits) {
            var result = $q.defer();
            result.resolve(permits);
            return result.promise;
        }

        function runPermitsQueue() {
            permitsQueue.run();
        }

        function getSitePermits(siteId) {
            var apiAddress = configurationManager.get("Api.Address");
            var cachedPermits = sitePermitsCache.get(siteId);
            if (cachedPermits) {
                return $q.when(cachedPermits);
            } else {
                return $http({
                    method: "POST",
                    url: apiAddress + "Site(" + siteId + ")/RequiredPermits",
                    header: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                }).then(function (data) {
                    var items = _.map(data.data.value, function (item) {
                        return {
                            Id: item.PermitId || 0,
                            HasPermit: Boolean(item.PermitId),
                            EffectiveDate: item.EffectiveDate,
                            Type: {
                                Id: item.PermitTypeId,
                                Name: item.PermitTypeName,
                                DaysDuration: item.PermitTypeDaysDuration
                            }
                        }
                    });
                    sitePermitsCache.put(siteId, items);
                    return items;
                });
            }
        }

        function getSites(employeeId) {
            var items = [
            {
                Id: 1,
                Name: "ביס 1",
                SiteGeoGroup: {
                    Id: 1,
                    Name: "בתי ספר"
                },
                Address: "ילדי טהרן 6"
            },
            {
                Id: 2,
                Name: "ביס 2",
                SiteGeoGroup: {
                    Id: 1,
                    Name: "בתי ספר"
                },
                Address: "צעירי בגדאד 12"
            },
            {
                Id: 3,
                Name: "גן 1",
                SiteGeoGroup: {
                    Id: 2,
                    Name: "גני ילדים"
                },
                Address: "זקני תימן 142"
            },
            {
                Id: 4,
                Name: "מקלט 1",
                SiteGeoGroup: {
                    Id: 3,
                    Name: "מקלטים"
                },
                Address: "בן טולילה 16"
            },
            ];
            var defer = $q.defer();
            defer.resolve(items);
            return defer.promise;
        }

        return {
            getSites: getSites,
            getSitePermits: getSitePermits,
            saveSitePermits: saveSitePermits,
            validateSitePermits: validateSitePermits
        };
    };

})(Simple, SimplyLog);
