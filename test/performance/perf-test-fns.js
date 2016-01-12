var getEnv = require('./get-env.js'); 
var fs = require('fs'); 
var apom = require('../../lib/index.js');
var jStat = require('jStat').jStat;

var PERF_RESULTS_FILE = './test/performance/perf-test-results.json'; 
var DATA_FOLDER = './test/performance/data/'; 
var PERF_RESULTS_FOLDER = './test/performance/results/';
var package_file = './package.json';

var testFns = {
  testMatchSimple : function(pObjs, tObjs) {
    var nTests = 0;   // number of tests executed
    var nProps = apom.getObjectProperties(pObjs[0]).length;  // number of properties to be matched in each test 
    var nObjs = 1; // nObjs tested in each test; non-filter so = 1

    var nMatchTest = 0; 
    var results = {}; 
    testTimes = []; 
    console.log('   > Testing...');
    var begTime = process.hrtime();
    for (var i = tObjs.length - 1; i >= 0; i--) {
      var t = process.hrtime();
      apom.matches(
          pObjs[i],
          tObjs[i], 
          onTest
      );
    }

    results.testTime = getTestTime(begTime); 
    results.perMatchMsStats = getStats(testTimes); 
    results.matchPercent = nMatchTest / testTimes.length * 100; 
    results.nMatchObjsPercent = results.matchPercent;// =s because not a filter
    results.nMatchTest = nMatchTest;
    results.nMatchObjs = nMatchTest;   // =s # of tests because not a filter

    results.nTests = nTests; 
    results.nProps = nProps; 
    results.nObjs  = nObjs; 

    console.log('   < Done.  Match ' + results.matchPercent + '%'); 

    return results; 

    function onTest(doesMatch) {
      var testTime = getTestTime(t);
      nTests++; 
      testTimes.push(testTime.totalMs); 
      nMatchTest = doesMatch === true ? nMatchTest+1 : nMatchTest; 
      return; 
    }
  },
  testMatch : function(pObjs, tObjs, props) {
    var nTests = 0;   // number of tests executed
    var nProps = props ?  
      Object.keys(props).length : apom.getObjectProperties(pObjs[0]).length;   
    var nObjs = 1; // nObjs tested in each test; non-filter so = 1
    var nMatchTest = 0; 
    var results = {}; 
    testTimes = []; 
    console.log('   > Testing...');
    var begTime = process.hrtime();
    for (var i = tObjs.length - 1; i >= 0; i--) {
      var ps = props ? props : apom.getObjectProperties(pObjs[i]);
      var f = apom.makeMatchFn(ps);
      var t = process.hrtime();
      f(
          pObjs[i],
          tObjs[i], 
          onTest
      );
    }

    results.testTime = getTestTime(begTime); 
    results.perMatchMsStats = getStats(testTimes); 
    results.matchPercent = nMatchTest / testTimes.length * 100; 
    results.nMatchObjsPercent = results.matchPercent;// =s because not a filter
    results.nMatchTest = nMatchTest;
    results.nMatchObjs = nMatchTest;   // =s # of tests because not a filter

    results.nTests = nTests; 
    results.nProps = nProps; 
    results.nObjs  = nObjs; 

    console.log('   < Done.  Match ' + results.matchPercent + '%'); 

    return results; 

    function onTest(doesMatch) {
      var testTime = getTestTime(t);
      nTests++; 
      testTimes.push(testTime.totalMs); 
      nMatchTest = doesMatch === true ? nMatchTest+1 : nMatchTest; 
      return; 
    }
  },
  testFilter : function(pObjs, tObjs, props, options) {
    var nTests = 0;   // number of tests executed
    // number of properties to be matched in each test 
    //  note that Object.keys(props).length works whether props is an array or obj
    var nProps = props ?  
      Object.keys(props).length : apom.getObjectProperties(pObjs[0]).length;   
    var nObjs = tObjs.length;  // nObjs tested in each test 
    var nMatchTest = 0;    // count of how many tests had at least one filtered object
    var nMatchObjs = 0;      // total number of filtered objects matched (returned) across all tests

    var results = {}; 
    testTimes = []; 
    console.log('   > Testing...');
    var begTime = process.hrtime();
    for (var i = pObjs.length - 1; i >= 0; i--) {
      var ps = props ? props : apom.getObjectProperties(pObjs[i]);
      var f = apom.makeFilterTargetObjectsFn(ps, options);
      var t = process.hrtime();
      f(
          pObjs[i],
          tObjs, 
          onTest
      );
    }

    results.testTime = getTestTime(begTime); 
    results.perMatchMsStats = getStats(testTimes, nProps); 
    results.nMatchTest = nMatchTest; 
    results.nMatchObjs = nMatchObjs; 

    results.nTests = nTests; 
    results.nProps = nProps; 
    results.nObjs  = nObjs; 

    results.matchPercent = nMatchTest / testTimes.length * 100; 
    results.nMatchObjsPercent = 
        nMatchObjs / (testTimes.length * tObjs.length) * 100;

    console.log('   < Done.  Match ' + results.matchPercent + '%'); 


    return results; 

    function onTest(filteredObjs) {
      var testTime = getTestTime(t);
      nTests++; 
      testTimes.push(testTime.totalMs); 
      nMatchTest = filteredObjs && filteredObjs.length > 0  ? 
          nMatchTest +1 : nMatchTest; 
      nMatchObjs = filteredObjs ? nMatchObjs + filteredObjs.length : nMatchObjs;

      return; 
    }
  }

};

