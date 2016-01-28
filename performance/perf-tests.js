var perfTests = 
{ v100to1k : [
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
  }
], 

v10k : [
  // MATCH  1 Word to 1 Word
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
  // MATCH SIMPLE 1 Word to 1 Word
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
  // MATCH String
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
  // MATCH Paragraph 
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
  // REG EXP Dot - reg exp match with one '.' in pattern, 50% match
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
  // REG EXP DotStar - reg exp match with '.*' in pattern, 50% match
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
  // REG EXP Phone - match using reg ex phone pattern, 50% match
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
  // k1to100_m50 - Match one property in pObj to tObj with 100 props
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
    testName: 'match_k100to100_m100_v10kto10k',
    tObj: {
      fileName:'k100_randObj_v10k.json'
    },
    pObj: {
      fileName:'k100_randObj_v10k_k100_m100.json' 
    },
    testFn: 'testMatch' 
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
  }
],

v100k : [
  // MATCH  1 Word to 1 Word
  {
    testName: 'match_k1to1_pWord_tWord_m50_v100kto100k',
    tObj: {
      fileName: 'k1_word_v100k.json'
    },
    pObj: {
      fileName:'k1_word_v100k_ditto_m50.json' 
    },
    testFn: 'testMatch', 
    props: ["prop1"]
  },
  // MATCH SIMPLE 1 Word to 1 Word
  {
    testName: 'matchSimple_k1to1_pWord_tWord_m50_v100kto100k',
    tObj: {
      fileName: 'k1_word_v100k.json'
    },
    pObj: {
      fileName:'k1_word_v100k_ditto_m50.json' 
    },
    testFn: 'testMatchSimple', 
  },
  // MATCH String
  {
    testName: 'match_k1to1_pString_tString_m50_v100kto100k',
    tObj: {
      fileName: 'k1_string_v100k.json'
    },
    pObj: {
      fileName:'k1_string_v100k_ditto_m50.json' 
    },
    testFn: 'testMatch', 
    props: ["prop1"]
  },
  // MATCH Paragraph 
  {
    testName: 'regMatch_k1to1_pRegMidStr_tWord_m50_v100kto100k',
    tObj: {
      fileName:'k1_word_v100k.json'
    },
    pObj: {
      fileName:'k1_word_v100k_regMidStr_m50.json' 
    },
    testFn: 'testMatch', 
    props: {prop1: {regExpMatch:true}}
  },
  // REG EXP Dot - reg exp match with one '.' in pattern, 50% match
  {
    testName: 'regMatch_k1to1_pRegDot_tWord_m50_v100kto100k',
    tObj: {
      fileName:'k1_word_v100k.json'
    },
    pObj: {
      fileName:'k1_word_v100k_regDot_m50.json' 
    },
    testFn: 'testMatch', 
    props: {prop1: {regExpMatch:true}}
  },
  // REG EXP DotStar - reg exp match with '.*' in pattern, 50% match
  {
    testName: 'regMatch_k1to1_pRegDotStar_tWord_m50_v100kto100k',
    tObj: {
      fileName:'k1_word_v100k.json'
    },
    pObj: {
      fileName:'k1_word_v100k_regDotStar_m50.json' 
    },
    testFn: 'testMatch', 
    props: {prop1: {regExpMatch:true}}
  },
  // REG EXP Phone - match using reg ex phone pattern, 50% match
  {
    testName: 'regMatch_k1to1_pRegPhone_tPhone_m50_v100kto100k',
    tObj: {
      fileName:'k1_phone_v100k.json'
    },
    pObj: {
      fileName:'k1_phone_v100k_regPhone_m50.json' 
    },
    testFn: 'testMatchSimple', 
    props: {phone: {regExpMatch:true}}
  },
  // k1to100_m50 - Match one property in pObj to tObj with 100 props
  // -----------------------------------------------------
  // FILTER TESTS
  // -----------------------------------------------------
  // k1to100_word - Match 100 properties in pObj to tObj, 100% match
  {
    testName: 'filter_k1to1_pWord_tWord_m50_v100kto100k',
    tObj: {
      fileName: 'k1_word_v100k.json'
    },
    pObj: {
      fileName:'k1_word_v100k_ditto_m50.json' 
    },
    testFn: 'testFilter', 
    props: ["prop1"]
  },
  // k1to100_pRegDotStar - Match 100 properties in pObj to tObj, 100% match

]
};


module.exports = {
  perfTests: perfTests
};


