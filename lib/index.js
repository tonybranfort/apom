/*jslint node: true */
'use strict'; 
var async = require('async');

var constants = {
  PKG_NAME: "apom",
}; 

// "pObj" => the Pattern object.  The object that will have RegExp, if any
//           Usually the left object (1st parameter) in function calls
// "tObj" => the Target object. The object that will be tested against. 
//           Usually the right object (2nd parameter) in function calls
// eg itMatches({cat: /gr.y/}, {cat: "gray"}) => true
//                 pObj            tObj

var _ = {
  isObjClass : function(obj, clas) {
    return Object.prototype.toString.call(obj) === clas;
  },
  isObject: function(obj) {
    // returns true for anything except javascript primitive
    return obj instanceof Object; 
  },
  isObjectLiteral: function(obj) {
    return this.isObjClass(obj, "[object Object]"); 
  },
  isString: function(obj) {
    return this.isObjClass(obj, "[object String]"); 
  },
  isUndefined: function(obj) {
    return this.isObjClass(obj, "[object Undefined]"); 
  },
  isArray: function(obj) {
    return this.isObjClass(obj, "[object Array]"); 
  },
  isRegExp: function(obj) {
    return this.isObjClass(obj, "[object RegExp]"); 
  },
  isNull: function(obj) {
    return this.isObjClass(obj, "[object Null]");
  },
  isFunction: function(obj) {
    return this.isObjClass(obj, "[object Function]");
  }
}; 

var optionsDefault = {
  regExpMatch: false,             // match on regular expression, pObj converted to Reg Exp object
  regExpIgnoreCase: false,        // ignore case upper/lower on reg exp match 
  regExpAnchorStart: false,       // append "^" to beginning of prop value string
  regExpAnchorEnd: false,         // append "$" to end of prop value string

  matchIfPObjPropMissing: false,  // match on this property if doesn't exist
  matchIfTObjPropMissing: false,  // match on this property if doesn't exist

  variablesAllowed: false,         // substitute variables in prop value
  getVariables: undefined,         // function to call to get variables 
                                     // eg; function(cb) {return cb(null, {youngDog: "puppy"}); }
  variablesStartStr: '~',          // string in prop value to find the variable name  
  variablesEndStr: null,           // string in prop value to find the variable name

  propMatchFn: null                // function to call instead of standard propMatch function
}; 

function getObjectProperties(obj) {
  // returns a list of all properties, all levels, of the object as an 
  // array in dot notation; eg; ["prop1"."cat", "prop1"."dog"]
  var props = []; 
  objectPropertyMap(
      obj, 
      function(err, propName, propValue, propFullPath) {
        props.push(propFullPath); 
      }
  );

  return props; 
}

function makeMatchFn(props, options) {

  var propMatchFunctions = getPropMatchFns(props, options); 

  return function(pObj, tObj, cb) {
    return matches(pObj, tObj, propMatchFunctions, cb); 
  };
}

function getPropMatchFns(props, options) {
  // returns an array of property match functions using
  //   props array (see getPropDefns) and default property definition
  var propMatchFunctions = []; 

  getPropDefns(props, options)
  .forEach(function(propDefn) {
    makePropMatchFn(propDefn, options, function(err, fn){
      propMatchFunctions.push(fn); 
    });
  });   
  return propMatchFunctions; 
}

function matches(pObj, tObj, propMatchFunctions, cb) {
  // propMatchFunctions is an array of functions, typically one for each 
  //    property to be tested for a match. See makeMatchFn and makePropMatchFn.  
  // If all return true it's a match

  if (_.isFunction(propMatchFunctions)) {
    cb = propMatchFunctions; 
    propMatchFunctions = 
      getPropMatchFns(getObjectProperties(pObj), {}); 
  }

  return async.every(
    propMatchFunctions,
    function(propMatchFunction, cb) {
      propMatchFunction(pObj, tObj, cb); 
    },
    function(result) {
      // propMatchFunctions = null; 
      return cb(result); 
    }
  ); 
}

function setOptionsDefault(options, optionsDefault) {
  //if a property doesn't exist on options object, that property is set to 
  //  the value of that property on optionsDefault  
  //Allows an options object to be passed in with only those properties that
  //  are wanted to over-ride the default option properties
  if (options) {
    var optionsDefaultKeys = Object.keys(optionsDefault); 
    // set each property on options to default for those that aren't set; eg, 
    //  options.checkMethod = options.checkMethod || optionsDefault.checkMethod
    for (var i = optionsDefaultKeys.length - 1; i >= 0; i--) {
      options[optionsDefaultKeys[i]] = 
        options.hasOwnProperty(optionsDefaultKeys[i]) ? 
          options[optionsDefaultKeys[i]] :  
          optionsDefault[optionsDefaultKeys[i]]; 
    }
  } else {
    options = optionsDefault; 
  }

  return options; 
}

