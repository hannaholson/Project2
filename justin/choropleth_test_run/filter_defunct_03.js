// function resolveAfter2Seconds() {
//     console.log("starting slow promise")
//         return new Promise(resolve => {
//             setTimeout(function() {
//                 resolve("slow")
//                 console.log("slow promise is done")
//             }, 2000)
//         })
//     }
    
// function resolveAfter1Second() {
// console.log("starting fast promise")
//     return new Promise(resolve => {
//         setTimeout(function() {
//             resolve("fast")
//             console.log("fast promise is done")
//         }, 1000)
//     })
// }

// async function parallel() {
//     console.log('==PARALLEL with await Promise.all==')
    
//     // Start 2 "jobs" in parallel and wait for both of them to complete
//     await Promise.all([
//         (async()=>console.log(await resolveAfter2Seconds()))(),
//         (async()=>console.log(await resolveAfter1Second()))()
//     ])
// };

// parallel();

// const fruitBasket = {
//     apple: 27,
//     grape: 0,
//     pear: 14
// }

// const fruitsToGet = ['apple', 'grape', 'pear'];

// const getNumFruit = fruit => {
//     return fruitBasket[fruit]
// }

// const forLoop = async _ => {
    
//     console.log('Start');
  
//     for (let index = 0; index < fruitsToGet.length; index++) {
//       const fruit = fruitsToGet[index];
//       const numFruit = await getNumFruit(fruit);
//       console.log(numFruit);
//     };
  
//     console.log('End');
// };

// forLoop();

var cumulative_array = [];
var states_array = [];
var csv_source_array = ["15-1211_M2020_dl.csv","15-1221_M2020_dl.csv","15-1245_M2020_dl.csv","15-2031_M2020_dl.csv","15-2041_M2020_dl.csv","15-1251_M2020_dl.csv","15-1257_M2020_dl.csv","15-2098_M2020_dl.csv"];
var csvSource = "state_m2020_dl.csv";
var timespans = {"hourly": "H", "annual": "A"};
var stats_array = ['_PCT10', '_PCT25', '_MEDIAN', '_MEAN', '_PCT75', '_PCT90'];
var yearly_timespan_stats = [] 
// var stats_array = ['_MEDIAN'];
var ordered ='ordered';
// var ordered ='ordered_';
var wages_summary = '_wages_summary';
var jobCodes_array = ["15_1211","15_1221","15_1245","15_2031","15_2041","15_1251","15_1257","15_2098"];
var jobCodes_for_JSON_array = ["15-1211","15-1221","15-1245","15-2031","15-2041","15-1251","15-1257","15-2098"];
var jobCode = "15-2098";
var state = "Alabama";

// function renameKey (obj,oldKey,newKey ) {
//     obj[newKey] = obj[oldKey];
//     delete obj[oldKey];
// }

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
        // console.log(states_array);
    }; 
    // test_object.forEach(obj => renameKey(obj,'density','plotData'));
    // const updatedJson = JSON.stringify(test_object);
    // console.log(updatedJson);
});

var csv;

// // await/async test code
// const fruitBasket = {
//     apple: 27,
//     grape: 0,
//     pear: 14
// }

// const fruitsToGet = ['apple', 'grape', 'pear'];

// const getNumJC = num => {
//     return jobCodes_array.indexOf(num)
// };



// works inside of await/async test code
// const forLoop = async _ => {
//     console.log('Start');
//     for (var csv in csv_source_array) {
//         const jobCode = jobCodes_array[csv];
//         console.log(jobCode);
//         const jobCodeNum = await getNumJC(jobCode);
//         console.log(jobCodeNum);
//     };
//     console.log('End');
// };

// forLoop();

// // loop through jobCodes array
const forLoop = async _ => {
    console.log('Start');
    for (var csv in csv_source_array) {
        const jobCode = jobCodes_array[csv];
        console.log(jobCode);
        const jobCodeNum = await getNumJC(jobCode);
        console.log(jobCodeNum);
        
    };
    
    console.log('End');
};

