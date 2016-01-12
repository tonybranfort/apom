var perfTestFns = require('./perf-test-fns.js'); 
var makePerfData = require('./make-data/make-perf-data.js');
var getEnv = require('./get-env.js'); 
var apom = require('../../lib/index.js'); 
var resultsFileName; 

var makePerfDataFirst = 
    ((!process.argv[2] && testToRun) || process.argv[2] === 'false') ? 
    false : true; 
var testToRun     = process.argv[3] ? process.argv[3] : ''; 
var recordResults = 
    ((!process.argv[4] && testToRun) || process.argv[4] === 'false') ? 
    false : true;
var testGroupName = 
  getDateAsYyyymmdd() + 
  "_" + getEnv.getPlatform() +
  "_" + 'v' + perfTestFns.getPackageVersion() + 
  '_node-'+ getEnv.getNodeVersion() + 
  '_' + (testToRun ? '1test' : 'all') + 
  (process.argv[5] ? '_' + process.argv[5] : '') +
  '_' + Date.now(); 

console.log('Parameters '); 
console.log('  makePerfDataFirst : ' + makePerfDataFirst); 
console.log('  testToRun :' + testToRun); 
console.log('  testGroupName: ' + testGroupName); 
console.log('  recordResults : ' + recordResults); 

// run just the one test if this parameter was passed in
tests = testToRun && apom._.isString(testToRun) && testToRun.length > 0 ? 
  getTests().filter(function(test){
    return test.testName === testToRun; 
  }) : 
  getTests();

if(makePerfDataFirst === true) {
  makePerfData.makePerfData();
} 

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