function getPropDefns(props, options) {
  // propDefns is an array of the properties and their options to be tested 
  //   converting props parameter to a consistent form 
  //   that can be passed to makePropMatchFn: 
  //   [{name: 'propName', optionKey1: optionValue1,...},...]
  //   setting an options object on each property, using the options values 
  //   set on each property, if any, first and then any options values
  //   that are passed in here for the overall options object and finally
  //   resolving to options default if neither are set 
  //    
  // "props" are the object properties to be compared.
  // The "props" parameter can be 
  //      1.  an array of strings which are the property names
  //      2.  an array of propDefn objects; name is required
  //      3.  an array of combination of string prop names and propDefn objects
  //      4.  an object-literal of property names as the key 
  //             with propDefn objects 
  //    eg: ["myProperty"] 
  //        [{name: "myProperty", regExpMatch: false}]
  //        [{name: "myProperty", regExpMatch: false}, "myOtherProperty"]
  //        {myProperty: {regExpMatch: false}}

  var propDefns; 

  // set each option property to default value if not set in options paramater
  options = setOptionsDefault(options, optionsDefault); 

  // if props is an object-literal, convert to an array of objects
  if(_.isObjectLiteral(props)) {
    var propNames = Object.keys(props); 
    propDefns = []; 
    for (var i = propNames.length - 1; i >= 0; i--) {
      // add name to object if doesn't exist
      props[propNames[i]].name = props[propNames[i]].name || propNames[i]; 
      propDefns.push(props[propNames[i]]); 
    }
  } else {
    propDefns = props; 
  }

  // assign default values to each prop defn where it isn't already assigned
  for (var j = propDefns.length - 1; j >= 0; j--) {
    if(_.isString(propDefns[j])) {
      var propDefn = {}; 
      propDefn.name = propDefns[j];
      propDefn = setOptionsDefault(propDefn, options); 
      propDefns[j] = propDefn; 
    } else if(_.isObjectLiteral(propDefns[j]) && 
      _.isString(propDefns[j].name)) {
        propDefns[j] = setOptionsDefault(propDefns[j], options); 
    } else {
      throw new Error("Invalid parameter of properties; must be either an array" + 
        " of poperty names or an object-literal with property names as keys");
    }
  }

  return propDefns;   
}

function makePropMatchFn(propDefn, options, callback) {
  // this creates and returns the match function for one property; 
  //    that is the match function that is called for this one property 
  //    to determine if it is a match (true) or not (false)

  //  use propDefn.propMatchFn if it is defined in options by user, 
  //    otherwise use the standard match function
  var matchFn = _.isNull(propDefn.propMatchFn) ? 
      makeStandardPropMatchFn(propDefn, options) : 
      propDefn.propMatchFn;  

  function returnFn(pObj, tObj, cb) {

    getPropRefs(
      pObj, 
      tObj, 
      propDefn.name, 
      function(err, propRefsObj){
        matchFn(
          propRefsObj.pObjProp, 
          propRefsObj.tObjProp, 
          cb); 
      });

  }

  return callback(null, returnFn); 
}

