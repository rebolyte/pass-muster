(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define([], factory);
	} else if (typeof module === 'object' && module.exports) {
		module.exports = factory();
	}
}(this, function () {

	// http://stackoverflow.com/a/28475765/2486583
	// this is also the basic method that lodash uses for _.isArray, etc.
	function typeOf(obj) {
	  return {}.toString.call(obj).split(' ')[1].slice(0, -1).toLowerCase();
	}
	// typeOf(); //undefined
	// typeOf(null); //null
	// typeOf(NaN); //number
	// typeOf(5); //number
	// typeOf({}); //object
	// typeOf([]); //array
	// typeOf(''); //string
	// typeOf(function () {}); //function
	// typeOf(/a/) //regexp
	// typeOf(new Date()) // date

	// To find out where this was called from, just look at the stack trace on 
	// the error. 

	// object you want to validate, object of types, optional bool flag
	function passMuster(testObj, typeObj, optional) {

		// step through our supplied object of types, since that's our reference
		for (var k in typeObj) {

			var optCheck = optional ? !!testObj[k] : true;

			// if the property we're looking at is the special '_optional' block,
			// immediately recurse over that block with the flag enabled.
			if (k === '_optional') {
				passMuster(testObj, typeObj._optional, true);
			}

			// if there is a nested object, recurse into it and run again
			else if (typeOf(testObj[k]) === 'object') {
				passMuster(testObj[k], typeObj[k]);
			}

			// check if type of property in array of allowed types
			else if (optCheck && typeOf(typeObj[k]) === 'array') {
				if (typeObj[k].indexOf(typeOf(testObj[k])) === -1) {
					throw new Error("property '" + k + "' not one of allowed types");
				}
			}

			// check if property passes supplied predicate function
			else if (optCheck && typeOf(typeObj[k]) === 'function') {
				if (!typeObj[k].apply(typeObj, [testObj[k], testObj])) {
					throw new Error("property '" + k + "' does not pass predicate function");
				}
			}

			// check if property exists
			else if (!optional && typeOf(testObj[k]) === 'undefined') {
				throw new Error("missing property '" + k + "'");
			} 

			// otherwise, check if the property has the right type
			else if (optCheck && typeOf(testObj[k]) !== typeObj[k]) {
				throw new Error("property '" + k + "' has wrong type");
			}
		}
		// If we made it this far, it passes muster
		return true;
	}

    return passMuster;
}));
