(function (S, SL) {

    SL.CheckoutDataService = [
        "entityManager", function(entityManager) {

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

            return {
                getCheckouts: getCheckouts,
                getCheckoutCategories: getCheckoutCategories,
                getCheckout: getCheckout
            };

        }
    ];

})(Simple, SimplyLog);