function makeStandardPropMatchFn(propDefn, options) {
  // makes the match function that will be performed for one property
  //   using propDefn to determine what the match function is.
  //   Function created will return true or false when called.

  // preMatchFns are functions, if any, that are to be performed serially
  // before the actual match test is performed; eg, replace variables
  var preMatchFns = [];

  // matchTests is an array of functions; 
  // one for each match test for this property
  // if any of the matchTests is true, the match test is true (ie; or)
  //    - eg; !prop exists || (doesn't matter)
  var matchTests = [];   

  if(propDefn.variablesAllowed) {
    preMatchFns.push(makeReplaceVariableFn()); 
  }

  if(propDefn.regExpMatch) {
    matchTests.push(makeRegExpMatchTestFn()); 
  } else {
    matchTests.push(equalTest); 
  }

  if(propDefn.matchIfPObjPropMissing) {
    matchTests.push(pObjPropMissingTest); 
  }

  if(propDefn.matchIfTObjPropMissing) {
    matchTests.push(tObjPropMissingTest); 
  }

  var returnFn = preMatchFns.length === 0 ? 
      standardMatchFn : standardMatchWithPreMatchFn; 
  
  return returnFn; 

  function standardMatchFn(pObjProp, tObjProp, cb) {
    async.some(
        matchTests, 
        function(matchTest, cb) {
          return matchTest(pObjProp, tObjProp, cb); 
        },
        function(matches) {
          return cb(matches); 
        }
      );
  }

  function standardMatchWithPreMatchFn(pObjProp, tObjProp, cb) {
    //create a new array with the iniating function at 0 followed
    //  by the preMatchFns 
    var preMatchExecFns = [
      function(cb) {
        return cb(null, pObjProp, tObjProp); 
      }].concat(preMatchFns);
    
    async.waterfall(
        preMatchExecFns, 
        function(err, pObjProp, tObjProp) {
          async.some(
              matchTests, 
              function(matchTest, cb) {
                return matchTest(pObjProp, tObjProp, cb); 
              },
              function(matches) {
                return cb(matches); 
              }
          );
        }   
    );
  }


  function makeRegExpMatchTestFn() {
    var flags = ""; 
    var anchorStart = propDefn.regExpAnchorStart === true ? "^" : ""; 
    var anchorEnd   = propDefn.regExpAnchorEnd === true ? "$" : "";

    flags = propDefn.regExpIgnoreCase === true ? flags.concat("i") : flags; 

    function regExpMatchTestFn(pObjProp, tObjProp, cb) {
      // turn into RegExp object if it isn't already
      // NOTE: if RegExp object is passed in, the RegExp is taken as-is 
      //   and these options are IGNORED
      //        regExpIgnoreCase
      //        regExpAnchorStart
      //        regExpAnchorEnd
      var re = _.isRegExp(pObjProp.value) ? 
                pObjProp.value : 
                new RegExp
                  (anchorStart + pObjProp.value + anchorEnd, flags);
      return cb(pObjProp.exists && 
        re.test(tObjProp.value)); 
    }  // end of regExpMatchTestFn

    return regExpMatchTestFn; 
  }  // end of makeRegExpMatchTestFn


  function equalTest(pObjProp, tObjProp, cb) {
    return cb(pObjProp.exists && 
              pObjProp.value === tObjProp.value);
  }

  function pObjPropMissingTest(pObjProp, tObjProp, cb) {
    return cb(!pObjProp.exists); 
  }

  function tObjPropMissingTest(pObjProp, tObjProp, cb) {
    return cb(!tObjProp.exists); 
  }


  function makeReplaceVariableFn() {
    var variablesStartStr = escapeStr(propDefn.variablesStartStr); 
    var variablesEndStr; 
    var variableNameMatchRegExp; 

    if(_.isNull(propDefn.variablesEndStr) ) {
      variableNameMatchRegExp = new RegExp(variablesStartStr + '(\\w*)',"g");   
    } else {
      variablesEndStr = escapeStr(propDefn.variablesEndStr); 
      variableNameMatchRegExp = 
        new RegExp(
          variablesStartStr + 
          '(.*)' +      // parantheses indicate the variable name being extracted
          variablesEndStr,"g");   
    }

    return function(pObjProp, tObjProp,cb) {
      propDefn.getVariables(function(err, variables) {
        replaceVariable(
          pObjProp, 
          tObjProp, 
          variables, 
          function(err, pObjProp, tObjProp) {
            return cb(err, pObjProp, tObjProp);
        }); 
      });
    };

    function escapeStr(str) {
      // http://stackoverflow.com/questions/3115150/how-to-escape-regular-expression-special-characters-using-javascript
      return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    }

    function replaceVariable(pObjProp, tObjProp, variables, cb) {

      if(pObjProp.exists && _.isString(pObjProp.value)) {
        // if the pObj property value contains one variable name only, 
        //   without any other characters before or after 
        //   (except the variablesStartStr & variablesEndStr)
        //   then simply replace the variable name with the variable value
        //   rather than doing a string replace.   
        // This retains the a variable value that is an object (eg Reg Exp) 
        //  rather than converting it to a string.  
        var varName = 
            pObjProp.value.replace(new RegExp("^" + variablesStartStr), ""); 
        varName = varName.replace(new RegExp(variablesEndStr + "$"), ""); 
        if (variables.hasOwnProperty(varName)) {
          pObjProp.value = variables[varName]; 
        } else if (_.isString(pObjProp.value)) {
          pObjProp.value = pObjProp.value
            .replace(variableNameMatchRegExp,getVariableValue);
        }
      }
      return cb(null, pObjProp, tObjProp); 

      function getVariableValue(match, variableName) { 
        return variables[variableName]; 
      }

    }  // end of replaceVariable fn
  }  // end of makeReplaceVariableFn

}