function runTest(testConfig, resultsFileName) {
  resultsFileName = PERF_RESULTS_FOLDER + resultsFileName; 
  var test = initTestObject(testConfig); 
  console.log('  ' + test.testName); 
  console.log('   > Reading data files...');

  var tObjTestFileObj = getJsonFileAsObj(DATA_FOLDER + testConfig.tObj.fileName); 
  var pObjTestFileObj = getJsonFileAsObj(DATA_FOLDER + testConfig.pObj.fileName); 

  var tObjs = tObjTestFileObj.objects;
  var pObjs = pObjTestFileObj.objects;

  console.log('   < Data files read and parsed.'); 

  test.tObj.template = tObjTestFileObj.template; 
  test.pObj.template = pObjTestFileObj.template; 

  test.pObj.count = pObjs.length; 
  test.tObj.count = tObjs.length; 
  test.pObj.sample = pObjs[0]; 
  test.tObj.sample = tObjs[0]; 

  test.results = testFns[testConfig.testFn](
        pObjs, tObjs, testConfig.props, testConfig.options); 
  writeTestResult(test, resultsFileName); 
}

function initTestObject(testConfig) {
  var test = {}; 
  var id = Date.now(); 
  var d = new Date(id); 
  test.id = id; 
  test.testName = testConfig.testName; 
  test.date = new Date(); 
  test.testConfig = testConfig;
  test.pObj = {}; 
  test.tObj = {};  
  test.env = getEnv.getEnv(); 

  test.packageInfo = getPackageInfo();   
  return test; 
}

function getStats(nbrsArray) {
  // returns an object of stats given an array of numbers
    var jObj = jStat(nbrsArray); 
    var q = jObj.quantiles([0.1, 0.25, 0.5, 0.75, 0.90, 0.95, 0.99]);

    var stats = {};

    stats.q10 = q[0]; 
    stats.q25 = q[1]; 
    stats.q50 = q[2]; 
    stats.q75 = q[3]; 
    stats.q90 = q[4]; 
    stats.q95 = q[5]; 
    stats.q99 = q[6]; 

    stats.max = jObj.max();
    stats.min = jObj.min();
    stats.stdev = jObj.stdev();
    stats.mean = jObj.mean(); 

    return stats; 
}


function getTestTime(time) {
  // 1 second = 1,000 Millisecond (ms)
  // 1 Millisecond = 1,000,000 nanoseconds (ns)
  // hrtime() = [seconds, nanoseconds]
  // https://nodejs.org/api/process.html#process_process_hrtime
  var testTime = {} ;
  testTime.hrtimeDiff = process.hrtime(time); 
  testTime.totalMs = 
      testTime.hrtimeDiff[0] * 1000 + 
      testTime.hrtimeDiff[1] / 1e6; 
  // testTime.hrtimeDiff = JSON.stringify(testTime.hrtimeDiff);

  return testTime; 
}

function writeTestResult(test, fileName) {
  var perfResults = []; 
  if(fs.existsSync(fileName)) {
    perfResults = getPerfTestResults(fileName);
  } else {
    initializeResultsFile(fileName); 
  }
  perfResults.push(test);  
  fs.writeFileSync(
      fileName, 
      JSON.stringify(perfResults, null, ' ') 
  ); 
}

function writeSummarizedTestResult(resultsFileName) {
  var summary = getSummarizedTestResult(resultsFileName); 

  var fileOut = 
      PERF_RESULTS_FOLDER + 
      resultsFileName.replace('.json', '') +  
      '_RESULTS.txt';

  fs.writeFileSync(fileOut,summary); 

  return summary; 

}

function sortByTestName(a,b) {
  if(a.testName < b.testName) {
    return -1;
  }
  if(a.testName > b.testName) {
    return 1;
  }
  return 0;
}

