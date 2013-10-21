(function (S) {
    // Add limits
    // Add send one time only
    // Add uniqueness (set - an item can only be added once)
    S.QueueManager = function($q, storageService) {
        var queues = {};

        function createQueue(options) {
            var queueName = "queue::" + options.name,
                pendingQueueName = queueName + "::" + "pending",
                processItemAction = options.processItemAction,
                inProcess, latestPush;

            function push(item) {
                var pushAction = function () {
                    return storageService.local(queueName).then(function (queueItems) {

                        queueItems = queueItems || [];

                        queueItems.push(item);
                        return queueItems;
                    }).then(function (queueItems) {
                        return storageService.local(queueName, queueItems).then(function (items) {
                            return item;
                        });
                    });
                };

                if (latestPush) {
                    latestPush = latestPush.then(pushAction);
                } else {
                    latestPush = pushAction();
                }

                return latestPush;
            }

            function processQueue() {
                if (!inProcess) {
                    inProcess = true;
                    return storageService.local(pendingQueueName).then(function (items) {
                        return $q.all(_.map(items, function (item) {
                            return processItemAction(item);
                        }));
                    }).then(function () {
                        return storageService.local(pendingQueueName, null).then(function () {
                            inProcess = false;
                        });
                    });
                } else {
                    return $q.when({});
                }
            }

            function run() {
                var runAction = function () {
                    return storageService.local(pendingQueueName).then(function (pending) {
                        if (!pending || pending.length == 0) {
                            return storageService.local(queueName).then(function (queueItems) {
                                return storageService.local(pendingQueueName, queueItems).then(function () {
                                    return storageService.local(queueName, null).then(processQueue);
                                });
                            });
                        } else {
                            return processQueue();
                        }
                    });
                };

                if (latestPush) {
                    latestPush = latestPush.then(runAction);
                } else {
                    latestPush = runAction();
                }

                return latestPush;
            }

            return {
                push: push,
                run: run
            };
        }
        return {
            get: function (options) {
                return queues[options.name] || createQueue(options);
            }
        };
    };
})(Simple);
