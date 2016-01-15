var apom = require('../lib/index.js');
var should = require('should');

describe('Create Compare function',function(){

  it('should return property definitions with an object literal',function(done){
      apom.getPropDefns({"prop1":{}, "prop2":{regExpMatch:false}})
      .length.should.equal(1);
      done(); 
  }); 

  it('should return property definitions with an array',function(done){
      apom.getPropDefns(["propA","propZ"]).length.should.equal(2); 
      done(); 
  }); 

  it('should return property definitions with an array of mix of strings & objects',function(done){
      apom.getPropDefns(
        ["propA","propZ", 
         {name: "wank", matchIfRulePropMissing: false}])
      .length.should.equal(3); 
      done(); 
  }); 

  it('should create a function', function(done) {
    Object.prototype.toString
    .call(apom.makeMatchFn(["prop1","prop2"]))
    .should.equal("[object Function]"); 
    done();
  });

});


describe('When the makeMatchFn is used , ', function(){
  describe('For a straight, Non Reg-ex (===) comparison', function(){
    it('it should return true if equal value and equal type', 
      function(done) {
        var props = ["prop1"];
        var pObj = {"prop1":"abc"};
        var tObj = {"prop1":"abc"};
        var f = apom.makeMatchFn(props);
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(true);
          done(); 
        }); 
    });
    it('it should return false if equal value and un-equal type', 
      function(done) {
        var props = ["prop1","prop2"];
        var pObj = {"prop1":123};
        var tObj = {"prop1":"123"};
        var f = apom.makeMatchFn(props);
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(false);
          done(); 
        }); 
    });
    it('it should return false if partial match', 
      function(done) {
        var props = ["prop1","prop2"];
        var pObj = {"prop1":"b"};
        var tObj = {"prop1":"abc"};
        var f = apom.makeMatchFn(props);
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(false);
          done(); 
        }); 
    });
    it('it should return false if un-equal value and equal type', 
      function(done) {
        var props = ["prop1","prop2"];
        var options = {};
        var pObj = {"prop1":"abc"};
        var tObj = {"prop1":"abcd"};
        var f = apom.makeMatchFn(props);
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(false);
          done(); 
        }); 
    });
    it('it should return true if === for a Null type', 
      function(done) {
        var props = ["prop1"];
        var pObj = {"prop1":null};
        var tObj = {"prop1":null};
        var f = apom.makeMatchFn(props);
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(true);
          done(); 
        }); 
    });
    it('it should return true if === for an Undefined type', 
      function(done) {
        var imundefined; 
        var props = ["prop1"];
        var pObj = {prop1: imundefined};
        var tObj = {prop1: imundefined};
        var f = apom.makeMatchFn(props);
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(true);
          done(); 
        }); 
    });
    it('it should return true if === for an Boolean type', 
      function(done) {
        var props = ["prop1"];
        var pObj = {"prop1":false};
        var tObj = {"prop1":false};
        var f = apom.makeMatchFn(props);
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(true);
          done(); 
        }); 
    });
    it('it should return true if === for a Number type', 
      function(done) {
        var props = ["prop1"];
        var pObj = {"prop1":123456};
        var tObj = {"prop1":123456};
        var f = apom.makeMatchFn(props);
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(true);
          done(); 
        }); 
    });
    it('it should return false if !== for a Number type', 
      function(done) {
        var props = ["prop1"];
        var pObj = {"prop1":233};
        var tObj = {"prop1":234};
        var f = apom.makeMatchFn(props);
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(false);
          done(); 
        }); 
    });
    it('it should return false for a partially matched string start', 
      function(done) {
        var props = ["prop1","prop2"];
        var pObj = {"prop1":"ab","prop2":4};
        var tObj = {"prop1":"abc","prop2":4};
        var f = apom.makeMatchFn(props);
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(false);
          done(); 
        }); 
    });
    it('it should return false for a partially matched string middle', 
      function(done) {
        var props = ["prop1","prop2"];
        var pObj = {"prop1":"b","prop2":4};
        var tObj = {"prop1":"abc","prop2":4};
        var f = apom.makeMatchFn(props);
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(false);
          done(); 
        }); 
    });
    it('it should return false for a partially matched string end', 
      function(done) {
        var props = ["prop1","prop2"];
        var pObj = {"prop1":"c","prop2":4};
        var tObj = {"prop1":"abc","prop2":4};
        var f = apom.makeMatchFn(props);
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(false);
          done(); 
        }); 
    });
    it('it should return false for partially matched number start', 
      function(done) {
        var props = ["prop1","prop2"];
        var pObj = {"prop1":"abc","prop2":45};
        var tObj = {"prop1":"abc","prop2":4};
        var f = apom.makeMatchFn(props);
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(false);
          done(); 
        }); 
    });
    it('it should return false for partially matched number end', 
      function(done) {
        var props = ["prop1","prop2"];
        var pObj = {"prop1":"abc","prop2":34};
        var tObj = {"prop1":"abc","prop2":4};
        var f = apom.makeMatchFn(props);
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(false);
          done(); 
        }); 
    });
  }); // end of For a straight, Non Reg-ex (===) comparison

  describe('For a Reg-ex comparison', function(){
    describe('Where pObj is a string ', function(){
      it('it should return true if reg ex matches', 
        function(done) {
          var props = {"prop1":{"regExpMatch":true}};
          var pObj = {"prop1":"a.c"};
          var tObj = {"prop1":"abc"};
          var f = apom.makeMatchFn(props);
          f(pObj, tObj, function(doesMatch) {
            doesMatch.should.equal(true);
            done(); 
          }); 
      });
      it('it should return true if reg ex matches', 
        function(done) {
          var props = {"prop1":{"regExpMatch":true}};
          var pObj = {"prop1":".*dog"};
          var tObj = {"prop1":"cat ate the dog"};
          var f = apom.makeMatchFn(props);
          f(pObj, tObj, function(doesMatch) {
            doesMatch.should.equal(true);
            done(); 
          }); 
      });
      it('it should return false if reg ex does not match', 
        function(done) {
          var props = {"prop1":{"regExpMatch":true}};
          var pObj = {"prop1":"^dog.*"};
          var tObj = {"prop1":"cat ate the dog"};
          var f = apom.makeMatchFn(props);
          f(pObj, tObj, function(doesMatch) {
            doesMatch.should.equal(false);
            done(); 
          }); 
      });
      it('it should return true for matched string properties', 
        function(done) {
          var props = 
          {"prop1":{"regExpMatch":true}};
          var pObj = {"prop1":"ab."};
          var tObj = {"prop1":"abc"};
          var f = apom.makeMatchFn(props);
          f(pObj, tObj, function(doesMatch) {
            doesMatch.should.equal(true);
            done(); 
          }); 
      });
      it('it should return true for matched string properties', 
        function(done) {
          var props = 
            {"prop1":{"regExpMatch":true}};
          var pObj = {"prop1":".*"};
          var tObj = {"prop1":"abc"};
          var f = apom.makeMatchFn(props);
          f(pObj, tObj, function(doesMatch) {
            doesMatch.should.equal(true);
            done(); 
          }); 
      });
      it('it should return true for matched number properties', 
        function(done) {
          var props = {"prop1":{"regExpMatch":true}};
          var pObj = {"prop1":"4."};
          var tObj = {"prop1":45};
          var f = apom.makeMatchFn(props);
          f(pObj, tObj, function(doesMatch) {
            doesMatch.should.equal(true);
            done(); 
          }); 
      });
      it('it should return true if caps do match, by default', 
        function(done) {
          var props = {"prop1":{"regExpMatch":true}};
          var pObj = {"prop1":"aBc"};
          var tObj = {"prop1":"aBc"};
          var f = apom.makeMatchFn(props);
          f(pObj, tObj, function(doesMatch) {
            doesMatch.should.equal(true);
            done(); 
          }); 
      });
      it('it should return false if caps do not match, by default', 
        function(done) {
          var props = {"prop1":{"regExpMatch":true}};
          var pObj = {"prop1":"aBc"};
          var tObj = {"prop1":"abc"};
          var f = apom.makeMatchFn(props);
          f(pObj, tObj, function(doesMatch) {
            doesMatch.should.equal(false);
            done(); 
          }); 
      });
      it('it should return true if caps do not match if regExpIgnoreCase=true', 
        function(done) {
          var props = {"prop1":{"regExpMatch":true,"regExpIgnoreCase":true}};
          var pObj = {"prop1":"aBc"};
          var tObj = {"prop1":"abc"};
          var f = apom.makeMatchFn(props);
          f(pObj, tObj, function(doesMatch) {
            doesMatch.should.equal(true);
            done(); 
          }); 
      });
      it('it should return false if caps do not match if regExpIgnoreCase=false', 
        function(done) {
          var props = ['prop1.prop2'];
          var options = {regExpMatch:true, regExpIgnoreCase: false}; 
          var pObj = {"prop1":{prop2: "aBc"}};
          var tObj = {"prop1":{prop2: "abc"}};
          var f = apom.makeMatchFn(props,options);
          f(pObj, tObj, function(doesMatch) {
            doesMatch.should.equal(false);
            done(); 
          }); 
      });
      it('it should return true if match without an anchor start or end', 
        function(done) {
          var props = {"prop1":{"regExpMatch":true}};
          var pObj = {"prop1":"b"};
          var tObj = {"prop1":"abba"};
          var f = apom.makeMatchFn(props);
          f(pObj, tObj, function(doesMatch) {
            doesMatch.should.equal(true);
            done(); 
          }); 
      });
      it('it should return false if no match with regExpAnchorStart=true', 
        function(done) {
          var props = {"prop1":{"regExpMatch":true,"regExpAnchorStart":true}};
          var pObj = {"prop1":"b"};
          var tObj = {"prop1":"ab"};
          var f = apom.makeMatchFn(props);
          f(pObj, tObj, function(doesMatch) {
            doesMatch.should.equal(false);
            done(); 
          }); 
      });
      it('it should return true matches with regExpAnchorStart=true', 
        function(done) {
          var props = {"prop1":{"regExpMatch":true,"regExpAnchorStart":true}};
          var pObj = {"prop1":"a"};
          var tObj = {"prop1":"ab"};
          var f = apom.makeMatchFn(props);
          f(pObj, tObj, function(doesMatch) {
            doesMatch.should.equal(true);
            done(); 
          }); 
      });
      it('it should return false if no match with regExpAnchorEnd=true', 
        function(done) {
          var props = {"prop1":{"regExpMatch":true,"regExpAnchorEnd":true}};
          var pObj = {"prop1":"a"};
          var tObj = {"prop1":"ab"};
          var f = apom.makeMatchFn(props);
          f(pObj, tObj, function(doesMatch) {
            doesMatch.should.equal(false);
            done(); 
          }); 
      });
      it('it should return true if matches with options regExpAnchorEnd=true', 
        function(done) {
          var props = {"prop1":{"regExpMatch":true,"regExpAnchorEnd":true}};
          var pObj = {"prop1":"b"};
          var tObj = {"prop1":"ab"};
          var f = apom.makeMatchFn(props);
          f(pObj, tObj, function(doesMatch) {
            doesMatch.should.equal(true);
            done(); 
          }); 
      });
      it('it should return true on match allowing for properties ' + 
          'to be defined in options affecting all regExp property defintions', 
          function(done) {
            var props = ["prop1"]; 
            var options = 
              { regExpMatch:true,
                 regExpAnchorStart: true,
                 regExpAnchorEnd: true,
                 regExpIgnoreCase: true,
              };            
            var f = apom.makeMatchFn(props,options);

            var pObj = {"prop1":".bb."};
            var tObj = {"prop1":"abBc"};
            f(pObj, tObj, function(doesMatch) {
              doesMatch.should.equal(true);
              done(); 
            }); 
        });
    }); // end of Where pObj is a string 
    describe('Where pObj is a RegExp object ', function(){
      it('it should return true if matches', 
          function(done) {
          var props = {"prop1":{"regExpMatch":true}};
          var pObj = {"prop1":/.*an/};
          var tObj = {"prop1":"frank"};
          var f = apom.makeMatchFn(props);
          f(pObj, tObj, function(doesMatch) {
            doesMatch.should.equal(true);
            done(); 
          }); 
        });
      it('it should return false if does not match', 
        function(done) {
          var props = {"prop1":{"regExpMatch":true}};
          var pObj = {"prop1":/.*bn/};
          var tObj = {"prop1":"frank"};
          var f = apom.makeMatchFn(props);
          f(pObj, tObj, function(doesMatch) {
            doesMatch.should.equal(false);
            done(); 
          }); 
        });
      it('it should return false if does not match', 
        function(done) {
          var props = {"prop1":{"regExpMatch":true}};
          var pObj = {"prop1":/.*bn/};
          var tObj = {"prop1":"frank"};
          var f = apom.makeMatchFn(props);
          f(pObj, tObj, function(doesMatch) {
            doesMatch.should.equal(false);
            done(); 
          }); 
        });
      it('it should ignore regExpAnchorStart=true ', 
        function(done) {
          var props = {"prop1":{"regExpMatch":true,"regExpAnchorStart":true}};
          var pObj = {"prop1":/b/};
          var tObj = {"prop1":"ab"};
          var f = apom.makeMatchFn(props);
          f(pObj, tObj, function(doesMatch) {
            doesMatch.should.equal(true);
            done(); 
          }); 
      });
      it('it should ignore regExpAnchorEnd=true', 
        function(done) {
          var props = {"prop1":{"regExpMatch":true,"regExpAnchorEnd":true}};
          var pObj = {"prop1":/a/};
          var tObj = {"prop1":"ab"};
          var f = apom.makeMatchFn(props);
          f(pObj, tObj, function(doesMatch) {
            doesMatch.should.equal(true);
            done(); 
          }); 
      });
      describe('When cases do not match, ', function(){
        it('it should return false with default options', 
          function(done) {
            var props = {"prop2":{"regExpMatch":true}};
            var pObj = {"prop2":/frAnk/};
            var tObj = {"prop2":"frank"};
            var f = apom.makeMatchFn(props);
            f(pObj, tObj, function(doesMatch) {
              doesMatch.should.equal(false);
              done(); 
            }); 
        });
        it('it should ignore regExpIgnoreCase=true and return false ', 
          function(done) {
            var props = {"prop2":{"regExpMatch":true,"regExpIgnoreCase":true}};
            var pObj = {"prop2":/frAnk/};
            var tObj = {"prop2":"frank"};
            var f = apom.makeMatchFn(props);
            f(pObj, tObj, function(doesMatch) {
              doesMatch.should.equal(false);
              done(); 
            }); 
        });
        it('it should return true if regExp object includes ignore case flag ', 
          function(done) {
            var props = {"prop2":{"regExpMatch":true}};
            var pObj = {"prop2":/frAnk/i};
            var tObj = {"prop2":"frank"};
            var f = apom.makeMatchFn(props);
            f(pObj, tObj, function(doesMatch) {
              doesMatch.should.equal(true);
              done(); 
            }); 
        });
      });  // end of When cases do not match
    }); // end of Where pObj is a RegExp object 
  }); // end of For a Reg-ex comparison

  describe('For multiple single depth properties', function(){
    it('it should return true if all match', 
      function(done) {
        var props = ["prop1","prop2"];
        var pObj = {"prop1":"abc","prop2":34};
        var tObj = {"prop1":"abc","prop2":34};
        var f = apom.makeMatchFn(props);
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(true);
          done(); 
        }); 
      });
    it('it should return true if all match including null properties', 
      function(done) {
        var props = ["prop1","prop2"];
        var options = {};
        var pObj = {"prop1":"cat ate the dog","prop2":null};
        var tObj = {"prop1":"cat ate the dog","prop2":null};
        var f = apom.makeMatchFn(props);
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(true);
          done(); 
        }); 
      });
    it('it should return false if all do not match', 
      function(done) {
        var props = ["prop1","prop2"];
        var pObj = {"prop1":"x","prop2":"xyz"};
        var tObj = {"prop1":"abc","prop2":"xyz"};
        var f = apom.makeMatchFn(props);
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(false);
          done(); 
        }); 
      });
    it('it should return false if all do not match', 
      function(done) {
        var props = ["prop1","prop2"];
        var pObj = {"prop1":"abc","prop2":2};
        var tObj = {"prop1":"abc","prop2":"xyz"};
        var f = apom.makeMatchFn(props);
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(false);
          done(); 
        }); 
      });
  }); // end of For multiple single depth properties

  describe('For multiple different property definitions', function(done) {
    it('it should true when they match for single depth properties',  
      function(done) {
        var props = 
        {"prop1": {},  //default regExpMatch=false
         "prop2": {regExpMatch: true}
        };
        var pObj = {"prop1":"abc","prop2":"x.z"};
        var tObj = {"prop1":"abc","prop2":"xyz"};
        var f = apom.makeMatchFn(props);
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(true);
          done(); 
        }); 
    });
    it('it should false when they do not match for single depth properties',  
      function(done) {
        var props = 
        {"prop1": {},  //default regExpMatch=false
         "prop2": {regExpMatch: true}
        };
        var pObj = {"prop1":"a.c","prop2":"x.z"};
        var tObj = {"prop1":"abc","prop2":"xyz"};
        var f = apom.makeMatchFn(props);
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(false);
          done(); 
        }); 
    });
    it('it should true when they match for 2+ deep properties',  
      function(done) {
        var props = 
        {"prop1.cat": {regExpMatch: true, regExpIgnoreCase: false}, 
         "prop1.dog": {regExpMatch: true, regExpIgnoreCase: true}
        };
        var pObj = {prop1: {cat: "meow", dog: "bARk"}};
        var tObj = {prop1: {cat: "meow", dog: "bark"}};
        var f = apom.makeMatchFn(props);
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(true);
          done(); 
        }); 
    });
    it('it should false when they match for 2+ deep properties',  
      function(done) {
        var props = 
        {"prop1.cat": {regExpMatch: true, regExpIgnoreCase: false}, 
         "prop1.dog": {regExpMatch: true, regExpIgnoreCase: true}
        };
        var pObj = {prop1: {cat: "mEOw", dog: "b..k"}};
        var tObj = {prop1: {cat: "meow", dog: "bark"}};
        var f = apom.makeMatchFn(props);
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(false);
          done(); 
        }); 
    });
  });

  describe('When propDefnDefault values are included in options', function() {
    it('it should return true when it matches using those options', 
      function(done) {
        var props = ["prop1","prop2"];
        var options = 
            {regExpMatch: true, 
             regExpIgnoreCase: true};
        var pObj = {"prop1":"abc","prop2":"x.z"};
        var tObj = {"prop1":"aBc","prop2":"xyz"};
        var f = apom.makeMatchFn(props, options);
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(true);
          done(); 
        });        
      });
    it('it should return false when does not match using those options', 
      function(done) {
        var props = ["prop1","prop2"];
        var options = {regExpMatch: true};  //default value of regExpIgnoreCase=false
        var pObj = {"prop1":"abc","prop2":"x.z"};
        var tObj = {"prop1":"aBc","prop2":"xyz"};
        var f = apom.makeMatchFn(props, options);
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(false);
          done(); 
        });        
      });
    it('property defintions at the property level should override ' +
       'option propDefnDefault values', 
      function(done) {
        var options = {regExpMatch: true, regExpIgnoreCase: true};
        var props = 
        {"prop1.cat": {regExpMatch: true, regExpIgnoreCase: false}, 
         "prop1.dog": {}
        };
        var pObj = {prop1: {cat: "meow", dog: "bARk"}};
        var tObj = {prop1: {cat: "meow", dog: "bark"}};
        var f = apom.makeMatchFn(props, options);
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(true);
          done(); 
        });        
      });
    it('property defintions at the property level should override ' +
       'option propDefnDefault values', 
      function(done) {
        var options = {regExpMatch: true, regExpIgnoreCase: true};
        var props = 
        {"prop1.cat": {regExpMatch: true, regExpIgnoreCase: false}, 
         "prop1.dog": {}
        };
        var pObj = {prop1: {cat: "mEOw", dog: "bARk"}};
        var tObj = {prop1: {cat: "meow", dog: "bark"}};
        var f = apom.makeMatchFn(props, options);
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(false);
          done(); 
        });        
      });
  }); 

  describe('For missing object properties', function(){
    it('it should return false if a chosen poperty is missing in pObj', 
      function(done) {
        var props = ["prop1","prop2"];
        var pObj = {"prop1":"abc"};
        var tObj = {"prop1":"abc","prop2":4};
        var f = apom.makeMatchFn(props);
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(false);
          done(); 
        }); 
      });
    it('it should return false if a chosen poperty is missing in tObj', 
      function(done) {
        var props = ["prop1","prop2"];
        var pObj = {"prop1":"abc","prop2":4};
        var tObj = {"prop1":"abc"};
        var f = apom.makeMatchFn(props);
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(false);
          done(); 
        }); 
      });
    it('it should return false if a chosen poperty is missing in tObj ' + 
       'in a deep property', 
        function(done) {
          var props = ["prop1","prop2.cat.tail"];
          var pObj = {"prop1":"abc","prop2":{"cat":{"tail":"long"}}};
          var tObj = {"prop1":"abc","prop2":{"cat":{"nose":"short"}}};
          var f = apom.makeMatchFn(props);
          f(pObj, tObj, function(doesMatch) {
            doesMatch.should.equal(false);
            done(); 
        }); 
      });
    it('it should return false if a chosen poperty is missing in pObj ' + 
       'in a deep property', 
       function(done) {
          var props = ["prop1","prop2.cat.tail"];
          var pObj = {"prop1":"abc","prop2":{"cat":{"nose":"short"}}};
          var tObj = {"prop1":"abc","prop2":{"cat":{"tail":"long"}}};
          var f = apom.makeMatchFn(props);
          f(pObj, tObj, function(doesMatch) {
            doesMatch.should.equal(false);
            done(); 
          }); 
      });
    it('it should return false if a chosen poperty is missing in both objects', 
      function(done) {
        var props = ["prop1","prop2"];
        var pObj = {"prop1":"abc"};
        var tObj = {"prop1":"abc"};
        var f = apom.makeMatchFn(props);
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(false);
          done(); 
        }); 
      });
    it('it should return true if a property is missing in tObj and ' + 
       'options matchIfTObjPropMissing=true', 
       function(done) {
          var props = {"prop1":{},"prop2.cat":{"matchIfTObjPropMissing":true}};
          var pObj = {"prop1":"abc","prop2":{"cat":"yellow"}};
          var tObj = {"prop1":"abc","prop2":{"dog":true}};
          var f = apom.makeMatchFn(props);
          f(pObj, tObj, function(doesMatch) {
            doesMatch.should.equal(true);
            done(); 
          }); 
      });
    it('it should return true if a property is missing in pObj and ' + 
       'options matchIfPObjPropMissing=true', 
       function(done) {
        var props = {"prop1":{},"prop2.cat":{"matchIfPObjPropMissing":true}};
        var pObj = {"prop1":"abc","prop2":{"dog":"barks"}};
        var tObj = {"prop1":"abc","prop2":{"cat":"yellow"}};
        var f = apom.makeMatchFn(props);
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(true);
          done(); 
        }); 
    });
    it('it should return true if properties are missing in both objects ' + 
       'and both options ...PropMissing=true', 
       function(done) {
          var props = 
            {"prop1":{},
             "prop2.cat":
                {"matchIfTObjPropMissing":true,
                 "matchIfPObjPropMissing":true}};
          var pObj = {"prop1":"abc","prop2":{"dog":"barks"}};
          var tObj = {"prop1":"abc","prop2":{"dog":"hank"}};
          var f = apom.makeMatchFn(props);
          f(pObj, tObj, function(doesMatch) {
            doesMatch.should.equal(true);
            done(); 
          }); 
     });
    it('it should return true if property chains are missing in both objects ' + 
      'and both options ...PropMissing=true', 
      function(done) {
        var props = 
          {"prop1":{},
           "prop2.cat":
              {"matchIfTObjPropMissing":true,
               "matchIfPObjPropMissing":true}};
        var pObj = {"prop1":"abc"};
        var tObj = {"prop1":"abc"};
        var f = apom.makeMatchFn(props);
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(true);
          done(); 
        }); 
    });
  }); // end of For missing object properties

  describe('For deep properties (more than one deep)', function(){
    it('it should return true for a match', 
      function(done) {
        var props = ["prop1.cat"];
        var pObj = {"prop1":{"cat":"gray"}};
        var tObj = {"prop1":{"cat":"gray"}};
        var f = apom.makeMatchFn(props);
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(true);
          done(); 
        }); 
    });
    it('it should return false if a target property is missing', 
      function(done) {
        var props = ["prop1.cat"];
        var pObj = {"prop1":{"dog":"gray"}};
        var tObj = {"prop1":{"cat":"gray"}};
        var f = apom.makeMatchFn(props);
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(false);
          done(); 
        }); 
    });
    it('it should return false for a non-match', 
      function(done) {
        var props = ["prop1.cat"];
        var pObj = {"prop1":{"cat":"black"}};
        var tObj = {"prop1":{"cat":"gray"}};
        var f = apom.makeMatchFn(props);
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(false);
          done(); 
        }); 
    });
    it('it should return true when multiple deep properties all match', 
      function(done) {
        var props = ["prop1.cat","prop2.dog.paw"];
        var pObj = {"prop1":{"cat":"gray"},"prop2":{"dog":{"paw":"white"}}};
        var tObj = {"prop1":{"cat":"gray"},"prop2":{"dog":{"paw":"white"}}};
        var f = apom.makeMatchFn(props);
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(true);
          done(); 
        }); 
    });
    it('it should return false when any multiple deep properties do not match', 
      function(done) {
        var props = ["prop1.cat","prop2.dog.paw"];
        var pObj = {"prop1":{"cat":"gray"},"prop2":{"dog":{"paw":"white"}}};
        var tObj = {"prop1":{"cat":"gray"},"prop2":{"dog":{"paw":"purple"}}};
        var f = apom.makeMatchFn(props);
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(false);
          done(); 
        }); 
    });
    it('it should return true if all identified properties match ' + 
       'and ignore andy addtl properties', 
        function(done) {
          var props = ["prop1.cat","prop2.dog.paw"];
          var pObj = 
            {"prop1":{"cat":"gray"},
             "prop2":{"dog":{"paw":"white"}}};
          var tObj = 
            {"prop1":{"cat":"gray"},
             "prop2":{"dog":{"paw":"white","bark":"loud"}}};
          var f = apom.makeMatchFn(props);
          f(pObj, tObj, function(doesMatch) {
            doesMatch.should.equal(true);
            done(); 
          }); 
    });
    it('it should return true for a reg-ex match', 
      function(done) {
        var props = {"prop1.cat":{"regExpMatch":true}};
        var pObj = {"prop1":{"cat":"gr.y"}};
        var tObj = {"prop1":{"cat":"gray"}};
        var f = apom.makeMatchFn(props);
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(true);
          done(); 
        }); 
    });
    it('it should return false if one out of many does not match', 
      function(done) {
        var props = ["prop1.cat","prop2.dog.paw"];
        var options = {};
        var pObj = {"prop1":{"cat":"gray"},"prop2":{"dog":{"paw":"black"}}};
        var tObj = {"prop1":{"cat":"gray"},"prop2":{"dog":{"paw":"white"}}};
        var f = apom.makeMatchFn(props, options);
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(false);
          done(); 
        }); 
    });
  }); // end of For deep properties (more than one deep)

  describe('For properties with variablesAllowed=true', function(){
    it('it should replace the variable and return true for match', 
      function(done) {
        var props = 
          {"prop1":{"variablesAllowed":true,"variablesStartStr":"/:"}};
        var options =  
          {getVariables:  function(cb) {
            return cb(null, {youngDog: "puppy"}); 
          }};
        var pObj = {"prop1":"/:youngDog"};
        var tObj = {"prop1":"puppy"};
        var f = apom.makeMatchFn(props, options);
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(true);
          done(); 
        }); 
    });
    it('it should replace the variable and return false for non-match', 
      function(done) {
        var props = 
          {"prop1":{"variablesAllowed":true,"variablesStartStr":"/:"}};
        var options =               
          {getVariables:  function(cb) {
            return cb(null, {youngDog: "puppy"}); 
          }};
        var pObj = {"prop1":"/:youngDog"};
        var tObj = {"prop1":"kitten"};
        var f = apom.makeMatchFn(props, options);
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(false);
          done(); 
        }); 
    });
    it('it should default the start string to ~', 
      function(done) {
        var props = 
          {"prop1":{"variablesAllowed":true}};
        var options =               
          {getVariables:  function(cb) {
            return cb(null, {youngDog: "puppy"}); 
          }};
        var pObj = {"prop1":"~youngDog"};
        var tObj = {"prop1":"puppy"};
        var f = apom.makeMatchFn(props, options);
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(true);
          done(); 
        }); 
    });
    it('it should allow other variablesStartStr', 
      function(done) {
        var props = 
          {"prop1":{"variablesAllowed":true,"variablesStartStr":":::"}};
        var options = 
          {getVariables:  function(cb) {
            return cb(null, {youngDog: "puppy"}); 
          }};
        var pObj = {"prop1":":::youngDog"};
        var tObj = {"prop1":"puppy"};
        var f = apom.makeMatchFn(props, options);
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(true);
          done(); 
        }); 
    });
    it('it should allow other variablesStartStr that include ' + 
      'reserved regExp characters', 
      function(done) {
        var props = {"prop1":{"variablesAllowed":true,"variablesStartStr":"+"}};
        var options =      
          {getVariables:  function(cb) {
            return cb(null, {youngDog: "puppy"}); 
          }};
        var pObj = {"prop1":"+youngDog"};
        var tObj = {"prop1":"puppy"};
        var f = apom.makeMatchFn(props, options);
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(true);
          done(); 
        }); 
    });
    it('it should replace all occurances of the variable', 
      function(done) {
        var props = {"prop1":{"variablesAllowed":true,"variablesStartStr":"+"}};
        var options = 
          {getVariables:  function(cb) {
            return cb(null, {youngDog: "puppy"}); 
          }};
        var pObj = {"prop1":"+youngDog+youngDog"};
        var tObj = {"prop1":"puppypuppy"};
        var f = apom.makeMatchFn(props, options);
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(true);
          done(); 
        }); 
    });
    it('it should allow string values prior to the variable name', 
      function(done) {
        var props = {"prop1":{"variablesAllowed":true,"variablesStartStr":"+"}};
        var options = 
          {getVariables:  function(cb) {
            return cb(null, {youngDog: "puppy"}); 
        }};
        var pObj = {"prop1":"cute+youngDog"};
        var tObj = {"prop1":"cutepuppy"};
        var f = apom.makeMatchFn(props, options);
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(true);
          done(); 
        }); 
    });
    it('it should allow string values immediately after the variable ' + 
       'if variablesEndStr is defined', 
       function(done) {
          var props = 
            {"prop1":
              {"variablesAllowed":true,
               "variablesStartStr":"~",
               "variablesEndStr":"~"}};
          var options = 
            {getVariables:  function(cb) {
              return cb(null, {youngDog: "puppy"}); 
            }};
          var pObj = {"prop1":"~youngDog~cat"};
          var tObj = {"prop1":"puppycat"};
          var f = apom.makeMatchFn(props, options);
          f(pObj, tObj, function(doesMatch) {
            doesMatch.should.equal(true);
            done(); 
          }); 
    });
    it('it should allow string values immediately after the variable ' + 
       'if variablesEndStr is defined with a different character', 
       function(done) {
          var props = 
            {"prop1":
              {"variablesAllowed":true,
               "variablesStartStr":"~",
               "variablesEndStr":"+"}};
          var options = 
            {getVariables:  function(cb) {
              return cb(null, {youngDog: "puppy"}); 
            }};
          var pObj = {"prop1":"~youngDog+cat"};
          var tObj = {"prop1":"puppycat"};
          var f = apom.makeMatchFn(props, options);
          f(pObj, tObj, function(doesMatch) {
            doesMatch.should.equal(true);
            done(); 
          }); 
    });
    it('it should replace multiple occurances of different variables', 
      function(done) {
        var props = {"prop1":{"variablesAllowed":true,"variablesStartStr":"+"}};
        var options = 
          {getVariables:  function(cb) {
            return cb(null, 
            {youngDog: "puppy", youngCat: "kitten", youngSheep:"ewe"}); 
          }};
        var pObj = {"prop1":"+youngDog+youngCat+youngSheep"};
        var tObj = {"prop1":"puppykittenewe"};
        var f = apom.makeMatchFn(props, options);
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(true);
          done(); 
        }); 
    });
    it('it should allow the variablesAllowed to be set in options to affect ' + 
       'all property definitions', 
       function(done) {
          var props = ["prop1.cat","prop2.dog.paw"];
          var options = 
            {getVariables:  function(cb) {
              return cb(null,{colorWhite: "white", colorGray: "gray"}); },
              variablesAllowed:true, 
              variablesStartStr: '+'
            };
          var pObj = 
            {"prop1": {"cat":"+colorGray"},
             "prop2":{"dog":{"paw":"+colorWhite"}}};
          var tObj = 
            {"prop1": {"cat":"gray"},
             "prop2": {"dog":{"paw":"white"}}};
          var f = apom.makeMatchFn(props, options);
          f(pObj, tObj, function(doesMatch) {
            doesMatch.should.equal(true);
            done(); 
          }); 
      });
    it('it should match with a regular expression (as a string) ',
       function(done) {
          var props = ["prop1.cat"];
          var options = 
            {getVariables:  function(cb) {
              return cb(null,{colorGray: "gr.y"}); },
              regExpMatch: true,
              variablesAllowed:true, 
              variablesStartStr: '+'
            };
          var f = apom.makeMatchFn(props, options);

          var pObj = 
            {"prop1": {"cat":"+colorGray"}};
          var tObj = 
            {"prop1": {"cat":"gray"}};
          f(pObj, tObj, function(doesMatch) {
            doesMatch.should.equal(true);
            done(); 
          }); 
      });
    it('it should not error if a property value is not a string', 
      function(done) {
        var props = ["prop1","prop2","prop3","prop4","prop5.init"];
        var options = 
          {getVariables:  function(cb) {
            return cb(null, 
              {testVarStr1: "puppy", testVarStr2: "cat",anotherVar:"worm"}); 
          },
          variablesAllowed:true, 
          variablesStartStr: '+',
          regExpMatch: true
         };
        var f = apom.makeMatchFn(props, options);

        var imundefined; 
        var pObj = 
          {prop1:2,
           prop2:null,
           prop3: imundefined, 
           prop4:/a/,
           prop5:{"init":573}};
        var tObj = 
          {prop1:2,
           prop2:null,
           prop3: imundefined, 
           prop4:"abc",
           prop5:{"init":573}};
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(true);
          done(); 
        }); 
      });
    it('it should allow getVariables fn for each property', 
      function(done) {
        var props = 
          {"prop1":
            {"variablesAllowed":true,
             "variablesStartStr":"/:",
             getVariables:  function(cb) {
              return cb(null, {youngDog: "puppy"}); 
            }},
           "prop2":
            {"variablesAllowed":true,
             "variablesStartStr":"/:",
             getVariables:  function(cb) {
              return cb(null, {youngDog: "koinu"}); 
            }}
          };
        var f = apom.makeMatchFn(props);

        var pObj = {"prop1":"/:youngDog", "prop2": "/:youngDog"};
        var tObj = {"prop1":"puppy", "prop2": "koinu"};
        f(pObj, tObj, function(doesMatch) {
          doesMatch.should.equal(true);
          done(); 
        }); 
    });
    describe('when the pObj value is the variable name only and ' + 
        'the variable value is an object', function() {
      it('it should replace the variable name with the object',
         function(done) {
            var props = ["prop1.cat"];
            var options = 
              {getVariables:  function(cb) {
                return cb(null,{colorGray: /gr.y/i}); },
              regExpMatch: true,
              variablesAllowed:true, 
              variablesStartStr: '+'
              };
            var f = apom.makeMatchFn(props, options);

            var pObj = 
              {"prop1": {"cat":"+colorGray"}};
            var tObj = 
              {"prop1": {"cat":"graY"}};
            f(pObj, tObj, function(doesMatch) {
              doesMatch.should.equal(true);
              done(); 
            }); 
      }); //end of it
      it('it should replace the variable name with the object ' + 
         'even when variablesEndStr is included', function(done) {
            var props = ["prop1.cat"];
            var options = 
              {getVariables:  function(cb) {
                return cb(null,{colorGray: /gr.y/i}); },
              regExpMatch: true,
              variablesAllowed:true, 
              variablesStartStr: '+',
              variablesEndStr: ':'
              };
            var f = apom.makeMatchFn(props, options);

            var pObj = 
              {"prop1": {"cat":"+colorGray:"}};
            var tObj = 
              {"prop1": {"cat":"graY"}};
            f(pObj, tObj, function(doesMatch) {
              doesMatch.should.equal(true);
              done(); 
            }); 
      }); //end of it
      it('it should replace the variable name with the object as a string ' + 
         'if the pObj value is not a var name only',function(done) {
            var props = ["prop1.cat"];
            var options = 
              {getVariables:  function(cb) {
                return cb(null,{colorGray: /gr.y/i}); },
              regExpMatch: true,
              variablesAllowed:true, 
              variablesStartStr: '+',
              variablesEndStr: ':'
              };
            var f = apom.makeMatchFn(props, options);

            var pObj = 
              {"prop1": {"cat":"bl+colorGray:wh"}};
            var tObj = 
              {"prop1": {"cat":"bl/gr.y/iwh"}};
            f(pObj, tObj, function(doesMatch) {
              doesMatch.should.equal(true);
              done(); 
            }); 
      }); //end of it
    }); // end of when the pObj value is the variable name only...
  }); // end of For properties with variablesAllowed=true

  describe('When a custom match function is defined ', 
    function() {
      describe('for a single property', function() {

      var matchFn = function(pObjProp, tObjProp, cb) {
        return cb(tObjProp.exists && tObjProp.value > pObjProp.value);  
      }; 
      var doesItMatch = apom.makeMatchFn({"cat.kittens": {propMatchFn: matchFn}}); 

      it('should return true if a match',function(done){

        doesItMatch(
          {cat:{kittens:2}}, 
          {cat:{kittens:5}}, 
          function(doesMatch) {
            doesMatch.should.equal(true); 
            done(); 
        }); 

      }); // end of it

      it('should return false if not a match',function(done){

        doesItMatch(
          {cat:{kittens:6}}, 
          {cat:{kittens:5}}, 
          function(doesMatch) {
            doesMatch.should.equal(false); 
            done(); 
        }); 

      }); // end of it
    });
    describe('for all properties via options default' +
      ' in options', function() {

      var matchFn = function(pObjProp, tObjProp, cb) {
        return cb(tObjProp.exists && tObjProp.value > pObjProp.value);  
      }; 
      var doesItMatch = apom.makeMatchFn(
        ["cat.kittens", "dog.puppies"], 
         {propMatchFn: matchFn}); 

      it('should return true if a match',function(done){

        doesItMatch(
          {cat:{kittens:2}, dog:{puppies:10}}, 
          {cat:{kittens:5}, dog:{puppies:12}}, 
          function(doesMatch) {
            doesMatch.should.equal(true); 
            done(); 
        }); 

      }); // end of it

      it('should return false if not a match',function(done){

        doesItMatch(
          {cat:{kittens:5}, dog:{puppies:12}}, 
          {cat:{kittens:6}, dog:{puppies:10}}, 
          function(doesMatch) {
            doesMatch.should.equal(false); 
            done(); 
        }); 

      }); // end of it
    }); // end of When a propMatchFn is defined as default for all properties
  }); // When a user defined function is called

 describe('pObj or tObj property values', 
    function() {

    it('should not be changed for a simple match ', 
      function(done) {
        var props = ["prop1"];
        var f = apom.makeMatchFn(props);

        var pObj = {"prop1":"abc"};
        var tObj = {"prop1":"abc"};
        f(pObj, tObj, function(doesMatch) {
          pObj.should.match({"prop1":"abc"}); 
          tObj.should.match({"prop1":"abc"}); 
          doesMatch.should.equal(true);
          done(); 
        }); 
    }); // end of it

    it('should not be changed when variables are replaced', 
      function(done) {
        var props = 
          {"prop1":{"variablesAllowed":true,"variablesStartStr":"/:"}};
        var options =  
          {getVariables:  function(cb) {
            return cb(null, {youngDog: "puppy"}); 
          }};
        var pObj = {"prop1":"/:youngDog"};
        var tObj = {"prop1":"puppy"};
        var f = apom.makeMatchFn(props, options);
        f(pObj, tObj, function(doesMatch) {
          pObj.should.match({"prop1":"/:youngDog"}); 
          tObj.should.match({"prop1":"puppy"}); 
          doesMatch.should.equal(true);
          done(); 
        }); 
    });

    it('should not be changed when regular expressions are used (as a string)', 
      function(done) {
        var props = {"prop1":{"regExpMatch":true}};
        var pObj = {"prop1":"a.c"};
        var tObj = {"prop1":"abc"};
        var f = apom.makeMatchFn(props);
        f(pObj, tObj, function(doesMatch) {
          pObj.should.match({"prop1":"a.c"}); 
          tObj.should.match({"prop1":"abc"}); 
          doesMatch.should.equal(true);
          done(); 
        }); 
    });

    it('should not be changed when regular expressions are used (as an obj)', 
      function(done) {
        var props = {"prop1":{"regExpMatch":true}};
        var pObj = {"prop1":/a.c/};
        var tObj = {"prop1":"abc"};
        var f = apom.makeMatchFn(props);
        f(pObj, tObj, function(doesMatch) {
          pObj.should.match({"prop1":/a.c/}); 
          tObj.should.match({"prop1":"abc"}); 
          doesMatch.should.equal(true);
          done(); 
        }); 
      });

    it('should not be changed when a custom match function is defined ' +
       'which does not change the prop values', function(done) {

        var matchFn = function(pObjProp, tObjProp, cb) {
          return cb(tObjProp.exists && tObjProp.value > pObjProp.value);  
        }; 
        var doesItMatch = 
            apom.makeMatchFn({"cat.kittens": {propMatchFn: matchFn}}); 

        var pObj = {cat:{kittens:2}};
        var tObj = {cat:{kittens:5}};
        doesItMatch(
          pObj,
          tObj,
          function(doesMatch) {
            pObj.should.match({cat:{kittens:2}}); 
            tObj.should.match({cat:{kittens:5}}); 
            doesMatch.should.equal(true); 
            done(); 
        }); 
    }); // end of it

    it('should not be changed when a custom match function is defined ' +
       'which does change the prop values', function(done) {

        var matchFn = function(pObjProp, tObjProp, cb) {
          tObjProp.value = tObjProp.value + 1; 
          pObjProp.value = pObjProp.value + 1; 
          return cb(tObjProp.exists && tObjProp.value > pObjProp.value);  
        }; 
        var doesItMatch = 
            apom.makeMatchFn({"cat.kittens": {propMatchFn: matchFn}}); 

        var pObj = {cat:{kittens:2}};
        var tObj = {cat:{kittens:5}};
        doesItMatch(
          pObj,
          tObj,
          function(doesMatch) {
            pObj.should.match({cat:{kittens:2}}); 
            tObj.should.match({cat:{kittens:5}}); 
            doesMatch.should.equal(true); 
            done(); 
        }); 
    }); // end of it

    it('should not be changed when a custom match function is defined ', 
      function(done) {

        var matchFn = function(pObjProp, tObjProp, cb) {
          return cb(tObjProp.exists && tObjProp.value > pObjProp.value);  
        }; 
        var doesItMatch = 
            apom.makeMatchFn({"cat.kittens": {propMatchFn: matchFn}}); 

        var pObj = {cat:{kittens:2}};
        var tObj = {cat:{kittens:5}};
        doesItMatch(
          pObj,
          tObj,
          function(doesMatch) {
            pObj.should.match({cat:{kittens:2}}); 
            tObj.should.match({cat:{kittens:5}}); 
            doesMatch.should.equal(true); 
            done(); 
        }); 
    }); // end of it
  }); // end of pObj & tObj property values

}); // end of When the makeMatchFn is used


