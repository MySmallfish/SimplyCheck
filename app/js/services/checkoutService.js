(function (S, SL) {

    SL.CheckoutService = function ($q, incidentsService, entityManager) {
        function getCheckoutQuery() {
            var query = breeze.EntityQuery.from("Checkout").select([
                           "Id", "Description",
                           "LocationFullName", "LocationEntityId", "LocationEntityType", "LocationPath", "LocationLevel1",
                           "ChildEvents", "OpenChildrenCount",
                           "FreeText1", "FreeText2",
                           "StartTime", "CloseTime", "DueTime",
                           "Status",
                           "CategoryId"
            ]);
            return query;
        }

        function mapCheckout(item) {
            return {
                id: parseInt(item.Id,10),
                header: item.LocationLevel1,
                status: item.Status == 1 ? (item.ChildEvents > 0)?1: 0 : 2,
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
            _.each(incidents, function (incident) {
                var category = map[incident.Category.Id];
                if (category) {
                    category.Incidents = category.Incidents || [];
                    category.Incidents.push(incident);
                }
            });
        }

        function prepareCheckoutViewModel(items, checkout, incidents) {
            var map = createMap(items);

            assignIncidents(map, incidents);

            var checkoutViewModel = {
                Items: buildHierarchy(map, checkout.CategoryId),
                Site: {
                    Id: checkout.LocationEntityId,
                    Name: checkout.LocationFullName
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

        function getCheckouts(employeeId) {
            var query = getCheckoutQuery();
           
            return $q.when(entityManager.get().executeQuery(query)).then(function (data) {
                return _.map(data.results, mapCheckout);
            }, function (err) {
                console.error(err);
            });


        }

        function getCheckout(id) {
            id = parseInt(id, 10);
            
            return $q.all([ $q.when(entityManager.get().fetchEntityByKey("Checkout", id, true)).then(function (checkout) {
                checkout = checkout.entity;
                if (checkout) {
                    var categoriesQuery = breeze.EntityQuery.from("Category").where("RootId", "equals", parseInt(checkout.CategoryId, 10));
                    return $q.when(entityManager.get().executeQuery(categoriesQuery)).then(function (categories) {
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
            getCheckout: getCheckout
        };
    };

})(Simple, SimplyLog);