function getTests() {
  return [
    // MATCH  1 Word to 1 Word
    {
      testName: 'match_k1to1_pWord_tWord_m50_v100to100',
      tObj: {
        fileName: 'k1_word_v100.json'
      },
      pObj: {
        fileName:'k1_word_v100_ditto_m50.json' 
      },
      testFn: 'testMatch', 
      props: ["prop1"]
    },
    {
      testName: 'match_k1to1_pWord_tWord_m50_v1kto1k',
      tObj: {
        fileName: 'k1_word_v1k.json'
      },
      pObj: {
        fileName:'k1_word_v1k_ditto_m50.json' 
      },
      testFn: 'testMatch', 
      props: ["prop1"]
    },
    {
      testName: 'match_k1to1_pWord_tWord_m50_v10kto10k',
      tObj: {
        fileName: 'k1_word_v10k.json'
      },
      pObj: {
        fileName:'k1_word_v10k_ditto_m50.json' 
      },
      testFn: 'testMatch', 
      props: ["prop1"]
    },
    // {
    //   testName: 'match_k1to1_pWord_tWord_m50_v100kto100k',
    //   tObj: {
    //     fileName: 'k1_word_v100k.json'
    //   },
    //   pObj: {
    //     fileName:'k1_word_v100k_ditto_m50.json' 
    //   },
    //   testFn: 'testMatch', 
    //   props: ["prop1"]
    // },
    // MATCH SIMPLE 1 Word to 1 Word
    {
      testName: 'matchSimple_k1to1_pWord_tWord_m50_v100to100',
      tObj: {
        fileName: 'k1_word_v100.json'
      },
      pObj: {
        fileName:'k1_word_v100_ditto_m50.json' 
      },
      testFn: 'testMatchSimple', 
    },
    {
      testName: 'matchSimple_k1to1_pWord_tWord_m50_v1kto1k',
      tObj: {
        fileName: 'k1_word_v1k.json'
      },
      pObj: {
        fileName:'k1_word_v1k_ditto_m50.json' 
      },
      testFn: 'testMatchSimple', 
    },
    {
      testName: 'matchSimple_k1to1_pWord_tWord_m50_v10kto10k',
      tObj: {
        fileName: 'k1_word_v10k.json'
      },
      pObj: {
        fileName:'k1_word_v10k_ditto_m50.json' 
      },
      testFn: 'testMatchSimple', 
    },
    // {
    //   testName: 'matchSimple_k1to1_pWord_tWord_m50_v100kto100k',
    //   tObj: {
    //     fileName: 'k1_word_v100k.json'
    //   },
    //   pObj: {
    //     fileName:'k1_word_v100k_ditto_m50.json' 
    //   },
    //   testFn: 'testMatchSimple', 
    // },
    // MATCH String
    {
      testName: 'match_k1to1_pString_tString_m50_v100to100',
      tObj: {
        fileName: 'k1_string_v100.json'
      },
      pObj: {
        fileName:'k1_string_v100_ditto_m50.json' 
      },
      testFn: 'testMatch', 
      props: ["prop1"]
    },
    {
      testName: 'match_k1to1_pString_tString_m50_v1kto1k',
      tObj: {
        fileName: 'k1_string_v1k.json'
      },
      pObj: {
        fileName:'k1_string_v1k_ditto_m50.json' 
      },
      testFn: 'testMatch', 
      props: ["prop1"]
    },
    {
      testName: 'match_k1to1_pString_tString_m50_v10kto10k',
      tObj: {
        fileName: 'k1_string_v10k.json'
      },
      pObj: {
        fileName:'k1_string_v10k_ditto_m50.json' 
      },
      testFn: 'testMatch', 
      props: ["prop1"]
    },
    // {
    //   testName: 'match_k1to1_pString_tString_m50_v100kto100k',
    //   tObj: {
    //     fileName: 'k1_string_v100k.json'
    //   },
    //   pObj: {
    //     fileName:'k1_string_v100k_ditto_m50.json' 
    //   },
    //   testFn: 'testMatch', 
    //   props: ["prop1"]
    // },
    // MATCH Paragraph 
    {
      testName: 'match_k1to1_pParagraph_tParagraph_m50_v100to100',
      tObj: {
        fileName: 'k1_paragraph_v100.json'
      },
      pObj: {
        fileName:'k1_paragraph_v100_ditto_m50.json' 
      },
      testFn: 'testMatch', 
      props: ["prop1"]
    },
    {
      testName: 'match_k1to1_pParagraph_tParagraph_m50_v1kto1k',
      tObj: {
        fileName: 'k1_paragraph_v1k.json'
      },
      pObj: {
        fileName:'k1_paragraph_v1k_ditto_m50.json' 
      },
      testFn: 'testMatch', 
      props: ["prop1"]
    },

    // REG EXP Mid Str 
    {
      testName: 'regMatch_k1to1_pRegMidStr_tWord_m50_v100to100',
      tObj: {
        fileName:'k1_word_v100.json'
      },
      pObj: {
        fileName:'k1_word_v100_regMidStr_m50.json' 
      },
      testFn: 'testMatch', 
      props: {prop1: {regExpMatch:true}}
    },
    {
      testName: 'regMatch_k1to1_pRegMidStr_tWord_m50_v1kto1k',
      tObj: {
        fileName:'k1_word_v1k.json'
      },
      pObj: {
        fileName:'k1_word_v1k_regMidStr_m50.json' 
      },
      testFn: 'testMatch', 
      props: {prop1: {regExpMatch:true}}
    },
    {
      testName: 'regMatch_k1to1_pRegMidStr_tWord_m50_v10kto10k',
      tObj: {
        fileName:'k1_word_v10k.json'
      },
      pObj: {
        fileName:'k1_word_v10k_regMidStr_m50.json' 
      },
      testFn: 'testMatch', 
      props: {prop1: {regExpMatch:true}}
    },
    // {
    //   testName: 'regMatch_k1to1_pRegMidStr_tWord_m50_v100kto100k',
    //   tObj: {
    //     fileName:'k1_word_v100k.json'
    //   },
    //   pObj: {
    //     fileName:'k1_word_v100k_regMidStr_m50.json' 
    //   },
    //   testFn: 'testMatch', 
    //   props: {prop1: {regExpMatch:true}}
    // },
    // REG EXP Dot - reg exp match with one '.' in pattern, 50% match
    {
      testName: 'regMatch_k1to1_pRegDot_tWord_m50_v100to100',
      tObj: {
        fileName:'k1_word_v100.json'
      },
      pObj: {
        fileName:'k1_word_v100_regDot_m50.json' 
      },
      testFn: 'testMatch', 
      props: {prop1: {regExpMatch:true}}
    },
    {
      testName: 'regMatch_k1to1_pRegDot_tWord_m50_v1kto1k',
      tObj: {
        fileName:'k1_word_v1k.json'
      },
      pObj: {
        fileName:'k1_word_v1k_regDot_m50.json' 
      },
      testFn: 'testMatch', 
      props: {prop1: {regExpMatch:true}}
    },
    {
      testName: 'regMatch_k1to1_pRegDot_tWord_m50_v10kto10k',
      tObj: {
        fileName:'k1_word_v10k.json'
      },
      pObj: {
        fileName:'k1_word_v10k_regDot_m50.json' 
      },
      testFn: 'testMatch', 
      props: {prop1: {regExpMatch:true}}
    },
    // {
    //   testName: 'regMatch_k1to1_pRegDot_tWord_m50_v100kto100k',
    //   tObj: {
    //     fileName:'k1_word_v100k.json'
    //   },
    //   pObj: {
    //     fileName:'k1_word_v100k_regDot_m50.json' 
    //   },
    //   testFn: 'testMatch', 
    //   props: {prop1: {regExpMatch:true}}
    // },
    // REG EXP DotStar - reg exp match with '.*' in pattern, 50% match
    {
      testName: 'regMatch_k1to1_pRegDotStar_tWord_m50_v100to100',
      tObj: {
        fileName:'k1_word_v100.json'
      },
      pObj: {
        fileName:'k1_word_v100_regDotStar_m50.json' 
      },
      testFn: 'testMatch', 
      props: {prop1: {regExpMatch:true}}
    },
    {
      testName: 'regMatch_k1to1_pRegDotStar_tWord_m50_v1kto1k',
      tObj: {
        fileName:'k1_word_v1k.json'
      },
      pObj: {
        fileName:'k1_word_v1k_regDotStar_m50.json' 
      },
      testFn: 'testMatch', 
      props: {prop1: {regExpMatch:true}}
    },
    {
      testName: 'regMatch_k1to1_pRegDotStar_tWord_m50_v10kto10k',
      tObj: {
        fileName:'k1_word_v10k.json'
      },
      pObj: {
        fileName:'k1_word_v10k_regDotStar_m50.json' 
      },
      testFn: 'testMatch', 
      props: {prop1: {regExpMatch:true}}
    },
    // {
    //   testName: 'regMatch_k1to1_pRegDotStar_tWord_m50_v100kto100k',
    //   tObj: {
    //     fileName:'k1_word_v100k.json'
    //   },
    //   pObj: {
    //     fileName:'k1_word_v100k_regDotStar_m50.json' 
    //   },
    //   testFn: 'testMatch', 
    //   props: {prop1: {regExpMatch:true}}
    // },
    // REG EXP Phone - match using reg ex phone pattern, 50% match
    {
      testName: 'regMatch_k1to1_pRegPhone_tPhone_m50_v100to100',
      tObj: {
        fileName:'k1_phone_v100.json'
      },
      pObj: {
        fileName:'k1_phone_v100_regPhone_m50.json' 
      },
      testFn: 'testMatch', 
      props: {phone: {regExpMatch:true}}
    },
    {
      testName: 'regMatch_k1to1_pRegPhone_tPhone_m50_v1kto1k',
      tObj: {
        fileName:'k1_phone_v1k.json'
      },
      pObj: {
        fileName:'k1_phone_v1k_regPhone_m50.json' 
      },
      testFn: 'testMatch', 
      props: {phone: {regExpMatch:true}}
    },
    {
      testName: 'regMatch_k1to1_pRegPhone_tPhone_m50_v10kto10k',
      tObj: {
        fileName:'k1_phone_v10k.json'
      },
      pObj: {
        fileName:'k1_phone_v10k_regPhone_m50.json' 
      },
      testFn: 'testMatchSimple', 
      props: {phone: {regExpMatch:true}}
    },
    // {
    //   testName: 'regMatch_k1to1_pRegPhone_tPhone_m50_v100kto100k',
    //   tObj: {
    //     fileName:'k1_phone_v100k.json'
    //   },
    //   pObj: {
    //     fileName:'k1_phone_v100k_regPhone_m50.json' 
    //   },
    //   testFn: 'testMatchSimple', 
    //   props: {phone: {regExpMatch:true}}
    // },
    // k1to100_m50 - Match one property in pObj to tObj with 100 props
    {
      testName: 'matchSimple_k1to100_m50_v100to100',
      tObj: {
        fileName:'k100_randObj_v100.json'
      },
      pObj: {
        fileName:'k100_randObj_v100_k1_m50.json' 
      },
      testFn: 'testMatchSimple' 
    },
    {
      testName: 'matchSimple_k1to100_m50_v1kto1k',
      tObj: {
        fileName:'k100_randObj_v1k.json'
      },
      pObj: {
        fileName:'k100_randObj_v1k_k1_m50.json' 
      },
      testFn: 'testMatchSimple' 
    },
    {
      testName: 'matchSimple_k1to100_m50_v10kto10k',
      tObj: {
        fileName:'k100_randObj_v10k.json'
      },
      pObj: {
        fileName:'k100_randObj_v10k_k1_m50.json' 
      },
      testFn: 'testMatchSimple' 
    },
    // k1to100_m50 - Match one property in pObj to tObj with 100 props
    {
      testName: 'match_k1to100_m50_v100to100',
      tObj: {
        fileName:'k100_randObj_v100.json'
      },
      pObj: {
        fileName:'k100_randObj_v100_k1_m50.json' 
      },
      testFn: 'testMatch' 
    },
    {
      testName: 'match_k1to100_m50_v1kto1k',
      tObj: {
        fileName:'k100_randObj_v1k.json'
      },
      pObj: {
        fileName:'k100_randObj_v1k_k1_m50.json' 
      },
      testFn: 'testMatch' 
    },
    {
      testName: 'match_k1to100_m50_v10kto10k',
      tObj: {
        fileName:'k100_randObj_v10k.json'
      },
      pObj: {
        fileName:'k100_randObj_v10k_k1_m50.json' 
      },
      testFn: 'testMatch' 
    },
    // k10to100_m50 - Match 10 properties in pObj to tObj with 100 props
    {
      testName: 'match_k10to100_m50_v100to100',
      tObj: {
        fileName:'k100_randObj_v100.json'
      },
      pObj: {
        fileName:'k100_randObj_v100_k10_m50.json' 
      },
      testFn: 'testMatch' 
    },
    {
      testName: 'match_k10to100_m50_v1kto1k',
      tObj: {
        fileName:'k100_randObj_v1k.json'
      },
      pObj: {
        fileName:'k100_randObj_v1k_k10_m50.json' 
      },
      testFn: 'testMatch' 
    },
    {
      testName: 'match_k10to100_m50_v10kto10k',
      tObj: {
        fileName:'k100_randObj_v10k.json'
      },
      pObj: {
        fileName:'k100_randObj_v10k_k10_m50.json' 
      },
      testFn: 'testMatch' 
    },
    // k100to100_m100 - Match 100 properties in pObj to tObj, 100% match
    {
      testName: 'match_k100to100_m100_v100to100',
      tObj: {
        fileName:'k100_randObj_v100.json'
      },
      pObj: {
        fileName:'k100_randObj_v100_k100_m100.json' 
      },
      testFn: 'testMatch' 
    },
    {
      testName: 'match_k100to100_m100_v1kto1k',
      tObj: {
        fileName:'k100_randObj_v1k.json'
      },
      pObj: {
        fileName:'k100_randObj_v1k_k100_m100.json' 
      },
      testFn: 'testMatch' 
    },
    {
      testName: 'match_k100to100_m100_v10kto10k',
      tObj: {
        fileName:'k100_randObj_v10k.json'
      },
      pObj: {
        fileName:'k100_randObj_v10k_k100_m100.json' 
      },
      testFn: 'testMatch' 
    },

    // -----------------------------------------------------
    // FILTER TESTS
    // -----------------------------------------------------
    // k1to100_word - Match 100 properties in pObj to tObj, 100% match
    {
      testName: 'filter_k1to1_pWord_tWord_m50_v100to100',
      tObj: {
        fileName: 'k1_word_v100.json'
      },
      pObj: {
        fileName:'k1_word_v100_ditto_m50.json' 
      },
      testFn: 'testFilter', 
      props: ["prop1"]
    },
    {
      testName: 'filter_k1to1_pWord_tWord_m50_v1kto1k',
      tObj: {
        fileName: 'k1_word_v1k.json'
      },
      pObj: {
        fileName:'k1_word_v1k_ditto_m50.json' 
      },
      testFn: 'testFilter', 
      props: ["prop1"]
    },
    // {
    //   testName: 'filter_k1to1_pWord_tWord_m50_v100kto100k',
    //   tObj: {
    //     fileName: 'k1_word_v100k.json'
    //   },
    //   pObj: {
    //     fileName:'k1_word_v100k_ditto_m50.json' 
    //   },
    //   testFn: 'testFilter', 
    //   props: ["prop1"]
    // },
    // k1to100_pRegDotStar - Match 100 properties in pObj to tObj, 100% match
    {
      testName: 'filter_k1to1_pRegDotStar_tWord_m50_v100to100',
      tObj: {
        fileName:'k1_word_v100.json'
      },
      pObj: {
        fileName:'k1_word_v100_regDotStar_m50.json' 
      },
      testFn: 'testFilter', 
      props: {prop1: {regExpMatch:true}}
    },
    {
      testName: 'filter_k1to1_pRegDotStar_tWord_m50_v1kto1k',
      tObj: {
        fileName:'k1_word_v1k.json'
      },
      pObj: {
        fileName:'k1_word_v1k_regDotStar_m50.json' 
      },
      testFn: 'testFilter', 
      props: {prop1: {regExpMatch:true}}
    },

    {
      testName: 'filter_k1to100_m50_v100to100',
      tObj: {
        fileName:'k100_randObj_v100.json'
      },
      pObj: {
        fileName:'k100_randObj_v100_k1_m50.json' 
      },
      testFn: 'testFilter' 
    },
    {
      testName: 'filter_k1to100_m50_v1kto1k',
      tObj: {
        fileName:'k100_randObj_v1k.json'
      },
      pObj: {
        fileName:'k100_randObj_v1k_k1_m50.json' 
      },
      testFn: 'testFilter' 
    },

    {
      testName: 'filter_k10to100_m50_v100to100',
      tObj: {
        fileName:'k100_randObj_v100.json'
      },
      pObj: {
        fileName:'k100_randObj_v100_k10_m50.json' 
      },
      testFn: 'testFilter' 
    },
    {
      testName: 'filter_k10to100_m50_v1kto1k',
      tObj: {
        fileName:'k100_randObj_v1k.json'
      },
      pObj: {
        fileName:'k100_randObj_v1k_k10_m50.json' 
      },
      testFn: 'testFilter' 
    },

    {
      testName: 'filter_k100to100_m100_v100to100',
      tObj: {
        fileName:'k100_randObj_v100.json'
      },
      pObj: {
        fileName:'k100_randObj_v100_k100_m100.json' 
      },
      testFn: 'testFilter' 
    },
    // {
    //   testName: 'filter_k100to100_m100_v1kto1k',
    //   tObj: {
    //     fileName:'k100_randObj_v1k.json'
    //   },
    //   pObj: {
    //     fileName:'k100_randObj_v1k_k100_m100.json' 
    //   },
    //   testFn: 'testFilter' 
    // },
    {
      testName: 'filter_k1to100_charDotStar_v1kto100',
      tObj: {
        fileName:'k100_fixedKey_v100.json'
      },
      pObj: {
        fileName:'k100_fixedKey_k1_charDotStar_v1k.json' 
      },
      testFn: 'testFilter',
      options: {regExpMatch: true}
    },
    {
      testName: 'filter_k1to100_charDotStar_v1kto1k',
      tObj: {
        fileName:'k100_fixedKey_v1k.json'
      },
      pObj: {
        fileName:'k100_fixedKey_k1_charDotStar_v1k.json' 
      },
      testFn: 'testFilter',
      options: {regExpMatch: true}
    },
    {
      testName: 'filter_k1to100_charDotStar_v1kto10k',
      tObj: {
        fileName:'k100_fixedKey_v10k.json'
      },
      pObj: {
        fileName:'k100_fixedKey_k1_charDotStar_v1k.json' 
      },
      testFn: 'testFilter',
      options: {regExpMatch: true}
    },


  ];
}