describe('When matches is called without propMatchFns', function() {
  it('it should return true when it matches using strings', 
    function(done) {
      apom.matches(
        {cat: "yellow"}, 
        {cat: "yellow"},
        function(doesMatch) {
          doesMatch.should.equal(true); 
          done();
        });
         
  });
  it('it should return false when it does not match using strings', 
    function(done) {
      apom.matches(
        {cat: "yellow"}, 
        {cat: "gray"},
        function(doesMatch) {
          doesMatch.should.equal(false); 
          done();
        });
         
  });
  it('it should return true if there are additional properties on ' + 
    ' the tObj (target object) but the other properties match',  
    function(done) {
      apom.matches(
        {cat: "yellow"}, 
        {cat: "yellow", dog: "black"},
        function(doesMatch) {
          doesMatch.should.equal(true); 
          done();
        });
         
  });
  it('it should return FALSE if there are additional properties on ' + 
    ' the pObj (pattern object) and the other properties match', 
    function(done) {
      apom.matches(
        {cat: "yellow", dog: "black"},
        {cat: "yellow"}, 
        function(doesMatch) {
          doesMatch.should.equal(false); 
          done();
        });
         
  });
  it('it should return true when it matches with deep properties', 
    function(done) {
      apom.matches(
        {pet: {cat: {tail: "long", paws: 4}}}, 
        {pet: {cat: {tail: "long", paws: 4}}},
        function(doesMatch) {
          doesMatch.should.equal(true); 
          done();
        });
    });
  it('it should return false when it does not match with deep properties', 
    function(done) {
      apom.matches(
        {pet: {cat: {tail: "long"}}}, 
        {pet: {cat: {tail: "curly"}}},
        function(doesMatch) {
          doesMatch.should.equal(false); 
          done();
        });
    });
  it('it should return false if matches given a regObj in the pObj', 
    function(done) {
      apom.matches(
        {pet: {cat: {tail: /l.ng/}}}, 
        {pet: {cat: {tail: "long"}}},
        function(doesMatch) {
          doesMatch.should.equal(false); 
          done();
        });
    });
  it('it should return false if does not match given a regObj in the pObj', 
    function(done) {
      apom.matches(
        {pet: {cat: {tail: /l.g/}}}, 
        {pet: {cat: {tail: "long"}}},
        function(doesMatch) {
          doesMatch.should.equal(false); 
          done();
        });
    });
}); 

