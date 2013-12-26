(function (S, SL) {

    SL.CheckoutDataService = [
        "entityManager", "simplyLogApiClient", function (entityManager, simplyLogApiClient) {

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

            function getCheckouts() {
                var query = getCheckoutQuery();
                return entityManager.query(query);
            }

            function getCheckoutCategories(rootCategoryId) {
                var categoriesQuery = breeze.EntityQuery.from("Category").select(["Id", "Name", "Remarks", "ParentId", "RootId"]).where("RootId", "equals", rootCategoryId);
                return entityManager.query(categoriesQuery);
            }

            function getCheckout(id) {
                return entityManager.getByKey("Checkout", id, true);
            }

            function save(checkout) {
                var result = simplyLogApiClient.getIncidentResource().then(function (incidentResource) {
                    if (checkout.Id) {
                        return incidentResource.update(checkout);
                    } else {
                        return incidentResource.create(checkout);
                    }

                });

                return result;

            }

            return {
                getCheckouts: getCheckouts,
                getCheckoutCategories: getCheckoutCategories,
                getCheckout: getCheckout,
                save: save
            };

        }
    ];

})(Simple, SimplyLog);
