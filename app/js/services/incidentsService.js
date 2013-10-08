(function (S, SL) {

    SL.IncidentsService = function ($q) {

        function getCheckoutIncidents(checkoutId) {
            var incidents = [
                {
                    Id: 1,
                    collapsed: true,
                    Severity: {
                        Id: 1,
                        Name: "2"
                    },
                    DueDate: new Date(),
                    Description: "תקלה",
                    Remarks: "פעולה",
                    HandlingTarget: {
                        Id: 1,
                        Name: "מחלקת התברואה"
                    },
                    Attachments: [
                        "https://bt.ylm.co.il/Download.ashx?p=Attachments/Event/387/image[7cb75f74-9100-4f47-8660-dc5106ad26cd].jpg",
                        "https://bt.ylm.co.il/Download.ashx?p=Attachments/Event/386/image[f493e335-ec11-4bce-85a0-4546adf023bf].jpg&s=86x64"
                    ]
                },
                {
                    Id: 2,
                    collapsed: true,
                    Severity: {
                        Id: 2,
                        Name: "2"
                    },
                    DueDate: new Date(),
                    Description: "תקלה",
                    Remarks: "פעולה",
                    HandlingTarget: {
                        Id: 1,
                        Name: "מחלקת התברואה"
                    },
                    Attachments: [
                        "https://bt.ylm.co.il/Download.ashx?p=Attachments/Event/387/image[7cb75f74-9100-4f47-8660-dc5106ad26cd].jpg",
                        "https://bt.ylm.co.il/Download.ashx?p=Attachments/Event/386/image[f493e335-ec11-4bce-85a0-4546adf023bf].jpg&s=86x64"
                    ]
                },
            ];
            
            var defer = $q.defer();
            defer.resolve(incidents);
            return defer.promise;
        }

        function getHandlingTargets() {
            var items =
            [
                {
                    Id: 1,
                    Name: "Dept 1"
                },
                {
                    Id: 2,
                    Name: "Dept 2"
                },
                {
                    Id: 3,
                    Name: "Dept 3"
                },
                {
                    Id: 4,
                    Name: "Dept 4"
                }
            ];
            
            var defer = $q.defer();
            defer.resolve(items);
            return defer.promise;
        }

        function getSeverities() {
            var items = [
                {
                    Id: 1,
                    Name: "1",
                    Color: "red"
                },
                {
                    Id: 2,
                    Name: "2",
                    Color: "orange"
                },
                {
                    Id: 3,
                    Name: "3",
                    Color: "#FDEE00"
                }];
            var defer = $q.defer();
            defer.resolve(items);
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

        return {
            getCheckoutIncidents: getCheckoutIncidents,
            getHandlingTargets: getHandlingTargets,
            getSeverities: getSeverities,
            getIncidentDetails: getIncidentDetails
        };
    };
    
})(Simple, SimplyLog);

