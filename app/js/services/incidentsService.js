(function (S, SL) {

    SL.IncidentsService = function ($q, utils, entityManager, queueManager, zumoClient) {
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

        function getItems(query, mapFunction) {
            return $q.when(entityManager.executeQuery(query)).then(function (result) {
                return _.map(result.results, mapFunction);
            });
        }
                
        function getCheckoutIncidents(checkoutId) {
            var parentId = breeze.Predicate.create("ParentEventId", "==", checkoutId),
                rowStatus = breeze.Predicate.create("RowStatus", "==", 0);

            var query = getEventsQuery().where(parentId.and(rowStatus))
                                        .orderByDesc("StartTime");
            return $q.when(entityManager.executeQuery(query)).then(function (queryResults) {
                var incidents = queryResults.results;
                return _.map(incidents, function (incident) {
                    var result = {
                        Id: incident.Id,
                        Severity: {
                            Id: incident.Severity,
                            Name: incident.Name
                        },
                        Description: incident.Description,
                        DueDate: incident.DueDate,
                        Remarks: incident.Remarks,
                        Category: {
                            Id: incident.CategoryId,
                            Name: incident.CategoryFullName
                        }
                    };
                    return result;
                });
            });
        }

        function getHandlingTargets() {
            return getItems(getHandlingTargetQuery(), mapHandlingTarget);
        }

       
        function getSeverities() {
            return getItems(getSeverityQuery(), mapSeverity);
        }

        function getNewIncidentDetails(checkoutId, categoryId) {
            var incidentDetails = {
                Id: 0,
                UniqueId: utils.guid.create(),
                Category: {
                    Id: categoryId
                },
                ParentId: checkoutId
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
                DueDate: new Date(),
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
            if (incident.Id == 0) {
                delete incident.Id;
            }
            incident.CategoryId = incident.Category.Id;
            incident.SeverityId = incident.Severity.Id;
            if (incident.HandlingTarget) {
                incident.HandlingTargetId = incident.HandlingTarget.Id;
            }

            delete incident.Category;
            delete incident.Severity;
            delete incident.HandlingTarget;

            return incident;
        }

        function sendIncident(incident) {
            //if (incident == null) {
            //    var d = $q.defer();
            //    d.reject("Incident is null");
            //    return d.promise;
            //}
            //var incidents = zumoClient.getTable("Incidents");
            //incident = mapIncident(incident);
            //console.log("INSERTING", incident);
            //return $q.when(incidents.insert(incident));
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
            console.log("VALID", incident);
            result.resolve(incident);

            return result.promise;
        }

        function runSaveQueue(incident) {
            incidentsQueue.run();
            return incident;
        }
        function save(incident) {
            return validate(incident)
                            .then(incidentsQueue.push)
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
            sendUpdates: sendUpdates
        };
    };
    
})(Simple, SimplyLog);

