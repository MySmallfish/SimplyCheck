(function (S, SL) {

    SL.IncidentsService = function ($q, utils, entityManager, queueManager, zumoClient, $cacheFactory, $log) {
        var incidentsCache = $cacheFactory("incidents"),
            referenceCache = $cacheFactory("reference");

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

        function getIncidentFromCache(checkoutId, uniqueId) {
            var cachedIncidents = incidentsCache.get(checkoutId);
            if (!cachedIncidents) {
                throw Error("Incidents not loaded!");
            }

            var incident = _.find(cachedIncidents, function (i) { return i.UniqueId == uniqueId; });
            return incident;
        }

        function getIncidentDetails(checkoutId, uniqueId) {
            return $q.when(getIncidentFromCache(checkoutId, uniqueId));
        }
        function sendUpdates() {
            return runSaveQueue();
        }
        
        function mapIncident(incident) {
            var mapped = _.clone(incident);
            if (mapped.Id != 0) {
                mapped.OriginalId = mapped.Id;
                mapped.UniqueId = utils.guid.create();
                mapped.CheckoutId = mapped.ParentEventId;
                delete mapped.ParentEventId;
            } else {
                mapped.ParentEventId = parseInt(mapped.ParentEventId, 10);
            }
            delete mapped.Id;
            mapped.CategoryId = mapped.Category.Id;
            mapped.SeverityId = mapped.Severity.Id;
            if (mapped.HandlingTarget) {
                mapped.HandlingTargetId = parseInt(mapped.HandlingTarget.Id, 10);
            }
            
            
            delete mapped.Category;
            delete mapped.Severity;
            delete mapped.HandlingTarget;

            return mapped;
        }

        function sendIncident(incident) {
            $log.info("Sending incident... ", incident);
            if (incident == null) {
                var d = $q.defer();
                d.reject("Incident is null");
                return d.promise;
            }
            var incidents = zumoClient.getTable("Incidents");
            
            incident = mapIncident(incident);
            
            return $q.when(incidents.insert(incident)).then(function (item) {
                $log.info("Incient Sent, ", incident);
                return item;
            }, function (error) {
                $log.error("Incient Failed to sent. (Incident, Error): ", incident, error);
                return error;
            });

            //var result = $q.defer();

            //result.resolve(incident);
            ////result.reject("NA");
            //return result.promise;
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
        
        function pushIncidentToCache(incident) {
            
            var cachedIncidents = incidentsCache.get(incident.ParentEventId);
            if (!cachedIncidents) {
                cachedIncidents = [];
                incidentsCache.put(incident.ParentEventId, cachedIncidents);
            }
            
            var existingIncidentIndex = -1;
            _.each(cachedIncidents, function (i, index) {
                if (i.UniqueId == incident.UniqueId) {
                    existingIncidentIndex = index;
                }
            });

            if (existingIncidentIndex >= 0) {
                cachedIncidents.splice(existingIncidentIndex, 1);
            } 

            cachedIncidents.push(incident);
            
            
            return incident;
        }

        function runSaveQueue(incident) {
            _.defer(incidentsQueue.run);
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