describe('When makeFilterPatternObjectsFn is called', function() {
  it('it should filter the pattern objects with simple properties', 
    function(done) {
      var props = ["pet"]; 
      var f = apom.makeFilterPatternObjectsFn(props);

      var pObjs = [
          {pet: "dog"},
          {pet: "rabbit"},
          {pet: "cat"}
      ]; 
      var tObj = {pet: "cat"}; 
      f(
        pObjs, 
        tObj,
        function(result) {
          result.should.match([{pet: "cat"}]); 
          done();
      });
  });
  it('it should filter the pattern objects with deep properties', 
    function(done) {
      var props = ["tail.color"]; 
      var f = apom.makeFilterPatternObjectsFn(props);

      var pObjs = [
          {type: "dog", paws: {count: 4}, tail: {count: 1, color: "black"}},
          {type: "rabbit", paws: {count: 3}, tail: {count: 1, color: "white"}},
          {type: "cat", paws: {count: 4}, tail: {color: "gray"}},
          {type: "lizard", paws: {count: 0}, tail: {color: "gray"}},
      ]; 
      var tObj = {tail: {color: "gray"}}; 
      f(
        pObjs, 
        tObj,
        function(result) {
          result.should.match(
              [{type: "cat", paws: {count: 4}, tail: {color: "gray"}},
               {type: "lizard", paws: {count: 0}, tail: {color: "gray"}}
              ]); 
          done();
      });
  });
  it('it should filter the pattern objects with regular expressions', 
    function(done) {
      var options = {regExpMatch: true};
      var props = ["tail.color"]; 
      var f = apom.makeFilterPatternObjectsFn(props,options);

      var pObjs = [
          {type: "dog", paws: {count: 4}, tail: {count: 1, color: "black"}},
          {type: "rabbit", paws: {count: 3}, tail: {count: 1, color: "white"}},
          {type: "cat", paws: {count: 4}, tail: {color: "gray"}},
          {type: "lizard", paws: {count: 0}, tail: {color: /gr.y/}},
      ]; 
      var tObj = {tail: {color: "gray"}}; 
      f(
        pObjs, 
        tObj,
        function(result) {
          result.should.match(
              [{type: "cat", paws: {count: 4}, tail: {color: "gray"}},
               {type: "lizard", paws: {count: 0}, tail: {color: /gr.y/}}
              ]); 
          done();
      });
  });
  it('it should filter the pattern objects with variables replaced', 
    function(done) {
      var options =  
          {regExpMatch: true,
           variablesAllowed:true,
           variablesStartStr:"~",
          getVariables:  function(cb) {
            return cb(null, {grayColor: /gr.y/i}); 
          }};
      var props = ["tail.color"]; 
      var f = apom.makeFilterPatternObjectsFn(props,options);

      var pObjs = [
          {type: "dog", paws: {count: 4}, tail: {count: 1, color: "black"}},
          {type: "rabbit", paws: {count: 3}, tail: {count: 1, color: "white"}},
          {type: "cat", paws: {count: 4}, tail: {color: "~grayColor"}},
          {type: "lizard", paws: {count: 0}, tail: {color: "~grayColor"}},
      ]; 
      var tObj = {tail: {color: "grey"}}; 
      f(
        pObjs, 
        tObj,
        function(result) {
          result.should.match(
              [{type: "cat", paws: {count: 4}, tail: {color: "~grayColor"}},
               {type: "lizard", paws: {count: 0}, tail: {color: "~grayColor"}}
              ]); 
          done();
      });
  });
}); 

