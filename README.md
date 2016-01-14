[![Build Status via Travis CI](https://travis-ci.org/tonybranfort/apom.svg?branch=master)](https://travis-ci.org/tonybranfort/apom)
[![NPM version](http://img.shields.io/npm/v/apom.svg)](https://www.npmjs.org/package/apom)
# apom.js
[![Coverage Status](https://coveralls.io/repos/tonybranfort/apom/badge.svg?branch=travis&service=github)](https://coveralls.io/github/tonybranfort/apom?branch=travis)

Asynchronous Partial Object Match provides asynchronous functions to determine if chosen properties between javascript object literals match.  A match between properties can be equal value and type (default), a regular expression test, a missing property, a custom match function or a combination of those between properties.  

Installable with ```npm install apom```

## Examples

Determine if properties are equal value and type between 2 objects.
```javascript
// test if fido's tail color is gray
var apom = require('apom');

var fido ={ 
    paws: {color: 'grey', count: 3}, 
    tail: {color: 'gray', count: 1},
    body: {color: 'black'},
    housetrained: true};

var pObj = {tail: {color: 'gray'}};

apom.matches(pObj, fido, function(doesMatch){
  console.log(doesMatch);  //true
})
```

Or build the match function first to include match options and for better performance. 

```javascript
// test if fido has a gray tail regardless if grey or gray
var apom = require('apom');

var fido ={ 
    paws: {color: 'grey', count: 3}, 
    tail: {color: 'gray', count: 1},
    body: {color: 'black'},
    housetrained: true};

// select the properties to be tested and the options
var propsToTest = ['tail.color']; 
var options = {regExpMatch:true}; 

// include the regular expression in the 'pattern object'
var pObj = {tail:{color: /gr.y/}};  

// create the match function
var matchFn = apom.makeMatchFn(propsToTest, options);

// test it
matchFn(pObj, fido, function(doesMatch){
  console.log(doesMatch);  // true
})
```

Filter an array of objects:
```javascript
// find which pets have 4 paws

var apom = require('apom');

var pets = [
  { name: 'fido',
    paws: {color: 'gray', count: 3}, 
  },
  { name: 'rover',
    paws: {color: 'white', count: 4}, 
  },
  ];

// create the pattern object
var pObj = {paws:{count: 4}};  

// select properties to test
var propsToTest = ['paws.count'];

// create the filter function
var filter = apom.makeFilterTargetObjectsFn(propsToTest);

// filter
filter(pObj, pets, function(matchedPets){
  console.log(matchedPets);  //matchedPets = {name: 'rover'...}; 
})
```

## Documentation
### Match and Filter Functions
* [`matches`](#matches) 
* [`makeMatchFn`](#makeMatchFn) returns a custom 
[`matches`](#matches) function
* [`makeFilterTargetObjectsFn`](#makeFilterTargetObjectsFn) returns a custom
  [`filterTargetObjects`](#filterTargetObjects) function
* [`makeFilterPatternObjectsFn`](#makeFilterPatternObjectsFn) returns a custom
  [`filterPatternObjects`](filterPatternObjects) function

### [Options](#options)
* [`regExpMatch`](#regExpMatch)
* [`matchIfPObjPropMissing`](#matchIfPObjPropMissing)
* [`matchIfTObjPropMissing`](#matchIfPObjPropMissing)
* [`variablesAllowed`](#variablesAllowed)
* [`propMatchFn`](#propMatchFn)

<a name="matches"></a>
### matches(pObj, tObj, callback)
Returns `true` as result of callback if properties identified to be tested between `pObj` and `tObj` match; otherwise returns `false`.

Which properties are tested and if they match is determined by whether `matches` is called directly or created via the [`makeMatchFn`](#makeMatchFn). 

If `matches` is created via `makeMatchFn` then the [`propsToTest`](#propsToTest) and [`options`](#options) parameters determine which properties are tested for match and how the properties are tested for match.  Calling the resulting `matches` function created via `makeMatchFn` also provides better performance than calling `matches` directly.

If `matches` function is called directly without creating it via `makeMatchFn`, every property in the `pObj` object is tested for a match and all `options` values are default.  `Options` cannot be modified if calling `matches` directly.

__Arguments__
* [`pObj`](#pObj)
* [`tObj`](#tObj)
* `callback(result)` - `result` is boolean. `true` if `pObj` matches `tObj` otherwise is `false`. 

__Examples__
```javascript
// test if fido's tail color is gray
var apom = require('apom');

var fido ={ 
    tail: {color: 'gray', count: 1},
    body: {color: 'black'},
    housetrained: true};

var pObj = {tail: {color: 'gray'}};

apom.matches(pObj, fido, function(doesMatch){
  console.log(doesMatch);  //true
});

// Or, create the matches function to include option 
//      such as regular expression matches. 

// select the properties to be tested and the options
var propsToTest = ['tail.color']; 
var options = {regExpMatch:true}; 

// create the custom match function
var matchFn = apom.makeMatchFn(propsToTest, options);

// include the regular expression in the 'pattern object'
var pObj = {tail:{color: /gr.y/}};  

// test it
matchFn(pObj, fido, function(doesMatch){
  console.log(doesMatch);  // true
})


```

<a name="makeMatchFn"></a>
### makeMatchFn(propsToTest, options)
Creates and returns a [`matches`](#matches) function that is configured to test the properties included in `propsToTest` and `options` to determine how properties are tested for a match.  This created function will run faster than calling the `matches` function directly and allows for greater control, via `propsToTest` and `options`, of which properties are tested and how.  

__Arguments__
* [`propsToTest`](#propsToTest)
* [`options`](#options) - _optional_ Applies to each property in `propsToTest` unless `options` values are included for properties in `propsToTest`.  `options` precedence is (1) `propsToTest` `options` values if set (2) `options` as included here as a parameter, otherwise (3) `options` default values.   

__Examples__
```javascript
// test if fido has a gray tail regardless if grey or gray
var apom = require('apom');

var fido ={ tail: {color: 'gray', count: 1}};

// select the properties to be tested and the options
var propsToTest = ['tail.color']; 
var options = {regExpMatch:true}; 

// create the match function
var matchFn = apom.makeMatchFn(propsToTest, options);

// include the regular expression in the 'pattern object'
var pObj = {tail:{color: /gr.y/}};  

// test it
matchFn(pObj, fido, function(doesMatch){
  console.log(doesMatch);  // true
});
```

It would give the same result to set the `options` in `propsToTest`
```javascript
var propsToTest = {'tail.color':{regExpMatch:true}}; 

var matchFn = apom.makeMatchFn(propsToTest);  // options not included here

matchFn(pObj, fido, function(doesMatch){
  console.log(doesMatch);  // true
});

```

<a name="makeFilterTargetObjectsFn"></a>
### makeFilterTargetObjectsFn(propsToTest, options)
Creates and returns a [`filterTargetObjects`](#filterTargetObjects) function that is configured to test the properties included in `propsToTest` using `options` to determine how properties are tested for a match between `pObj` and `tObjs`.

__Arguments__
* [`propsToTest`](#propsToTest)
* [`options`](#options) _optional_ Applies to each property in `propsToTest` unless `options` values are included for properties in `propsToTest`.  `options` precedence is (1) `propsToTest` `options` values if set (2) `options` as included here as a parameter, otherwise (3) `options` default values. 

__Examples__
See `filterTargetObjects`.

<a name="filterTargetObjects"></a>
### filterTargetObjects(pObj, tObjs, callback)
Returns an array of `tObjs` that match the `pObj`
 based on the `propsToTest` and `options` parameters that were used to create this function with `makeFilterTargetObjectsFn`. 

This function is created by calling [`makeFilterTargetObjectsFn`](#makeFilterTargetObjectsFn). 

__Arguments__
* [`pObj`](#pObj)
* `tObjs` - An array of [`tObj`](#tObj) objects
* `callback(result)` - `result` is an array of `tObj` objects that match `pObj`. 

__Examples__
```javascript
// find which pets have gray paws regardeless if 'gray' or 'grey'

var apom = require('apom');

var pets = [
  { name: 'fido',
    paws: {color: 'gray', count: 3}, 
  },
  { name: 'rover',
    paws: {color: 'white', count: 4}, 
  },
  ];

// create the pattern object
var pObj = {paws:{color: /gr[a,e]y/}};  

// select properties and options to test
var propsToTest = ['paws.color'];
var options = {regExpMatch: true}; 

// create the filter function
var filter = apom.makeFilterTargetObjectsFn(propsToTest, options);

// filter
filter(pObj, pets, function(matchedPets){
  console.log(matchedPets);  
  // [ { name: 'fido', paws: { color: 'gray', count: 3 } } ] 
});
```


<a name="makeFilterPatternObjectsFn"></a>
### makeFilterPatternObjectsFn(propsToTest, options)
Creates and returns a [`filterPatternObjects`](#filterPatternObjects) function that is configured to test the properties included in `propsToTest` using `options` to determine how properties are tested for a match between `pObjs` and `tObj`.

__Arguments__
* [`propsToTest`](#propsToTest)
* [`options`](#options) - _optional_ Applies to each property in `propsToTest` unless `options` values are included for properties in `propsToTest`.  `options` precedence is (1) `propsToTest` `options` values if set (2) `options` as included here as a parameter, otherwise (3) `options` default values. 

__Examples__
See `filterPatternObjects`.

<a name="filterPatternObjects"></a>
### filterPatternObjects(pObjs, tObj, callback)
Returns an array of `pObjs` that match the `tObj`based on the `propsToTest` and `options` parameters that were used to create this function with `makeFilterPatternObjectsFn`. 

This function is created by calling [`makeFilterPatternObjectsFn`](#makeFilterPatternObjectsFn). 

`filterPatternObjects` allows an array of objects with regular expressions to be filtered on those regular expressions unlike `filterTargetObjects`. 

__Arguments__
* `pObjs` - An array of [`pObj`](#pObj) objects
* [`tObj`](#tObj)
* `callback(result)` - `result` is an array of `pObj` objects that match `tObj`. 

__Examples__
```javascript
// find which pets match a request with a role of guarddog

var apom = require('apom');

// pets are the `pObjs` in this case to match on their regular expressions
var pets = [
  {name: 'growler',
   path: /.*role=guarddog.*/},
  {name: 'fido',
   path: /.*role=pet.*/},
]

// request is the tObj 
var request = {path: '/pets?role=guarddog'}

// select properties and options to test
var propsToTest = ['path'];
var options = {regExpMatch: true}; 

// create the filter function
var filter = apom.makeFilterPatternObjectsFn(propsToTest, options);

// filter
filter(pets, request, function(matchedPets){
  console.log(matchedPets);  
  // [ { name: 'growler', path: /.*role=guarddog.*/ } ]
});

```

<a name="pObj" />
### pObj 
__"pattern object"__.  Any object that is passed into a [`matches`](#matches), [`filterPatternObjects`](#filterPatternObjects) or [`filterTargetObjects`](#filterTargetObjects) function as the first parameter.  It is used to test if it matches the [target object](#tObj)(`tObj`). Considered a 'pattern' object because, unlike the `tObj`, it has characteristics such as : 
* If [`regExpMatch`](#regExpMatch) is true, property/ies in pObj are tested as regular expressions against respective `tObj` property/ies.
* If [`variablesAllowed`](#variablesAllowed) is true, strings in the pObj property values can be replaced as variable names with variable values.  


```javascript
var apom = require('apom');

// the target object here is fido
var fido ={ 
    paws: {color: 'grey', count: 3}, 
    tail: {color: 'gray', count: 1},
    body: {color: 'black'},
    housetrained: true};

// the pattern object
var pObj = {tail: {color: 'gray'}};

apom.matches(pObj, fido, function(doesMatch){
  console.log(doesMatch);  //true
})
```

<a name="tObj" />
### tObj 
__"target object"__.  Any object that is passed into a [`matches`](#matches), [`filterPatternObjects`](#filterPatternObjects) or [`filterTargetObjects`](#filterTargetObjects) function as the second parameter.  The target object is the object that is being tested against the pattern object to determine if it matches.  See notes and example  under [`pObj`](#pObj). 

<a name="propsToTest" />
### propsToTest 
An array or object that contains property names and their assigned [`options`](#options) values, if any.  Property names are strings and are in dot notation if nested; eg "tail.color" to identify the property in `{tail: {color: black}}`. 

Can take one of the following forms: 
* an array of strings which are the property names to be tested.  `options` values cannot be specified for individual properties with this form.  Example: 
  ```javascript

  ['name', 'tail.color', 'housetrained']
  ```

* an array of objects, one for each property to be tested, each containing a 'name' property assigned to the property name to be tested, and option property key/values (optional). Example: 
  ```javascript
  // test using default options for housetrained; tail.color using reg exp match
  [{name: 'housetrained'}, {name: 'tail.color', regExpMatch: true}]
  ```

* an array of combination of the above 2 (strings and objects). Example: 
  ```javascript
  ['housetrained', {name: 'tail.color', regExpMatch: true}]
  ```

* an object with property names as keys and `options` objects as the values. Example: 
  ```javascript
  // test using default options for housetrained; tail.color using reg exp match
  {'housetrained':{}, 'tail.color': {regExpMatch: true}}
  ```

<a name="options" />
### options
An object used to set the option values for match and filter functions.  

```javascript
//options properties & their default values
var options = {
  regExpMatch: false,        // match on regular expression in `pObj` 
  regExpIgnoreCase: false,   // ignore case on reg exp match (str only) 
  regExpAnchorStart: false,  // append "^" to beg of str for reg exp (str only)
  regExpAnchorEnd: false,    // append "$" to end of str for reg exp (str only)

  matchIfPObjPropMissing: false,  // matches if `pObj` property doesn't exist
  matchIfTObjPropMissing: false,  // matches if `tObj` property doesn't exist

  variablesAllowed: false,  // replace var names with var values in `pObj` props 
  getVariables: undefined,  // function to call to get object of var names/vals
  variablesStartStr: '~',   // beg str in pObj prop value to find the var name  
  variablesEndStr: null,    // end str in pObj prop value to find the var name

  propMatchFn: null         // function to call instead of std match function
}; 
```

##### <a name="regExpMatch" />regExpMatch
Property on the [`options`](#options) object that if equal to `true`, apom filter and matches functions will use the `pObj` property value as a regular expression to test against the `tObj` property.  If the pattern object property value is a string, the string will be converted to a javascript regular expression.  
  - valid values: `true`,`false`
  - default: `false`

Example: 
```javascript
// test if fido has a gray tail regardless if grey or gray
var apom = require('apom');

var fido ={ 
    paws: {color: 'grey', count: 3}, 
    tail: {color: 'gray', count: 1},
    body: {color: 'black'},
    housetrained: true};

// select the properties to be tested and the options
var propsToTest = ['tail.color']; 
var options = {regExpMatch:true}; 

// include the regular expression in the 'pattern object'
var pObj = {tail:{color: /gr[a,e]y/}};  

// create the match function
var matchFn = apom.makeMatchFn(propsToTest, options);

// test it
matchFn(pObj, fido, function(doesMatch){
  console.log(doesMatch);  // true
});
```

##### <a name="regExpIgnoreCase" />regExpIgnoreCase
Property on the [`options`](#options) object that if equal to `true` __and__ [`regExpMatch`](#regExpMatch)===`true` __and__ the `pObj` property value is a string, then when the `pObj` value is converted from a string to a regular expression object in apom matches and filter functions,  the regular expression is included with the 'i' flag to ignore case on the regular expression match.  This option value is only considered where the `pObj` property value is a string.  If the `pObj` value is a regular expression object, then the ignore case flag can be included on that object; eg "/gray/i".   
  - valid values: `true`,`false`
  - default: `false`

Example: 
```javascript
// test if fido has a gray tail regardless if grey or Gray
var apom = require('apom');

var fido ={ 
    paws: {color: 'grey', count: 3}, 
    tail: {color: 'Gray', count: 1},
    body: {color: 'black'},
    housetrained: true};

// select the properties to be tested and the options
var propsToTest = ['tail.color']; 
var options = {regExpMatch:true, regExpIgnoreCase: true}; 

// include the regular expression as a string in the pattern object
var pObj = {tail:{color: 'gr[a,e]y'}};  

// create the match function
var matchFn = apom.makeMatchFn(propsToTest, options);

// test it
matchFn(pObj, fido, function(doesMatch){
  console.log(doesMatch);  // true
});
```

// regExpIgnoreCase does not apply if pObj property is a regular expression
```javascript
var pObj = {tail:{color: /gr[a,e]y/}};  

matchFn(pObj, fido, function(doesMatch){
  console.log(doesMatch);  // false
});

// use the 'i' flag on the regular expression object instead 
var pObj = {tail:{color: /gr[a,e]y/i}};  

matchFn(pObj, fido, function(doesMatch){
  console.log(doesMatch);  // true
});
```

##### <a name="regExpAnchorStart" />regExpAnchorStart
Property on the [`options`](#options) object that if equal to `true` __and__ [`regExpMatch`](#regExpMatch)===`true` __and__ the `pObj` property value is a string, then when the `pObj` value is converted from a string to a regular expression object in apom matches and filter functions, it includes a '^' prepended to `pObj` string value.  This option value is only considered where the `pObj` is a string.  If the `pObj` property value is a regular expression object, then the ^ can be included in the regular expression; eg, /^gray/.  
  - valid values: `true`,`false`
  - default: `false`

  This option will rarely (ever?) be needed as this can also be achieved with a `pObj` value that is a string by simply including the ^ in the string (without setting `regExpAnchorStart`=true). 

  These 3 would yield the same result: 

  ```javascript 
var pObj = {tail: {color: '^gray'}}
var options = {regExpMatch: true}
```
  ```javascript 
var pObj = {tail: {color: 'gray'}}
var options = {regExpMatch: true, regExpAnchorStart: true}
```
  ```javascript 
var pObj = {tail: {color: /^gray/}}
var options = {regExpMatch: true}
```

##### <a name="regExpAnchorEnd" />regExpAnchorEnd
Property on the [`options`](#options) object that if equal to `true` __and__ [`regExpMatch`](#regExpMatch)===`true` __and__ the `pObj` property value is a string, then when the `pObj` value is converted from a string to a regular expression object in apom matches and filter functions, it includes a '$' appended to the end of the `pObj` string value.  This option value is only considered where the `pObj` is a string.  If the `pObj` property value is a regular expression object, then the $ can be included in the regular expression; eg, /gray$/.  
  - valid values: `true`,`false`
  - default: `false`

  This option will rarely (ever?) be needed as this can also be achieved with a `pObj` value that is a string by simply including the $ in the string (without setting `regExpAnchorEnd`=true).  

  These 3 would yield the same result: 

  ```javascript 
var pObj = {tail: {color: 'gray$'}}
var options = {regExpMatch: true}
```
  ```javascript 
var pObj = {tail: {color: 'gray'}}
var options = {regExpMatch: true, regExpAnchorEnd: true}
```
  ```javascript 
var pObj = {tail: {color: /gray$/}}
var options = {regExpMatch: true}
```


##### <a name="matchIfTObjPropMissing" />matchIfTObjPropMissing
Property on the [`options`](#options) object that if equal to `true`, apom filter and matches functions will return `true` for the given property's match test if the property being tested does not exist on `tObj`. 
  - valid values: `true`,`false`
  - default: `false`

Example: 
```javascript
// find which pets have a role of guarddog and (the breed is chihuahua or 
//     breed is not defined)  

var apom = require('apom');

var pets = [
  {name: 'growler',
   breed: 'chihuahua',
   role: 'guarddog'},
  {name: 'fido',
   breed: 'lab',
   role: 'pet'},
  {name: 'duchy',
   role: 'guarddog'},
  {name: 'bruiser',
   breed: 'chihuahua',
   role: 'cuddler'},
]

// request is the tObj 
var pObj = {role:'guarddog', breed: 'chihuahua'};

// select properties to test; role with default options
var propsToTest = 
    {role: {}, breed: {matchIfTObjPropMissing: true}};

// create the filter function
var filter = apom.makeFilterTargetObjectsFn(propsToTest);

// filter
filter(pObj, pets, function(matchedPets){
  console.log(matchedPets);  
  // [ { name: 'growler'...},{name: 'duchy'...} ]
});

```

##### <a name="matchIfPObjPropMissing" />matchIfPObjPropMissing
Property on the [`options`](#options) object that if equal to `true`, apom filter and matches functions will return `true`for the given property's match test if the property being tested does not exist on `pObj`. 
  - valid values: `true`,`false`
  - default: `false`

Example: 

This option would typically be used in a `makeFilterPatternObjectsFn`, like this example, but like all options can also be used in `makeFilterPatternObjectsFn` and `matches`.  

```javascript
// find which pets match a request with a role of guarddog and 
//     (the breed is chihuahua or breed is not defined)  

var apom = require('apom');

// pets are the `pObjs` in this case to match on their regular expressions
var pets = [
  {name: 'growler',
   breed: 'chihuahua',
   path: /.*role=guarddog.*/},
  {name: 'fido',
   breed: 'lab',
   path: /.*role=pet.*/},
  {name: 'duchy',
   path: /.*role=guarddog.*/},
  {name: 'bruiser',
   breed: 'chihuahua',
   path: /.*role=cuddler.*/},
]

// request is the tObj 
var request = {path: '/pets?role=guarddog', breed: 'chihuahua'}

// select properties and options to test
var propsToTest = 
    {path: {regExpMatch: true}, breed: {matchIfPObjPropMissing: true}};

// create the filter function
var filter = apom.makeFilterPatternObjectsFn(propsToTest);

// filter
filter(pets, request, function(matchedPets){
  console.log(matchedPets);  
  // [ { name: 'growler'...},{name: 'duchy'...} ]
});

```


##### <a name="variablesAllowed" />variablesAllowed
Property on the [`options`](#options) object that if equal to `true`, replaces strings that are recognized as variable names in `pObj` property values with their respective variable values from [`getVariables`](#getVariables).  The varible names on the `pObj` property values is matched based on the [`variablesStartStr`](#variablesStartStr) and [`variablesEndStr`](#variablesStartStr). 
  - valid values: `true`,`false`
  - default: `false`

Example: 
```javascript
// match if fido has a grey tail and paws regardless if grey or gray

var apom = require('apom');

var fido ={ 
    paws: {color: 'grey', count: 3}, 
    tail: {color: 'gray', count: 1},
    body: {color: 'black'},
    housetrained: true};

var options =  
    {regExpMatch: true,
     variablesAllowed:true,
     variablesStartStr:"~",
     variablesEndStr: "#",
     getVariables:  function(cb) {
       return cb(null, {grayColor: /gr[a,e]y/}); 
    }};

// variable name is identified between variablesStartStr(~) and variablesEndStr(#)
//   and replaced with that name from getVariables (grayColor => /gr[a,e]y/)
var pObj = {paws:{color: '~grayColor#'},tail:{color:'~grayColor#'}};  

var propsToTest = ['paws.color', 'tail.color'];

var matchFn = apom.makeMatchFn(propsToTest, options);

matchFn(pObj, fido, function(matches){
  console.log(matches); //true 
  return; 
});
```

##### <a name="getVariables" />getVariables
Property on the [`options`](#options) object that defines a function which, if [`variablesAllowed`](#variablesAllowed) is `true`, takes a callback which is called with an error (null if no error) and an object of the form : 

```javascript
{variable1Name: `variable1Value`,
  variable2Name: `variable2Value`}
```

See [`variablesAllowed`](#variablesAllowed) for an example.

##### <a name="variablesStartStr" />variablesStartStr
Property on the [`options`](#options) object that defines a string which, if [`variablesAllowed`](#variablesAllowed) === `true`, determines the starting position of a variable name string in a `pObj` property value that will be replaced with the variable value string of the respective variable name obtained from [`getVariables`](#getVariables). 

See [`variablesAllowed`](#variablesAllowed) for an example.


##### <a name="variablesEndStr" />variablesEndStr
Property on the [`options`](#options) object that defines a string which, if [`variablesAllowed`](#variablesAllowed) === `true`, determines the ending position of a variable name string in a `pObj` property value that will be replaced with the variable value string of the respective variable name obtained from [`getVariables`](#getVariables). 

See [`variablesAllowed`](#variablesAllowed) for an example.



##### <a name="propMatchFn" />propMatchFn
Property on the [`options`](#options) object that defines a function to replace the match function between `pObj` and `tObj` properties.   
  - default: `null`

Function is called with 3 parameters for each property being tested: 
* `pObjProp` - an object-literal with these 2 properties: 
    - `value`: the value of the [`pObj`](#pObj) property value
    - `exists`: `true` or `false` depending on whether the property exists on `pObj` 
* `tObjProp` - an object-literal with these 2 properties: 
    - `value`: the value of the [`tObj`](#tObj) property value
    - `exists`: `true` or `false` depending on whether the property exists on `tObj` 
* callback(`true`|`false`) - The callback that contains your defined expression to return `true` or `false`.  

Example: 
```javascript
// find pets with 3 or more paws

var apom = require('apom');

var pets = [
  { name: 'fido',
    paws: {color: 'gray', count: 3}},
  { name: 'rover',
    paws: {color: 'white', count: 4}},
  { name: 'slither',
    paws: {count: 0}},
  ];

var pObj = {paws:{count: 3}};  

//   propMatchFn is called for each property with the 
//      pattern object property value and the target object property value 
var matchFn = function(pObjProp, tObjProp, cb) {
  var hasAtLeast3Paws = tObjProp.exists === true && 
      pObjProp.exists === true && 
      tObjProp.value >= pObjProp.value;
  return cb(hasAtLeast3Paws);  
}; 

var propsToTest = {'paws.count': {propMatchFn: matchFn}}; 

var filter = apom.makeFilterTargetObjectsFn(propsToTest);

filter(pObj, pets, function(matchedPets){
  console.log(matchedPets);
  //matchedPets = {name: 'fido'..., name:'rover'...}; 
});

```




