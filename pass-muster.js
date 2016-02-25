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
		for (var k in typeObj) {
			if (k === '_optional') {
				passMuster(testObj, typeObj._optional, true);
			}
			else if (optional) {
				if (typeOf(testObj[k]) === 'object') {
					passMuster(testObj[k], typeObj[k], true);
				} 
				else if (testObj[k] && typeOf(testObj[k]) !== typeObj[k]) {
					throw new Error("optional property '" + k + "' has wrong type");
				}
			}
			else if (typeOf(testObj[k]) === 'object') {
				passMuster(testObj[k], typeObj[k]);
			}
			else if (typeOf(testObj[k]) === 'undefined') {
				throw new Error("missing property '" + k + "'");
			} 
			else {
				if (typeOf(testObj[k]) !== typeObj[k]) {
					throw new Error("property '" + k + "' has wrong type");
				}
			}
		}
		// If we made it this far, it passes muster
		return true;
	}

    return passMuster;
}));