function getSummarizedTestResult(resultsFileName) {
  var fileName = PERF_RESULTS_FOLDER + resultsFileName; 
  var outStr = '';
  outStr = 'resultsFileName : ' + resultsFileName + '\n';
  var header = 
    'seq  '  +
    '     nT ' + 
    '      nO ' + 
    '      nP ' + 
    '   T-q50 '  +
    '  T-q95 '  + 
    '  T-q99 '  + 
    '  T-max '  + 
    ' T-stdev'  + 
    '  P-q50 '  +
    '  P-q95  '  + 
    '   mT%  ' + 
    '   mO% ' + 
    padRight('  testName',75) + 
    '\n';
  var footer = 
    'seq = sequence (order) in which the test was executed\n' + 
    'T-xxx = time in ms for a test to return true or false\n' + 
    'nT = number of tests; eg match(pObj, tObj) or filter(pObj,tObjs)\n' + 
    'nP = number of properties tested for match in each test \n' +
    'nO = number of objects tested in each test (non-filter = 1, filter > 1)\n'+
    'mT% = match %age using n; ie # of tests that returned true\n' + 
    'P-qxx = time in ms for one property to be tested as \n' +
    '        calculated by T-qxx / nP\n' + 
    'mO% = match %age for all objects tested;equals mT% for non-filter tests\n'
    ;
  outStr = outStr + header; 
  pf = JSON.parse(fs.readFileSync(fileName));
  pf = pf.sort(sortByTestName); 
  pf.forEach(function(test) {
    outStr = outStr + 
        padLeft(test.testConfig.testSeq.toFixed(0), 3) + 
        '  ' + 
        padLeft(test.results.nTests, 7) + 
        '  ' + 
        padLeft(test.results.nObjs, 7) + 
        '  ' + 
        padLeft(test.results.nProps, 7) + 
        '  ' + 
        padLeft(test.results.perMatchMsStats.q50.toFixed(3), 7) + 
        ' ' + 
        padLeft(test.results.perMatchMsStats.q95.toFixed(3), 7) + 
        ' ' + 
        padLeft(test.results.perMatchMsStats.q99.toFixed(3), 7) + 
        ' ' + 
        padLeft(test.results.perMatchMsStats.max.toFixed(3), 7) + 
        ' ' + 
        padLeft(test.results.perMatchMsStats.stdev.toFixed(3), 7) + 
        ' ' + 
        padLeft(  // see ** note
            (test.results.perMatchMsStats.q50 / 
                (test.results.nProps * test.results.nObjs))
            .toFixed(3), 
            7) + 
        ' ' + 
        padLeft(  // see ** note
            (test.results.perMatchMsStats.q95 / 
                (test.results.nProps * test.results.nObjs))
            .toFixed(3), 
            7) + 
        ' ' + 
        padLeft(test.results.matchPercent.toFixed(3), 7) + 
        ' ' + 
        padLeft(test.results.nMatchObjsPercent ? 
            test.results.nMatchObjsPercent.toFixed(3) : '  - ', 7 ) + 
        '   ' + 
        padRight(test.testName, 75)+
        '\n';

  });


  return outStr; 

  // ** Note on average time per property: 
    // return the average time per property for a given test time statistic
    // eg if q95 = 0.100 and there are 10 properties in each test
    //   then P-q95 = 0.100 / 10 = 0.010ms.
    // OR if filtering 100 objects each with 10 properties 
    //   then P-q95 = 0.100 / (100*10) = 0.0001ms
    //   because each test was actually executing 100 * 10 property comparisons
    //   (note that nObjs is the TOTAL nObjs across all tests)  

  function padLeft(str, totalLen) {
    // pad string to left to reach totalLen
    return (getSpaces(totalLen) + str).slice(-totalLen); 
  }

  function padRight(str, totalLen) {
    // pad string with spaces to right to reach totalLen
    return (str + getSpaces(totalLen)).slice(0, totalLen); 
  }

  function getSpaces(nbr) {
    //http://stackoverflow.com/questions/1877475/repeat-character-n-times
    return Array(nbr+1).join(' ');
  }
}

function getPackageInfo() {
  var pkg = JSON.parse(fs.readFileSync(package_file, 'utf8'));
  return pkg;  
}

function getPackageVersion() {
  return getPackageInfo().version;  
}

function getPerfDataTemplate(testFileName) {
  return require(DATA_FOLDER + testFileName).template; 
}

function getPerfData(testFileName) {
  return require(DATA_FOLDER + testFileName).objects; 
}

function getJsonFileAsObj(fileName) {
  return JSON.parse(fs.readFileSync(fileName)); 
}

function getPerfTestResults(fileName) {
  var perfResults = []; 
  var pf = fs.readFileSync(fileName);
  perfResults = JSON.parse(pf); 
  return perfResults; 
}

function initializeResultsFile(fileName) {
  var emptyArray = [];
  fs.writeFileSync(
      PERF_RESULTS_FOLDER + fileName, 
      JSON.stringify(emptyArray) 
  );
}

function stringify(obj) {
  // stringifies including functions
  return JSON.stringify(obj, function(key, val) {
    if (typeof val === 'function') {
      return val + ''; // implicitly `toString` it
    }
    return val;
  });
}

module.exports = {
  runTest : runTest,
  initializeResultsFile: initializeResultsFile,
  getSummarizedTestResult: getSummarizedTestResult,
  writeSummarizedTestResult: writeSummarizedTestResult,
  getPackageInfo : getPackageInfo,
  getPackageVersion : getPackageVersion
};