function getPropRefs (pObj, tObj, propName, callback) {
  // returns reference to obj property where propName is in 
  //   dot notation as a string
  // for example obj = {cat: {dog: 1}}
  //             propName = "cat.dog"
  //      returns reference to obj.cat.dog => 1
  // returns object as 
  //    {pObjProp: 
  //      {value: (reference to property value), 
  //       exists: (true|false if the property exists)}, 
  //    {tObjProp: 
  //      {value: (reference to property value), 
  //       exists: (true|false if the property exists)}, 
  //    
  var propNameKeys = propName.split("."); 

  var propRefsObj = {pObjProp: {}, tObjProp: {}}; 

  getPropRef(pObj, propNameKeys, function(err, pObjPropRef) {
    getPropRef(tObj, propNameKeys, function(err, tObjPropRef) {
      propRefsObj.pObjProp = pObjPropRef; 
      propRefsObj.tObjProp = tObjPropRef;
      return callback(err, propRefsObj);   
    });
  });

}  //end of getPropRefs


function getPropRef (obj, propNameKeys, callback) {
  // propNameKeys would have already been determined to be a valid
  //   string (converted to Array here) during function creation
  var propRef = obj; 
  var propExists; 
  var i = 0; 
  var len = propNameKeys.length; 
  var propRefObj = {value: null, exists: null};

  async.whilst(
    function() {   //test performed before fn 
      return _.isObject(propRef) && 
        propRef.hasOwnProperty(propNameKeys[i]) && 
        i < len;
    }, 
    function(cb) {  //fn performed when test is true
      propRef = propRef[propNameKeys[i]]; 
      i++; 
      return cb(null); 
    },
    function(err) {  //called when test finally fails
      // property exists if made it through all the prop names
      propExists = i === len ? true : false; 
      propRefObj.value = propRef;
      propRefObj.exists = propExists; 
      return callback(null, propRefObj); 
    }
    );

}   // end of getPropRef

function objectPropertyMap(obj, fullPropPath, cb) {
  //executes cb on each obj property regardless of depth
  //fullPropPath is optional 
  //cb is called with 4 parameters
  //  1. error - null if none
  //  2. Property name as a string (lowest level only) (eg; "city")
  //  3. Property value (reference to the property value) 
  //  2. Full property path as a string in dot notation (eg; "client.address.city")
  if(_.isFunction(fullPropPath)) {
    cb = fullPropPath; 
    fullPropPath = ""; 
  }  

  var props = Object.keys(obj); 

  for (var i = 0; i <= props.length -1; i++) {
    var newFullPropPath = 
        fullPropPath === "" ? 
        props[i] : 
        fullPropPath + "." + props[i];
    if(_.isObjectLiteral(obj[props[i]])) {
      objectPropertyMap(obj[props[i]], newFullPropPath,  cb); 
    } else {
      cb(null, props[i], obj[props[i]], newFullPropPath); 
    }
  }
}

function makeFilterPatternObjectsFn(props, options) {

  var propMatchFns = getPropMatchFns(props, options); 

  return function(pObjs, tObj,cb) {
    return filterPatternObjects(pObjs, tObj, propMatchFns, cb); 
  };
}

function filterPatternObjects(pObjs, tObj, propMatchFns, cb) {
  if (_.isFunction(propMatchFns)) {
    cb = propMatchFns; 
    propMatchFns = 
      getPropMatchFns(getObjectProperties(pObjs[0]), {regExpMatch: true}); 
  }

  return async.filter(
      pObjs,
      function(pObj, cb) {
          matches(
            pObj, 
            tObj, 
            propMatchFns, 
            function(doesMatch){
              return cb(doesMatch); 
            });
      }, 
      function(result) {
        return cb(result); 
      }
  );
}

function makeFilterTargetObjectsFn(props, options) {

  var propMatchFns = getPropMatchFns(props, options); 

  return function(pObj, tObjs,cb) {
    return filterTargetObjects(pObj, tObjs, propMatchFns, cb); 
  };
}

function filterTargetObjects(pObj, tObjs, propMatchFns, cb) {
  if (_.isFunction(propMatchFns)) {
    cb = propMatchFns; 
    propMatchFns = 
      getPropMatchFns(getObjectProperties(pObj), {regExpMatch: true}); 
  }


  return async.filter(
      tObjs,
      function(tObj, cb) {
          matches(
            pObj, 
            tObj, 
            propMatchFns, 
            function(doesMatch){
              return cb(doesMatch); 
            });
      }, 
      function(result) {
        return cb(result); 
      }
  );
}


module.exports = {
  makeMatchFn: makeMatchFn, 
  getPropDefns: getPropDefns,
  getPropMatchFns: getPropMatchFns, 
  objectPropertyMap: objectPropertyMap,
  matches: matches, 
  makeFilterTargetObjectsFn: makeFilterTargetObjectsFn,
  makeFilterPatternObjectsFn: makeFilterPatternObjectsFn,
  filterPatternObjects: filterPatternObjects, 
  filterTargetObjects: filterTargetObjects,
  getObjectProperties: getObjectProperties,
  _: _
};