describe('When makeFilterTargetObjectsFn is called', function() {
  it('it should filter the target objects with simple properties', 
    function(done) {
      var props = ["pet"]; 
      var pObj = {pet: "cat"}; 
      var tObjs = [
          {pet: "dog"},
          {pet: "rabbit"},
          {pet: "cat"}
      ]; 
      var f = apom.makeFilterTargetObjectsFn(props);
      f(
        pObj, 
        tObjs,
        function(result) {
          result.should.match([{pet: "cat"}]); 
          done();
      });
  });
  it('it should filter the target objects with deep properties', 
    function(done) {
      var props = ["tail.color"]; 
      var pObj = {tail: {color: "gray"}}; 
      var tObjs = [
          {type: "dog", paws: {count: 4}, tail: {count: 1, color: "black"}},
          {type: "rabbit", paws: {count: 3}, tail: {count: 1, color: "white"}},
          {type: "cat", paws: {count: 4}, tail: {color: "gray"}},
          {type: "lizard", paws: {count: 0}, tail: {color: "gray"}},
      ]; 
      var f = apom.makeFilterTargetObjectsFn(props);
      f(
        pObj, 
        tObjs,
        function(result) {
          result.should.match(
              [{type: "cat", paws: {count: 4}, tail: {color: "gray"}},
               {type: "lizard", paws: {count: 0}, tail: {color: "gray"}}
              ]); 
          done();
      });
  });
  it('it should filter the target objects with regular expressions', 
    function(done) {
      var options = {regExpMatch: true};
      var props = ["tail.color"]; 
      var f = apom.makeFilterTargetObjectsFn(props,options);

      var pObj = {tail: {color: /gr.y/}}; 
      var tObjs = [
          {type: "dog", paws: {count: 4}, tail: {count: 1, color: "black"}},
          {type: "rabbit", paws: {count: 3}, tail: {count: 1, color: "white"}},
          {type: "cat", paws: {count: 4}, tail: {color: "gray"}},
          {type: "lizard", paws: {count: 0}, tail: {color: "grey"}},
      ]; 
      f(
        pObj, 
        tObjs,
        function(result) {
          result.should.match(
              [{type: "cat", paws: {count: 4}, tail: {color: "gray"}},
               {type: "lizard", paws: {count: 0}, tail: {color: "grey"}}
              ]); 
          done();
      });
  });
  it('it should filter the target objects with variables replaced', 
    function(done) {
      var options =  
          {regExpMatch: true,
           variablesAllowed:true,
           variablesStartStr:"~",
           getVariables:  function(cb) {
             return cb(null, {grayColor: /gr.y/i}); 
           }};
      var props = ["tail.color"]; 
      var f = apom.makeFilterTargetObjectsFn(props,options);

      var pObj = {tail: {color: "~grayColor"}}; 
      var tObjs = [
          {type: "dog", paws: {count: 4}, tail: {count: 1, color: "black"}},
          {type: "rabbit", paws: {count: 3}, tail: {count: 1, color: "white"}},
          {type: "cat", paws: {count: 4}, tail: {color: "gray"}},
          {type: "lizard", paws: {count: 0}, tail: {color: "GREY"}},
      ]; 
      f(
        pObj, 
        tObjs,
        function(result) {
          result.should.match(
              [{type: "cat", paws: {count: 4}, tail: {color: "gray"}},
               {type: "lizard", paws: {count: 0}, tail: {color: "GREY"}}
              ]); 
          done();
      });
  });
}); 

