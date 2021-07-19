var cumulative_array = [];
var states_array = [];
var csv_source_array = ["15-1211_M2020_dl.csv","15-1221_M2020_dl.csv","15-1245_M2020_dl.csv","15-2031_M2020_dl.csv","15-2041_M2020_dl.csv","15-1251_M2020_dl.csv","15-1257_M2020_dl.csv","15-2098_M2020_dl.csv"];
var csvSource = "state_m2020_dl.csv";
var timespans = {"hourly": "H", "annual": "A"};
var stats_array = ['_PCT10', '_PCT25', '_MEDIAN', '_MEAN', '_PCT75', '_PCT90'];
// var stats_array = ['_MEDIAN'];
var ordered ='ordered_';
var wages_summary = '_wages_summary';
var jobCodes_array = ["15-1211","15-1221","15-1245","15-2031","15-2041","15-1251","15-1257","15-2098"]
var jobCode = "15-2098";
// var state = "Alabama";

// function renameKey (obj,oldKey,newKey ) {
//     obj[newKey] = obj[oldKey];
//     delete obj[oldKey];
// }

// generate a states array
fetch('stateData.geojson').then(response => response.text()).then(data => {
    var test_text = data;
    const test_json = ` 
        [  
        ${test_text}
        ]
    `;
    const test_object = JSON.parse(test_json);
    // console.log(test_object[0].features);
    for(let n = 0; n < test_object[0].features.length; n++) {
        var test_1 = test_object[0].features[n].properties;
        test_1.density = 'new_value';
        // console.log(test_1);
        // console.log(test_1.name);
        states_array.push(test_1.name);
        
    };
    console.log(states_array); 

    // test_object.forEach(obj => renameKey(obj,'density','plotData'));
    // const updatedJson = JSON.stringify(test_object);
    // console.log(updatedJson);
});

console.log(jobCodes_array)
for(var jobCode in jobCodes_array) {
    console.log(jobCode);
    console.log(`"${csv_source_array[jobCode]}"`);

    d3.csv(csv_source_array[jobCode]).then(function(dataAsset) {
        // loop through states array that was generated from "stateData.geojson"
        for(let place = 0; place < states_array.length; state++) {
            state = states_array[place];

            // filter "OCCjobCodeSearchResults" by state
            var stateRow = dataAsset.filter(dataAsset => {
                return dataAsset.AREA_TITLE === place;
            });
        };

        console.log(stateRow);

    });
};

// for(var jobCode in jobCodes_array) {
//     // console.log(jobCode);
//     // console.log(`"${csv_source_array[jobCode]}"`);

//     // have d3 read in a csv as "dataAsset" object
//     d3.csv(csv_source_array[jobCode]).then(function(dataAsset) { 
//         // filter source csv by "jobCode" variable
//         var OCCjobCodeSearchResults = dataAsset.filter(dataAsset => {
//             return dataAsset.OCC_CODE === jobCode;
//         });

//         // loop through states array that was generated from "stateData.geojson"
//         for(let place = 0; place < states_array.length; state++) {
//             state = states_array[place];

//             // filter "OCCjobCodeSearchResults" by state
//             var stateRow = dataAsset.filter(dataAsset => {
//                 return dataAsset.AREA_TITLE === place;
//             });
        
//         // console.log(OCCjobCodeSearchResults);

//             // example of a row of state data for a single jobCode
//             console.log(stateRow);
            
//             // loop through available timespans and chosen stats to dynamically generate database content and format
//             for(var t in timespans) {
//                 var resource_type = `${ordered + t + wages_summary}`;
//                 // var output_array = [];
//                 for(var s in stats_array) {
//                     var call_variable_name = `${timespans[t] + stats_array[s]}`;
//                     var stateRowContents = stateRow[0];
//                     var stat = stateRowContents[call_variable_name];
//                     var stat = +(stat.replace(",", ""));
//                     var text = `{"stateUS":"${state}","resourceName":"${resource_type}","statName":"${call_variable_name}","stat${call_variable_name}":${stat}}`;
//                     const object = JSON.parse(text);
//                     // output_array.push(object);
//                     cumulative_array.push(object);
//                 };
                
//                 // sort the summary stat table for a single state
//                 // output_array = _.sortBy(output_array, 'stat');

//                 // sort the summary stat table for a single state
//                 // thisName = `${state}_${ordered + t + wages_summary}`;
//                 // this[thisName] = output_array;
//                 // console.log(output_array);
                
//             };       
//         };

//         // sort the complete database array
//         cumulative_array = _.sortBy(cumulative_array, ['stateUS', 'resourceName', 'stat']);

//         // the complete database array for a given job code
//         console.log(cumulative_array);

//         // two metric-defined and sorted state arrays for a given job code
//         // console.log(Alabama_ordered_annual_wages_summary);
//         // console.log(Alabama_ordered_hourly_wages_summary);

//     });
// };
