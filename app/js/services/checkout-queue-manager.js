(function (S, SL) {
    SL.CheckoutQueueManager = ["$q", "$log", "queueManager", "checkoutDataService", function ($q, $log, queueManager, checkoutDataService) {
        var checkoutsQueue = queueManager.get({
            name: "Checkouts",
            processItemAction: sendCheckout
        });

        function sendCheckout(checkout) {
            $log.info("Sending checkout... ", checkout);
            if (checkout == null) {
                var d = $q.defer();
                d.reject("Checkout is null");
                return d.promise;
            }
            
            checkout = mapCheckoutBeforeSend(checkout);

            return checkoutDataService.save(checkout).then(function (item) {
                $log.info("Checkout Sent, ", checkout);
                return item;
            }, function (error) {
                $log.error("Checkout Failed to sent. (Checkout, Error): ", checkout, error);
                return error;
            });
            
        }

        function mapCheckoutBeforeSend(checkout) {
            var mapped = _.extend(checkout);
            mapped.UniqueId = mapped.Id ? mapped.Id : mapped.UniqueId;
            mapped.ReferenceId = mapped.UniqueId;
            mapped.LocationId = mapped.LocationEntityId;
            mapped.LocationType = mapped.LocationEntityType;
            delete mapped.IsNewCheckout;
            delete mapped.LocationEntityId;
            delete mapped.LocationEntityType;
            delete mapped.Id;
            
            return mapped;
        }

        function runCheckoutsQueue(checkout) {
            _.defer(checkoutsQueue.run);
            return checkout;
        }

        function pushCheckout(checkout) {
            return checkoutsQueue.push(checkout).then(runCheckoutsQueue);
        }

        return {            
            run: runCheckoutsQueue,
            push: pushCheckout
        };
    }];
})(Simple, SimplyLog);