describe('When filterPatternObjects is called', function() {
  it('it should filter the pattern objects with simple properties', 
    function(done) {
      var pObjs = [
          {pet: "dog"},
          {pet: "rabbit"},
          {pet: "cat"}
      ]; 
      var tObj = {pet: "cat"}; 
      apom.filterPatternObjects(
        pObjs, 
        tObj,
        function(result) {
          result.should.match([{pet: "cat"}]); 
          done();
      });
  });
  it('it should filter the pattern objects with deep properties', 
    function(done) {
      var pObjs = [
          {tail: {color: "black"}},
          {tail: {color: "white"}},
          {tail: {color: "gray"}},
      ]; 
      var tObj = {tail: {color: "gray"}}; 
      apom.filterPatternObjects(
        pObjs, 
        tObj,
        function(result) {
          result.should.match(
              [{tail: {color: "gray"}}]); 
          done();
      });
  });
  it('it should filter the pattern objects with regular expressions', 
    function(done) {
      var pObjs = [
          {type: "dog", tail: {color: "black"}},
          {type: "rabbit", tail: {color: "white"}},
          {type: "cat", tail: {color: "gray"}},
          {type: "cat", tail: {color: /gr.y/}},
      ]; 
      var tObj = {type:"cat", tail: {color: "gray"}}; 
      apom.filterPatternObjects(
          pObjs, 
          tObj, 
          function(result) {
            result.should.match(
                [{type: "cat", tail: {color: "gray"}},
                 {type: "cat", tail: {color: /gr.y/}}
                ]); 
            done();
          }
      );
  });
}); 

