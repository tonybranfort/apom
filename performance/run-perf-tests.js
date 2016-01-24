var perfTestFns = require('./perf-test-fns.js'); 
var perfTests = require('./perf-tests.js').perfTests;
var makePerfData = require('./make-data/make-perf-data.js');
var getEnv = require('./get-env.js'); 
var apom = require('../lib/index.js'); 
var resultsFileName; 

var testToRun = process.argv[2] ? process.argv[2] : 'v100to1k'; 
var makePerfDataFirst = process.argv[3] === 'true' ? true : false;
var recordResults = 
    ((!process.argv[4] && testToRun) || process.argv[4] === 'false') ? 
    false : true;
var testGroupName = 
  getDateAsYyyymmdd() + 
  "_" + getEnv.getPlatform() +
  "_" + 'v' + perfTestFns.getPackageVersion() + 
  '_node-'+ getEnv.getNodeVersion() + 
  '_' + testToRun  + 
  (process.argv[5] ? '_' + process.argv[5] : '') +
  '_' + Date.now(); 

console.log('Parameters '); 
console.log('  makePerfDataFirst : ' + makePerfDataFirst); 
console.log('  testToRun :' + testToRun); 
console.log('  testGroupName: ' + testGroupName); 
console.log('  recordResults : ' + recordResults); 

// run just the one test if this parameter was passed in
var tests = testToRun && apom._.isString(testToRun) && testToRun.length > 0 ? 
  perfTests[testToRun] : 
  perfTests.v100to1k; 

if(makePerfDataFirst === true) {
  makePerfData.makePerfData();
} 

console.log(tests);

runPerfTests(testGroupName, tests); 

function runPerfTests(testGroupName, tests) {
  var n = 0;
  var summarizedResults; 

  resultsFileName = testGroupName + ".json";  

  perfTestFns.initializeResultsFile(resultsFileName); 

  tests = shuffle(tests); 

  console.log('Test >');
  tests.forEach(function(testConfig) {
    testConfig.testGroupName = testGroupName;
    testConfig.testSeq = n++; 
    perfTestFns.runTest(testConfig, resultsFileName); 
  });

  if(recordResults === true) {
    summarizedResults = perfTestFns.writeSummarizedTestResult(resultsFileName); 
  } else {
    summarizedResults= perfTestFns.getSummarizedTestResult(resultsFileName);
  }
  console.log(summarizedResults);
}

function getDateAsYyyymmdd() {
  var newD = new Date();
  if (newD.getFullYear()) {
    var d = 
      newD.getFullYear() +    
      "-" +
      ("0" + (newD.getMonth()+1)).slice(-2) +
      "-" +
      ("0" + (newD.getDate())).slice(-2); 
    return d;
  } else {
    return 'bad date'; 
  } 
}

//http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array#2450976
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// function getTests() {
// }
