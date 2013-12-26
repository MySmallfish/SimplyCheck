(function (S, SL) {

    SL.IncidentDataService = [
        "$cacheFactory",
        "$q",
        "entityManager",
        "simplyLogApiClient",
        function ($cacheFactory, $q, entityManager, simplyLogApiClient) {

            var referenceCache = $cacheFactory("reference");

            function getEventsQuery() {
                return breeze.EntityQuery.from("Event");
            }
            function getActiveItemsQuery(entity, fields, orderBy) {
                var query = breeze.EntityQuery.from(entity)
                    .where("RowStatus", "==", 0);

                if (fields) {
                    query = query.select(fields);
                }

                if (orderBy) {
                    query = query.orderBy(orderBy);
                }

                return query;
            }
            function getSeverityQuery() {
                var query = getActiveItemsQuery("Severity", ["Id", "Name", "Color"], "Id").where("Id", "<", 4);
                return query;
            }
            function getHandlingTargetQuery() {
                var query = getActiveItemsQuery("HandlingTarget", ["Id", "Name"], "Name");
                return query;
            }

            function getItems(query, mapFunction, cacheKey) {
                var cached = referenceCache.get(cacheKey);
                if (cached) {
                    return $q.when(cached);
                } else {
                    return entityManager.get().then(function (em) {
                        return $q.when(em.executeQuery(query));
                    }).then(function (result) {
                        var items = _.map(result.results, mapFunction);
                        referenceCache.put(cacheKey, items);
                        return items;
                    });
                }
            }

            function getSeverity(id) {
                return getItem("severities", function (severity) {
                    return severity.Id == id;
                });
            }

            function getHandlingTarget(id) {
                return getItem("handlingTargets", function (handlingTarget) {
                    return handlingTarget.Id == id;
                });
            }

            function getItem(cacheKey, predicate) {
                var cached = referenceCache.get(cacheKey), item;

                if (cached) {
                    item = _.find(cached, predicate);
                }
                return item;
            }
            function mapSeverity(severity) {
                severity.Id = parseInt(severity.Id, 10);
                return {
                    Id: severity.Id,
                    Name: severity.Name,
                    Color: (["red", "orange", "#FDEE00"])[severity.Id - 1]
                };
            }

            function mapHandlingTarget(handlingTarget) {
                return {
                    Id: handlingTarget.Id,
                    Name: handlingTarget.Name

                };
            }

            function getHandlingTargets() {
                return getItems(getHandlingTargetQuery(), mapHandlingTarget, "handlingTargets");
            }


            function getSeverities() {
                return getItems(getSeverityQuery(), mapSeverity, "severities");
            }
            function getCheckoutIncidents(checkoutId) {
                var parentId = breeze.Predicate.create("ParentEventId", "==", checkoutId),
                    rowStatus = breeze.Predicate.create("RowStatus", "==", 0);

                var query = getEventsQuery().where(parentId.and(rowStatus))
                                            .orderByDesc("StartTime");

                return entityManager.query(query);
            }


            function saveIncident(incident) {
                var result = simplyLogApiClient.getIncidentResource().then(function (incidentResource) {
                    if (incident.Id) {
                        return incidentResource.update(incident);
                    } else {
                        return incidentResource.create(incident);
                    }

                });

                return result;
            }

            return {
                getCheckoutIncidents: getCheckoutIncidents,
                getHandlingTargets: getHandlingTargets,
                getSeverities: getSeverities,
                getSeverity: getSeverity,
                getHandlingTarget: getHandlingTarget,
                saveIncident: saveIncident
            };

        }
    ];

})(Simple, SimplyLog);