describe('When filterTargetObjects is called', function() {
  it('it should filter the target objects with simple properties', 
    function(done) {
      var pObj = {pet: "cat"}; 
      var tObjs = [
          {pet: "dog"},
          {pet: "rabbit"},
          {pet: "cat"}
      ]; 
      apom.filterTargetObjects(
          pObj, 
          tObjs,
          function(result) {
            result.should.match([{pet: "cat"}]); 
            done();
          }
      );
  });
  it('it should filter the target objects with deep properties', 
    function(done) {
      var pObj = {tail: {color: "gray"}}; 
      var tObjs = [
          {type: "dog", paws: {count: 4}, tail: {count: 1, color: "black"}},
          {type: "rabbit", paws: {count: 3}, tail: {count: 1, color: "white"}},
          {type: "cat", paws: {count: 4}, tail: {color: "gray"}},
          {type: "lizard", paws: {count: 0}, tail: {color: "gray"}},
      ]; 
      apom.filterTargetObjects(
          pObj, 
          tObjs,
          function(result) {
            result.should.match(
                [{type: "cat", paws: {count: 4}, tail: {color: "gray"}},
                 {type: "lizard", paws: {count: 0}, tail: {color: "gray"}}
                ]); 
            done();
          }
      );
  });
  it('it should filter the target objects with regular expressions', 
    function(done) {
      var pObj = {tail: {color: /gr.y/}}; 
      var tObjs = [
          {type: "dog", paws: {count: 4}, tail: {count: 1, color: "black"}},
          {type: "rabbit", paws: {count: 3}, tail: {count: 1, color: "white"}},
          {type: "cat", paws: {count: 4}, tail: {color: "gray"}},
          {type: "lizard", paws: {count: 0}, tail: {color: "grey"}},
      ]; 
      apom.filterTargetObjects(
          pObj, 
          tObjs,
          function(result) {
            result.should.match(
                [{type: "cat", paws: {count: 4}, tail: {color: "gray"}},
                 {type: "lizard", paws: {count: 0}, tail: {color: "grey"}}
                ]); 
            done();
          }
      );
  });
}); 