const getNumJC = num => {
    return jobCodes_array.indexOf(num)
};  

    forLoop();

    // have d3 read in a csv
    d3.csv(csv_source_array[csv].then(function(dataAsset) {
        
    console.log('Start');

    // for (var csv in csv_source_array) {
    //     const jobCode = jobCodes_array[csv];
    //     console.log(jobCode);
    //     const jobCodeNum = await getNumJC(jobCode);
    //     console.log(jobCodeNum);

        console.log(csv);
        console.log(jobCodes_for_JSON_array[csv]);

        // load csv dataAsset to variable
        var OCCjobCodeSearchResults = dataAsset;
        // console.log(OCCjobCodeSearchResults);

        // filter "OCCjobCodeSearchResults" by state
        var stateRow = OCCjobCodeSearchResults.filter(dataAsset => {
            return dataAsset.AREA_TITLE === state;
        });
        // console.log(stateRow[0]);

        //declare variable to store an array for each state's BLS stats by jobCode
        var state_cumulative_array = [];

        for(var t in timespans) {
            var resource_type = `${ordered}_${t + wages_summary}`;
            var output_array = [];
            for(var s in stats_array) {
                var call_variable_name = `${timespans[t] + stats_array[s]}`;
                var stateRowContents = stateRow[0];
                var stat = stateRowContents[call_variable_name];
                var stat = +(stat.replace(",", ""));
                var text = `{"jobCode":"${jobCodes_for_JSON_array[csv]}","stateUS":"${state}","resourceName":"${resource_type}","statName":"${call_variable_name}","stat${call_variable_name}":${stat}}`;
                const object = JSON.parse(text);
                output_array.push(object);
                state_cumulative_array.push(object);
                cumulative_array.push(object);
            };

            // sort the summary stat table for a single job_code, single state and single timespan
            var thisName = `${state}_${ordered}_${t + wages_summary}_for_jobCode_${jobCodes_array[csv]}`;
            console.log(thisName);
            this[thisName] = output_array;
            console.log(output_array);
        
            
            
        };

        // sort the summary stat table for a single jobCode and single state
        var thisName = `${state}_${ordered + wages_summary}_for_jobCode_${jobCodes_array[csv]}`;
        console.log(thisName);
        this[thisName] = state_cumulative_array;
        console.log(state_cumulative_array);

        // log csv file name to console
        // console.log(jobCodes_array[csv]);
        // console.log(csv_source_array[csv]);
        
        // // three metric-defined and sorted state arrays for a given job code
        // console.log(Alabama_ordered_annual_wages_summary_for_jobCode_15_1211);
        // console.log(Alabama_ordered_hourly_wages_summary_for_jobCode_15_1211);
        // console.log(Alabama_ordered_wages_summary_for_jobCode_15_1211);

    });

        



// // previous code, nearly functional
// for(var csv in csv_source_array) {
//     console.log(csv);
//     console.log(jobCodes_for_JSON_array[csv]);

//     // have d3 read in a csv
//     d3.csv(csv_source_array[csv]).then(function(dataAsset) {
        
//         console.log(csv);
//         console.log(jobCodes_for_JSON_array[csv]);

//         // load csv dataAsset to variable
//         var OCCjobCodeSearchResults = dataAsset;
//         // console.log(OCCjobCodeSearchResults);

//         // filter "OCCjobCodeSearchResults" by state
//         var stateRow = OCCjobCodeSearchResults.filter(dataAsset => {
//             return dataAsset.AREA_TITLE === state;
//         });
//         // console.log(stateRow[0]);

//         //declare variable to store an array for each state's BLS stats by jobCode
//         var state_cumulative_array = [];

//         for(var t in timespans) {
//             var resource_type = `${ordered}_${t + wages_summary}`;
//             var output_array = [];
//             for(var s in stats_array) {
//                 var call_variable_name = `${timespans[t] + stats_array[s]}`;
//                 var stateRowContents = stateRow[0];
//                 var stat = stateRowContents[call_variable_name];
//                 var stat = +(stat.replace(",", ""));
//                 var text = `{"jobCode":"${jobCodes_for_JSON_array[csv]}","stateUS":"${state}","resourceName":"${resource_type}","statName":"${call_variable_name}","stat${call_variable_name}":${stat}}`;
//                 const object = JSON.parse(text);
//                 output_array.push(object);
//                 state_cumulative_array.push(object);
//                 cumulative_array.push(object);
//             };

//             // sort the summary stat table for a single job_code, single state and single timespan
//             var thisName = `${state}_${ordered}_${t + wages_summary}_for_jobCode_${jobCodes_array[csv]}`;
//             console.log(thisName);
//             this[thisName] = output_array;
//             console.log(output_array);

//         };

//         // sort the summary stat table for a single jobCode and single state
//         var thisName = `${state}_${ordered + wages_summary}_for_jobCode_${jobCodes_array[csv]}`;
//         console.log(thisName);
//         this[thisName] = state_cumulative_array;
//         console.log(state_cumulative_array);

//         // log csv file name to console
//         // console.log(jobCodes_array[csv]);
//         // console.log(csv_source_array[csv]);
        
//         // // three metric-defined and sorted state arrays for a given job code
//         // console.log(Alabama_ordered_annual_wages_summary_for_jobCode_15_1211);
//         // console.log(Alabama_ordered_hourly_wages_summary_for_jobCode_15_1211);
//         // console.log(Alabama_ordered_wages_summary_for_jobCode_15_1211);
    
//     });    

// };


// // previously conceived functional code
// // have d3 read in a csv as "dataAsset" object
// d3.csv(csvSource).then(function(dataAsset) { 
//     // filter by "jobCode" variable
//     var OCCjobCodeSearchResults = dataAsset.filter(dataAsset => {
//         return dataAsset.OCC_CODE === jobCode;
//     });
    
//     // console.log(OCCjobCodeSearchResults);
    
//     //loop through states array that was generated from "stateData.geojson"
//     // for(let place = 0; place < states_array.length; state++) {
//     //     state = states_array[place];

//         // filter "OCCjobCodeSearchResults" by state
//         var stateRow = OCCjobCodeSearchResults.filter(dataAsset => {
//             return dataAsset.AREA_TITLE === state;
//         });

//         // example of a row of state data for a single jobCode
//         // console.log(stateRow);
        
//         // loop through available timespans and chosen stats to dynamically generate database content and format
//         for(var t in timespans) {
//             var resource_type = `${ordered + t + wages_summary}`;
//             // var output_array = [];
//             for(var s in stats_array) {
//                 var call_variable_name = `${timespans[t] + stats_array[s]}`;
//                 var stateRowContents = stateRow[0];
//                 var stat = stateRowContents[call_variable_name];
//                 var stat = +(stat.replace(",", ""));
//                 var text = `{"stateUS":"${state}","resourceName":"${resource_type}","statName":"${call_variable_name}","stat${call_variable_name}":${stat}}`;
//                 const object = JSON.parse(text);
//                 // output_array.push(object);
//                 cumulative_array.push(object);
//             };
            
//             // sort the summary stat table for a single state
//             // output_array = _.sortBy(output_array, 'stat');

//             // sort the summary stat table for a single state
//             // thisName = `${state}_${ordered + t + wages_summary}`;
//             // this[thisName] = output_array;
//             // console.log(output_array);
            
//         };       
//     // };

//     // sort the complete database array
//     cumulative_array = _.sortBy(cumulative_array, ['stateUS', 'resourceName', 'stat']);

//     // the complete database array for a given job code
//     console.log(cumulative_array);

//     // // two metric-defined and sorted state arrays for a given job code
//     // console.log(Alabama_ordered_annual_wages_summary);
//     // console.log(Alabama_ordered_hourly_wages_summary);

// });