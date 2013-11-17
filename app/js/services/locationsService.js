(function (S, SL) {

    SL.LocationsService = function ($q) {

        function getSitePermits(siteId) {
            var items = [
                {
                    Id: 1,
                    HasPermit: true,
                    EffectiveDate: new Date(),
                    Type: {
                        Id: 2,
                        Name: "אמצעי כיבוי",
                        DaysDuration: 180
                    }
                },
                {
                    Id: 0,
                    EffectiveDate: null,
                    Type: {
                        Id: 2,
                        Name: "יציבות המבנה",
                        DaysDuration: 120
                    },
                    Attachments: [
                        { Index: 1, Url: "https://bt.ylm.co.il/Download.ashx?p=Attachments/Event/386/image[72ec29c9-ff32-4762-96d8-4180d1806663].jpg" },
                        { Index: 2, Url: "https://bt.ylm.co.il/Download.ashx?p=Attachments/Event/386/image[72ec29c9-ff32-4762-96d8-4180d1806663].jpg" }]
                },
                {
                    Id: 2,
                    HasPermit: true,
                    EffectiveDate: new Date(),
                    Type: {
                        Id: 2,
                        Name: "מכשירי חשמל ומתקני חשמל - בדיקה ויזואלית חשמלאי מוסמך",
                        DaysDuration: 80
                    },
                    Attachments: [
                        { Index: 1, Url: "https://bt.ylm.co.il/Download.ashx?p=Attachments/Event/386/image[72ec29c9-ff32-4762-96d8-4180d1806663].jpg" },
                        { Index: 2, Url: "https://bt.ylm.co.il/Download.ashx?p=Attachments/Event/386/image[72ec29c9-ff32-4762-96d8-4180d1806663].jpg" },
                        { Index: 3, Url: "https://bt.ylm.co.il/Download.ashx?p=Attachments/Event/386/image[72ec29c9-ff32-4762-96d8-4180d1806663].jpg" },
                    ]
                },
            ];
            var defer = $q.defer();
            defer.resolve(items);
            return defer.promise;
        }

        function getSites(employeeId) {
            var items = [
            {
                Id: 1,
                Name: "ביס 1",
                SiteGeoGroup: {
                    Id: 1,
                    Name: "בתי ספר"
                },
                Address: "ילדי טהרן 6"
            },
            {
                Id: 2,
                Name: "ביס 2",
                SiteGeoGroup: {
                    Id: 1,
                    Name: "בתי ספר"
                },
                Address: "צעירי בגדאד 12"
            },
            {
                Id: 3,
                Name: "גן 1",
                SiteGeoGroup: {
                    Id: 2,
                    Name: "גני ילדים"
                },
                Address: "זקני תימן 142"
            },
            {
                Id: 4,
                Name: "מקלט 1",
                SiteGeoGroup: {
                    Id: 3,
                    Name: "מקלטים"
                },
                Address: "בן טולילה 16"
            },
            ];
            var defer = $q.defer();
            defer.resolve(items);
            return defer.promise;
        }

        return {
            getSites: getSites,
            getSitePermits: getSitePermits
        };
    };

})(Simple, SimplyLog);
