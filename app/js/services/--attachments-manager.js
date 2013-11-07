(function(S, SL) {
    SL.AttachmentsManager = function($q,remoteStorage, zumoClient) {

        //var q = queueManager.get({
        //    name: "test",
        //    processItemAction: function(item) {
        //        console.log("processing...", item);
        //        return $q.when(item).then(function(i) {
        //            console.log("ITEM: ", i);
        //        });
        //    }
        //});
        ////q.run();
        //q.push(1);
        //q.push(2);
        //q.push(3);
        //q.push(4);
        //networkManager.runOnline(function () {
        //    console.log("RIN");
        //    return q.run();
        //});

        //network.simulateOffline();

        //q.push(5);
        //q.push(6);
        //networkManager.runOnline(function () {
        //    console.log("RUN");
        //    return q.run();
        //});

        //q.push(7);
        //q.push(8);
        //networkManager.runOnline(function () {
        //    console.log("RUN 2");
        //    return q.run();
        //});

        //network.simulateOnline();
        //network.clearSimulation();
        //return;

        //var attachments = zumoClient.getTable("Attachments");
        //attachments.insert({
        //    entityName: "Event",
        //    contentType: "image/jpg",
        //    fileName: "test.jpg"
        //}).then(function (results) {
        //    console.log("REUSLT", results);
        //}, function (error) {
        //    console.log("ERROR", error);
        //});
    };
    //var items = [
    //    {
    //        id: 1,
    //        header: 'אורט חט"ב',
    //        status: 0,
    //        count: 5,
    //        open: 2,
    //        date: new Date(2013, 6, 6)
    //    },
    //    {
    //        id: 2,
    //        header: 'אור לציון',
    //        status: 2,
    //        count: 10,
    //        open: 3,
    //        date: new Date(2013, 6, 6)
    //    },
    //    {
    //        id: 3,
    //        header: 'גן האורן',
    //        status: 1,
    //        count: 34,
    //        open: 20,
    //        date: new Date(2013, 5, 23)
    //    },
    //    {
    //        id: 4,
    //        header: 'הגלבוע',
    //        status: 1,
    //        count: 12,
    //        date: new Date(2013, 2, 10)
    //    },
    //    {
    //        id: 5,
    //        header: 'הצורן',
    //        status: 2,
    //        count: 7,
    //        date: new Date(2013, 8, 12)
    //    },
    //    {
    //        id: 6,
    //        header: 'שתי גדות לירדן זו שלנו שו גם כן',
    //        status: 0,
    //        count: 23,
    //        date: new Date(2012, 10, 6)
    //    },
    //    {
    //        id: 7,
    //        header: 'אורט חט"ב',
    //        status: 0,
    //        count: 3,
    //        date: new Date(2012, 11, 31)
    //    },
    //    {
    //        id: 8,
    //        header: 'גולדה',
    //        status: 2,
    //        count: 6,
    //        date: new Date(2010, 2, 26)
    //    },
    //    {
    //        id: 9,
    //        header: 'בית ספר פח',
    //        status: 1,
    //        count: 60,
    //        date: new Date(2010, 2, 10)
    //    },
    //];

    //var defer = $q.defer();
    //defer.resolve(items);
    //return defer.promise;

    //var items = [
    //{
    //    Id: 3,
    //    Name: "פרק 2 :הסביבה החיצונית",
    //    Items: [
    //        {
    //            Name: "מיקום המוסד",
    //            Items: [
    //                {
    //                    Id: 3,
    //                    collapsed: true,
    //                    Valid: true,
    //                    Name: "2.1",
    //                    Text: "לא יהיו בקרבת המוסד מקורות המהווים מפגעי בטיחות, גהות או סיכונים פוטנציאלים (רעש, צחנה, זיהום אוויר, מכלים חשופים של גז, דלק, עגורנים. .. ואחרים)"
    //                },
    //                {
    //                    Id: 3,
    //                    collapsed: true,
    //                    Valid: false,
    //                    Name: "2.2",
    //                    Text: "לא יעברו קווי מתח גבוה בקרבת המוסד, במידה וקיים קו במרחק הקטן מ-50 מטר יש לבדקו ע״י בודק מוסמך (קרינה וכיו״ב) בכל מקרה מרחק קו מתח גבוה מחצר המוסד לא יפחת מ-5 מטר."
    //                },
    //                { Name: "2.2", Text: "לא יעברו קווי מתח גבוה בקרבת המוסד, במידה וקיים קו במרחק הקטן מ-50 מטר יש לבדקו ע״י בודק מוסמך (קרינה וכיו״ב) בכל מקרה מרחק קו מתח גבוה מחצר המוסד לא יפחת מ-5 מטר." },
    //                { Id: 3, collapsed: true, Valid: true, Name: "2.2", Text: "לא יעברו קווי מתח גבוה בקרבת המוסד, במידה וקיים קו במרחק הקטן מ-50 מטר יש לבדקו ע״י בודק מוסמך (קרינה וכיו״ב) בכל מקרה מרחק קו מתח גבוה מחצר המוסד לא יפחת מ-5 מטר." },
    //                { Id: 3, collapsed: true, Valid: true, Name: "2.2", Text: "לא יעברו קווי מתח גבוה בקרבת המוסד, במידה וקיים קו במרחק הקטן מ-50 מטר יש לבדקו ע״י בודק מוסמך (קרינה וכיו״ב) בכל מקרה מרחק קו מתח גבוה מחצר המוסד לא יפחת מ-5 מטר." },
    //                { Id: 3, collapsed: true, Valid: false, Name: "2.2", Text: "לא יעברו קווי מתח גבוה בקרבת המוסד, במידה וקיים קו במרחק הקטן מ-50 מטר יש לבדקו ע״י בודק מוסמך (קרינה וכיו״ב) בכל מקרה מרחק קו מתח גבוה מחצר המוסד לא יפחת מ-5 מטר." }]
    //        }]
    //},
    //{
    //    Name: "פרק 2 :הסביבה החיצונית",
    //    Items: [
    //        {
    //            Name: "מיקום המוסד",
    //            Items: [
    //                { Id: 3, collapsed: true, Valid: true, Name: "2.1", Text: "לא יהיו בקרבת המוסד מקורות המהווים מפגעי בטיחות, גהות או סיכונים פוטנציאלים (רעש, צחנה, זיהום אוויר, מכלים חשופים של גז, דלק, עגורנים. .. ואחרים)" },
    //                { Id: 3, collapsed: true, Valid: false, Name: "2.2", Text: "לא יעברו קווי מתח גבוה בקרבת המוסד, במידה וקיים קו במרחק הקטן מ-50 מטר יש לבדקו ע״י בודק מוסמך (קרינה וכיו״ב) בכל מקרה מרחק קו מתח גבוה מחצר המוסד לא יפחת מ-5 מטר." },
    //                { Name: "2.2", Text: "לא יעברו קווי מתח גבוה בקרבת המוסד, במידה וקיים קו במרחק הקטן מ-50 מטר יש לבדקו ע״י בודק מוסמך (קרינה וכיו״ב) בכל מקרה מרחק קו מתח גבוה מחצר המוסד לא יפחת מ-5 מטר." },
    //                { Id: 3, collapsed: true, Valid: true, Name: "2.2", Text: "לא יעברו קווי מתח גבוה בקרבת המוסד, במידה וקיים קו במרחק הקטן מ-50 מטר יש לבדקו ע״י בודק מוסמך (קרינה וכיו״ב) בכל מקרה מרחק קו מתח גבוה מחצר המוסד לא יפחת מ-5 מטר." },
    //                { Id: 3, collapsed: true, Valid: true, Name: "2.2", Text: "לא יעברו קווי מתח גבוה בקרבת המוסד, במידה וקיים קו במרחק הקטן מ-50 מטר יש לבדקו ע״י בודק מוסמך (קרינה וכיו״ב) בכל מקרה מרחק קו מתח גבוה מחצר המוסד לא יפחת מ-5 מטר." },
    //                { Id: 3, collapsed: true, Valid: false, Name: "2.2", Text: "לא יעברו קווי מתח גבוה בקרבת המוסד, במידה וקיים קו במרחק הקטן מ-50 מטר יש לבדקו ע״י בודק מוסמך (קרינה וכיו״ב) בכל מקרה מרחק קו מתח גבוה מחצר המוסד לא יפחת מ-5 מטר." }]
    //        }]
    //},
    //{
    //    Name: "פרק 2 :הסביבה החיצונית",
    //    Items: [
    //        {
    //            Name: "מיקום המוסד",
    //            Items: [
    //                { Id: 3, collapsed: true, Valid: true, Name: "2.1", Text: "לא יהיו בקרבת המוסד מקורות המהווים מפגעי בטיחות, גהות או סיכונים פוטנציאלים (רעש, צחנה, זיהום אוויר, מכלים חשופים של גז, דלק, עגורנים. .. ואחרים)" },
    //                { Id: 3, collapsed: true, Valid: false, Name: "2.2", Text: "לא יעברו קווי מתח גבוה בקרבת המוסד, במידה וקיים קו במרחק הקטן מ-50 מטר יש לבדקו ע״י בודק מוסמך (קרינה וכיו״ב) בכל מקרה מרחק קו מתח גבוה מחצר המוסד לא יפחת מ-5 מטר." },
    //                { Name: "2.2", Text: "לא יעברו קווי מתח גבוה בקרבת המוסד, במידה וקיים קו במרחק הקטן מ-50 מטר יש לבדקו ע״י בודק מוסמך (קרינה וכיו״ב) בכל מקרה מרחק קו מתח גבוה מחצר המוסד לא יפחת מ-5 מטר." },
    //                { Id: 3, collapsed: true, Valid: true, Name: "2.2", Text: "לא יעברו קווי מתח גבוה בקרבת המוסד, במידה וקיים קו במרחק הקטן מ-50 מטר יש לבדקו ע״י בודק מוסמך (קרינה וכיו״ב) בכל מקרה מרחק קו מתח גבוה מחצר המוסד לא יפחת מ-5 מטר." },
    //                { Id: 3, collapsed: true, Valid: true, Name: "2.2", Text: "לא יעברו קווי מתח גבוה בקרבת המוסד, במידה וקיים קו במרחק הקטן מ-50 מטר יש לבדקו ע״י בודק מוסמך (קרינה וכיו״ב) בכל מקרה מרחק קו מתח גבוה מחצר המוסד לא יפחת מ-5 מטר." },
    //                { Id: 3, collapsed: true, Valid: false, Name: "2.2", Text: "לא יעברו קווי מתח גבוה בקרבת המוסד, במידה וקיים קו במרחק הקטן מ-50 מטר יש לבדקו ע״י בודק מוסמך (קרינה וכיו״ב) בכל מקרה מרחק קו מתח גבוה מחצר המוסד לא יפחת מ-5 מטר." }]
    //        }]
    //},
    //];

    //var defer = $q.defer();

    //incidentsService.getCheckoutIncidents(id).then(function (incidnets) {
    //    // match incidents...
    //    defer.resolve({
    //        Items: items,
    //        Site: {
    //            Id: 4,
    //            Name: "אור לציון"
    //        }
    //    });
    //});

    //return defer.promise;

    //var incidents = [
    //{
    //    Id: 1,
    //    collapsed: true,
    //    Severity: {
    //        Id: 1,
    //        Name: "2"
    //    },
    //    DueDate: new Date(),
    //    Description: "תקלה",
    //    Remarks: "פעולה",
    //    HandlingTarget: {
    //        Id: 1,
    //        Name: "מחלקת התברואה"
    //    },
    //    Attachments: [
    //        "https://bt.ylm.co.il/Download.ashx?p=Attachments/Event/387/image[7cb75f74-9100-4f47-8660-dc5106ad26cd].jpg",
    //        "https://bt.ylm.co.il/Download.ashx?p=Attachments/Event/386/image[f493e335-ec11-4bce-85a0-4546adf023bf].jpg&s=86x64"
    //    ]
    //},
    //{
    //    Id: 2,
    //    collapsed: true,
    //    Severity: {
    //        Id: 2,
    //        Name: "2"
    //    },
    //    DueDate: new Date(),
    //    Description: "תקלה",
    //    Remarks: "פעולה",
    //    HandlingTarget: {
    //        Id: 1,
    //        Name: "מחלקת התברואה"
    //    },
    //    Attachments: [
    //        "https://bt.ylm.co.il/Download.ashx?p=Attachments/Event/387/image[7cb75f74-9100-4f47-8660-dc5106ad26cd].jpg",
    //        "https://bt.ylm.co.il/Download.ashx?p=Attachments/Event/386/image[f493e335-ec11-4bce-85a0-4546adf023bf].jpg&s=86x64"
    //    ]
    //},
    //];

    //var defer = $q.defer();
    //defer.resolve(incidents);
    //return defer.promise;

 //   var items =
 //[
 //    {
 //        Id: 1,
 //        Name: "Dept 1"
 //    },
 //    {
 //        Id: 2,
 //        Name: "Dept 2"
 //    },
 //    {
 //        Id: 3,
 //        Name: "Dept 3"
 //    },
 //    {
 //        Id: 4,
 //        Name: "Dept 4"
 //    }
 //];

 //   var defer = $q.defer();
 //   defer.resolve(items);
 //   return defer.promise;

    //var items = [
    //    {
    //        Id: 1,
    //        Name: "1",
    //        Color: "red"
    //    },
    //    {
    //        Id: 2,
    //        Name: "2",
    //        Color: "orange"
    //    },
    //    {
    //        Id: 3,
    //        Name: "3",
    //        Color: "#FDEE00"
    //    }];
    //var defer = $q.defer();
    //defer.resolve(items);
    //return defer.promise;
})(Simple, SimplyLog);