(function (S, SL) {

    SL.IncidentsService = function ($q, utils, entityManager, queueManager, zumoClient, $cacheFactory) {
        var incidentsCache = $cacheFactory("incidents"), referenceCache = $cacheFactory("reference");

        function getEventsQuery() {
            return breeze.EntityQuery.from("Event");
        }

        function mapSeverity(severity) {
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

        function getActiveItemsQuery(entity, fields, orderBy) {
            var query = breeze.EntityQuery.from(entity)                              
                              .where("RowStatus", "==", 0)
                              
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

        function getItems(query, mapFunction, cacheKey) {
            var cached = referenceCache.get(cacheKey);
            if (cached) {
                return $q.when(cached);
            } else {
                return $q.when(entityManager.get().executeQuery(query)).then(function (result) {
                    var items = _.map(result.results, mapFunction);
                    referenceCache.put(cacheKey, items);
                    return items;
                });
            }
        }
                
        function getCheckoutIncidentsFromServer(checkoutId) {
            var parentId = breeze.Predicate.create("ParentEventId", "==", checkoutId),
                rowStatus = breeze.Predicate.create("RowStatus", "==", 0);

            var query = getEventsQuery().where(parentId.and(rowStatus))
                                        .orderByDesc("StartTime");
            return $q.when(entityManager.get().executeQuery(query)).then(function (queryResults) {
                var incidents = queryResults.results;
                
                return _.map(incidents, function (incident) {
                    var result = {
                        Id: incident.Id,
                        UniqueId: incident.Id,
                        ParentEventId: checkoutId,
                        Severity: {
                            Id: incident.Severity,
                            Name: incident.Name
                        },
                        Description: incident.Description,
                        DueTime: incident.DueTime,
                        Remarks: incident.Remarks,
                        Category: {
                            Id: incident.CategoryId,
                            Name: incident.CategoryFullName
                        }
                    };
                    pushIncidentToCache(result);
                    return result;
                });
            });
        }
        function getCheckoutIncidents(checkoutId) {
            var cachedIncidents = incidentsCache.get(checkoutId);
            if (cachedIncidents) {
                return $q.when(cachedIncidents);
            } else {
                return getCheckoutIncidentsFromServer(checkoutId);
            }
        }

        function getHandlingTargets() {
            return getItems(getHandlingTargetQuery(), mapHandlingTarget, "handlingTargets");
        }

       
        function getSeverities() {
            return getItems(getSeverityQuery(), mapSeverity, "severities");
        }

        function getNewIncidentDetails(checkoutId, categoryId, siteId) {
            var incidentDetails = {
                Id: 0,
                UniqueId: utils.guid.create(),
                Category: {
                    Id: categoryId
                },
                ParentEventId: checkoutId,
                StartTime: new Date(),
                LocationType: "Site",
                LocationId: siteId
            };

            var defer = $q.defer();
            defer.resolve(incidentDetails);
            return defer.promise;
        }

        function getIncidentDetails(id) {
            var incidentDetails = {
                Id: 1,
                collapsed: true,
                Severity: {
                    Id: 1,
                    Name: "2",
                    Color: "#FF0000"
                },
                DueTime: new Date(),
                Description: "תקלה",
                Remarks: "פעולה",
                HandlingTarget: {
                    Id: 1,
                    Name: "מחלקת התברואה"
                },
                Attachments: [
                    { Index: 1, Url: "https://bt.ylm.co.il/Download.ashx?p=Attachments/Event/386/image[72ec29c9-ff32-4762-96d8-4180d1806663].jpg" },
                    { Index: 2, Url: "https://bt.ylm.co.il/Download.ashx?p=Attachments/Event/386/image[72ec29c9-ff32-4762-96d8-4180d1806663].jpg" },
                    { Index: 3, Url: "https://bt.ylm.co.il/Download.ashx?p=Attachments/Event/386/image[72ec29c9-ff32-4762-96d8-4180d1806663].jpg" },
                    { Index: 4, Url: "https://bt.ylm.co.il/Download.ashx?p=Attachments/Event/386/image[72ec29c9-ff32-4762-96d8-4180d1806663].jpg" }
                ]
            };
            
            var defer = $q.defer();
            defer.resolve(incidentDetails);
            return defer.promise;
        }
        function sendUpdates() {
            return runSaveQueue();
        }
        
        function mapIncident(incident) {
            var mapped = _.clone(incident);
            if (incident.Id == 0) {
                delete incident.Id;
            }
            incident.CategoryId = incident.Category.Id;
            incident.SeverityId = incident.Severity.Id;
            if (incident.HandlingTarget) {
                incident.HandlingTargetId = parseInt(incident.HandlingTarget.Id, 10);
            }

            delete incident.Category;
            delete incident.Severity;
            delete incident.HandlingTarget;

            return incident;
        }

        function sendIncident(incident) {
            if (incident == null) {
                var d = $q.defer();
                d.reject("Incident is null");
                return d.promise;
            }
            var incidents = zumoClient.getTable("Incidents");
            incident = mapIncident(incident);
            console.log("INSERTING", incident);
            return $q.when(incidents.insert(incident));

            var result = $q.defer();

            result.resolve(incident);
            //result.reject("NA");
            return result.promise;
        }

        var incidentsQueue = queueManager.get({
            name: "Incidents",
            processItemAction: sendIncident
        });

        function validate(incident) {
            var result = $q.defer();
            result.resolve(incident);
            return result.promise;
        }

        function runSaveQueue(incident) {
            incidentsQueue.run();
            return incident;
        }

        function pushIncidentToCache(incident) {
            
            var cachedIncidents = incidentsCache.get(incident.ParentEventId);
            if (!cachedIncidents) {
                cachedIncidents = [];
                incidentsCache.put(incident.ParentEventId, cachedIncidents);
            }

            cachedIncidents.push(incident);
            return incident;
        }
        function save(incident) {
            return validate(incident)
                            .then(incidentsQueue.push)
                            .then(pushIncidentToCache)
                            .then(runSaveQueue);
        }

        return {
            getCheckoutIncidents: getCheckoutIncidents,
            getHandlingTargets: getHandlingTargets,
            getSeverities: getSeverities,
            getIncidentDetails: getIncidentDetails,
            getNewIncidentDetails: getNewIncidentDetails,
            save: save,
            validate: validate,
            sendUpdates: sendUpdates,
            sendIncident: sendIncident,
            getSeverity: getSeverity,
            getHandlingTarget: getHandlingTarget
        };
    };
    
})(Simple, SimplyLog);

