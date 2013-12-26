(function (S, SL) {
    SL.IncidentsService = function ($q, $cacheFactory, $log, utils, queueManager, incidentDataService) {
        var incidentsCache = $cacheFactory("incidents");

        function mapCheckoutIncidents(checkoutId, queryResults) {
            var incidents = queryResults.results;

            return _.map(incidents, function (incident) {
                var result = {
                    Id: incident.Id,
                    UniqueId: incident.Id,
                    ParentEventId: parseInt(checkoutId, 10),
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
        }

        function getCheckoutIncidentsFromServer(checkoutId) {
            return incidentDataService.getCheckoutIncidents(checkoutId).then(function(queryResults) {
                return mapCheckoutIncidents(checkoutId, queryResults);
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

        function getNewIncidentDetails(checkout, categoryId) {
            var incidentDetails = {
                Id: 0,
                UniqueId: utils.guid.create(),
                Category: {
                    Id: categoryId
                },
                StartTime: new Date(),
                LocationType: checkout.LocationEntityType,
                LocationId: checkout.LocationEntityId
            };
            
            if (checkout.IsNewCheckout) {
                incidentDetails.ParentEventId = incidentDetails.ParentEventReferenceId = checkout.Id;
            }

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
            return queueManager.run();
        }

        function mapIncident(incident) {
            var mapped = _.clone(incident);
            
            if (mapped.Id != 0) {
                mapped.OriginalId = mapped.Id;
                mapped.UniqueId = utils.guid.create();
            }
            delete mapped.Id;

            if (mapped.ParentEventReferenceId === mapped.ParentEventId) {
                delete mapped.ParentEventId;
            }

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

            incident = mapIncident(incident);

            return incidentDataService.saveIncident(incident);
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
            console.log("Incident", incident);
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

        function save(incident) {
            return validate(incident)
                            .then(incidentsQueue.push)
                            .then(pushIncidentToCache)
                            .then(function () {
                                incidentsQueue.run();
                                return $q.when(incident);
                            });
        }

        return {
            getCheckoutIncidents: getCheckoutIncidents,
            getIncidentDetails: getIncidentDetails,
            getNewIncidentDetails: getNewIncidentDetails,
            save: save,
            validate: validate,
            sendUpdates: sendUpdates,
            sendIncident: sendIncident,
            getHandlingTargets: function () {
                return incidentDataService.getHandlingTargets();
            },
            getSeverities: function () {
                return incidentDataService.getSeverities();
            },
            getSeverity: function (id) {
                return incidentDataService.getSeverity(id);
            },
            getHandlingTarget: function (id) {
                return incidentDataService.getHandlingTarget(id);
            }
        };
    };

})(Simple, SimplyLog);

