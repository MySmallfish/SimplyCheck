(function (S, SL) {

    SL.CheckoutService = function ($q, incidentsService, entityManager, $cacheFactory) {
        var checkoutsCache = $cacheFactory("checkouts"),
            checkoutDetailsCache = $cacheFactory("checkoutDetails", { capacity: 50 }),
            categoriesCache = $cacheFactory("categories");

        function getCheckoutQuery() {
            var query = breeze.EntityQuery.from("Checkout").select([
                           "Id", "Description",
                           "LocationFullName", "LocationEntityId", "LocationEntityType", "LocationPath", "LocationLevel1",
                           "ChildEvents", "OpenChildrenCount",
                           "FreeText1", "FreeText2",
                           "StartTime", "CloseTime", "DueTime",
                           "Status",
                           "CategoryId", "EventCategoryName"
            ]);
            return query;
        }

        function clearCache() {
            checkoutsCache.removeAll();
            checkoutDetailsCache.removeAll();
            categoriesCache.removeAll();
        }
        function getCheckouts(employeeId, siteId) {
            var query = getCheckoutQuery();
            var result = null;
            var cached = checkoutsCache.get("checkouts");

            if (cached) {
                result = $q.when(cached);
            } else {
                result = $q.when(entityManager.get().executeQuery(query)).then(function (data) {
                    var items = _.map(data.results, mapCheckout);

                    checkoutsCache.put("checkouts", items);
                    return items;

                }, function (err) {
                    console.error(err);
                });
            }

            if (siteId) {
                result = result.then(function (items) {
                    return _.where(items, { siteId: siteId });
                });
            }

            return result;
        }

        function mapCheckout(item) {
            return {
                id: parseInt(item.Id, 10),
                header: item.LocationLevel1,
                siteId: item.LocationEntityId,
                status: item.Status == 1 ? (item.ChildEvents > 0) ? 1 : 0 : 2,
                count: item.ChildEvents,
                open: item.OpenChildrenCount,
                date: item.StartTime
            };
        }

        function mapCategory(category) {
            return {
                Id: category.Id,
                ParentId: category.ParentId,
                Name: category.Name,
                Text: category.Remarks,
                Collapsed: false,
                toggleCollapsed: function () {
                    this.Collapsed = !this.Collapsed;
                    if (this.Collapsed) {
                        if (this.Items) {
                            _.each(this.Items, function (item) {
                                item.Collapsed = true;
                            })
                        }
                    } else {
                        if (this.Items && this.Items[0]) {
                            this.Items[0].Collapsed = false;
                        }
                    }
                }
            };
        }

        function createMap(items) {
            var map = {};
            _.each(items, function (item) {
                map[item.Id] = item;
            });
            return map;
        }

        function assignIncidents(map, incidents) {
            incidentsService.getSeverities().then(function (severities) {

                _.each(incidents, function (incident) {
                    var category = map[incident.Category.Id];
                    if (category) {
                        category.Incidents = category.Incidents || [];
                        category.Incidents.push(incident);
                    }
                    var severityId = incident.Severity.Id;
                    
                    incident.Severity = _.find(severities, function (s) { return s.Id == severityId; });
                    
                });
            });
        }

        function prepareCheckoutViewModel(items, checkout, incidents) {
            var map = createMap(items);
            
            assignIncidents(map, incidents);

            var checkoutViewModel = {
                Items: buildHierarchy(map, checkout.CategoryId),
                Type: checkout.EventCategoryName,
                Site: {
                    Id: checkout.LocationEntityId,
                    Name: checkout.LocationLevel1,
                    FullName: checkout.LocationFullName
                }
            };
            return checkoutViewModel;
        }

        function buildHierarchy(map, rootId) {
            var root = [];
            _.each(map, function (item) {
                if (item.ParentId != rootId) {
                    var parent = map[item.ParentId];
                    parent.Items = parent.Items || [];
                    parent.Items.push(item);
                } else {
                    root.push(item);
                }
            });
            return root;
        }
        function getCheckoutSiteId(checkoutId) {
            
            var cached = checkoutDetailsCache.get(checkoutId);
            
            if (!cached) {
                throw Error("The checkout has not been loaded.");
            }
            return cached.LocationEntityId;
        }

        function getCheckout(id) {
            id = parseInt(id, 10);
            var cached = checkoutDetailsCache.get(id),
                checkout;
            if (cached) {
                checkout = $q.when(cached);
            } else {
                checkout = $q.when(entityManager.get().fetchEntityByKey("Checkout", id, true)).then(function (item) {
                    item = item.entity;
                    if (item) {
                        checkoutDetailsCache.put(id, item);
                    }
                    return item;
                });
            }
            return $q.all([checkout.then(function (checkout) {
                
                if (checkout) {
                    var rootCategoryId = parseInt(checkout.CategoryId, 10);
                    var categoriesQuery = breeze.EntityQuery.from("Category").where("RootId", "equals", rootCategoryId),
                        cachedCategories = categoriesCache.get(rootCategoryId);
                    
                     var categoriesPromise = cachedCategories ? $q.when(cachedCategories) : $q.when(entityManager.get().executeQuery(categoriesQuery)).then(function (cats) {
                            categoriesCache.put(rootCategoryId, cats);
                            return cats;
                        });
                     return categoriesPromise.then(function (categories) {
                         
                        return {
                            checkout: checkout, categories: _.map(categories.results, mapCategory)
                        };
                    });
                } else {
                    return $q.when({});
                }
            }), incidentsService.getCheckoutIncidents(id)]).then(function (results) {
                var checkout = results[0].checkout, items = results[0].categories, incidents = results[1];
                
                var result = prepareCheckoutViewModel(items, checkout, incidents);
                return result;
            });

        }

        return {
            getCheckouts: getCheckouts,
            getCheckout: getCheckout,
            clearCache: clearCache,
            getCheckoutSiteId: getCheckoutSiteId
        };
    };

})(Simple, SimplyLog);
