﻿(function (S, SL) {

    SL.CheckoutService = function ($q, incidentsService, $cacheFactory, locationsService, utils, checkoutQueueManager, checkoutDataService) {

        var checkoutsCache = $cacheFactory("checkouts"),
            checkoutDetailsCache = $cacheFactory("checkoutDetails", { capacity: 50 }),
            categoriesCache = $cacheFactory("categories");

        function clearCache() {
            checkoutsCache.removeAll();
            checkoutDetailsCache.removeAll();
            categoriesCache.removeAll();
        }

        function addCheckoutToCache(checkout) {
            var cache = checkoutsCache.get("checkouts") || [];
            var mappedCheckout = mapCheckout(checkout);
            cache.push(mappedCheckout);

        }

        function getCheckouts(employeeId, siteId) {
            var result = null;
            var cached = checkoutsCache.get("checkouts");

            if (cached) {
                result = $q.when(cached);
            } else {
                result = checkoutDataService.getCheckouts().then(function (data) {
                    var items = _.map(data.results, mapCheckout);

                    checkoutsCache.put("checkouts", items);
                    return items;

                });
            }

            if (siteId) {
                result = result.then(function (items) {
                    return _.where(items, { siteId: parseInt(siteId, 10) });
                });
            }

            return result;
        }

        function mapCheckout(item) {
            return {
                id: item.Id,
                header: item.LocationLevel1,
                siteId: parseInt(item.LocationEntityId, 10),
                status: item.Status == 1 ? (item.ChildEvents > 0) ? 1 : 0 : 2,
                count: item.ChildEvents,
                open: item.OpenChildrenCount,
                date: item.StartTime
            };
        }

        function mapCategory(category, index) {

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
                            });
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
                item.Collapsed = true;
                if (item.ParentId != rootId) {
                    var parent = map[item.ParentId];
                    parent.Items = parent.Items || [];
                    parent.Items.push(item);
                } else {
                    root.push(item);
                }
            });
            if (root.length) {

                root[0].toggleCollapsed();

            }
            return root;
        }


        function getCheckoutCategories(rootCategoryId) {
            var cachedCategories = categoriesCache.get(rootCategoryId);

            var categoriesPromise = cachedCategories ? $q.when(cachedCategories) :
                checkoutDataService.getCheckoutCategories(rootCategoryId).then(function (cats) {
                    categoriesCache.put(rootCategoryId, cats);
                    return cats;
                });

            return categoriesPromise;
        }

        function createNewCheckout(rootCategoryId, siteId) {
            var checkout = {
                Id: utils.guid.create(),
                CategoryId: rootCategoryId,
                StartTime: new Date(),
                Status: 1,
                EventCategoryName: "מבדק בטיחות", // SHOULD BE CategoryName
                SeverityId: 4,
                IsNewCheckout: true
        };
            checkout.Description = checkout.EventCategoryName;

            return locationsService.getSite(siteId).then(function (site) {
                checkout.LocationEntityId = site.Id;
                checkout.LocationEntityType = "Site";
                checkout.LocationFullName = checkout.LocationLevel1 = site.Name;

                addCheckoutToCache(checkout);
                checkoutDetailsCache.put(checkout.Id, checkout);
                checkoutQueueManager.push(checkout);

                return checkout;
            });
        }

        function getCheckoutById(id) {
            return checkoutDetailsCache.get(id);
        }

        function getCheckout(id) {
            //id =  ;

            var cached = getCheckoutById(id),
                checkoutPromise;
            if (cached) {
                checkoutPromise = $q.when(cached);
            } else {
                checkoutPromise = checkoutDataService.getCheckout(id).then(function (item) {
                    item = item.entity;
                    if (item) {
                        checkoutDetailsCache.put(id, item);
                    }
                    return item;
                });
            }
            return $q.all([checkoutPromise.then(function (checkout) {

                if (checkout) {
                    var rootCategoryId = parseInt(checkout.CategoryId, 10);

                    return getCheckoutCategories(rootCategoryId).then(function (categories) {

                        return {
                            checkout: checkout, categories: _.map(categories.results, mapCategory)
                        };
                    });
                } else {
                    return $q.when({});
                }
            }), incidentsService.getCheckoutIncidents(id)]).then(function (results) {
                var checkoutItem = results[0].checkout, items = results[0].categories, incidents = results[1];

                var result = prepareCheckoutViewModel(items, checkoutItem, incidents);
                return result;
            });

        }

        function sendUpdates() {
            var result = checkoutQueueManager.run();
            return result;
        }

        return {
            getCheckouts: getCheckouts,
            getCheckout: getCheckout,
            getCheckoutById: getCheckoutById,
            clearCache: clearCache,
            getCheckoutCategories: getCheckoutCategories,
            createNewCheckout: createNewCheckout,
            sendUpdates: sendUpdates
        };
    };

})(Simple, SimplyLog);
