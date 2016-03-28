var test = require('tape');

var passMuster = require('./pass-muster');

test('test the testing', function (t) {

	t.equal(typeof 'test', 'string', 'string has type string');

	t.equal(1, 1, 'two numbers are equal');

	t.equal(typeof passMuster, 'function', 'module returns a function');

	t.end();
});

test('does passMuster pass muster', function (t) {

	var opts1 = {
		val1: 'a string',
		val2: 23,
		val3: [],
		val4: function () {},
		val5: /a/,
		val6: new Date(),
	};
	t.doesNotThrow(function () {
		passMuster(opts1, {
			val1: 'string',
			val2: 'number',
			val3: 'array',
			val4: 'function',
			val5: 'regexp',
			val6: 'date'
		});
	}, true, 'handles basic types');

	var opts2 = {
		val1: null,
		val2: NaN
	};
	t.doesNotThrow(function () {
		passMuster(opts2, {
			val1: 'null',
			val2: 'number'
		});
	}, true, 'handles falsy and weird values');

	var opts3 = {
		val1: 'a string',
		val2: {},
		val3: {
			val3_1: 42
		}
	};
	t.doesNotThrow(function () {
		passMuster(opts3, {
			val1: 'string',
			val2: {},
			val3: {
				val3_1: 'number'
			}
		});
	}, true, 'handles object recursion');

	var opts4 = {
		val1: 'a string'
	};
	t.throws(function () {
		passMuster(opts4, {
			val1: 'string',
			val2: 'number'
		});
	}, /missing property/, 'throws on missing property');

	var opts5 = {
		val1: 'a string',
		val2: 'another string'
	};
	t.throws(function () {
		passMuster(opts5, {
			val1: 'string',
			val2: 'number'
		});
	}, /has wrong type/, 'throws on property of incorrect type');

	var opts6 = {
		val1: 'a string',
		val2: {
			val2_1: 'another string'
		}
	};
	t.throws(function () {
		passMuster(opts6, {
			val1: 'string',
			val2: {
				val2_1: 'string',
				val2_2: 'number'
			}
		});
	}, /missing property/, 'throws on missing property in nested object');

	var opts7 = {
		val1: 'a string',
		val2: {
			val2_1: 'another string',
			val2_2: 'yet another string'
		}
	};
	t.throws(function () {
		passMuster(opts7, {
			val1: 'string',
			val2: {
				val2_1: 'string',
				val2_2: 'number'
			}
		});
	}, /has wrong type/, 'throws on property of incorrect type in nested object');

	var opts8 = {
		val1: 'a string',
		val2: 43
	};
	t.doesNotThrow(function () {
		passMuster(opts8, {
			val1: 'string',
			_optional: {
				val2: 'number'
			}
		});
	}, true, 'handles _optional block with value supplied');

	var opts9 = {
		val1: 'a string',
	};
	t.doesNotThrow(function () {
		passMuster(opts9, {
			val1: 'string',
			_optional: {
				val2: 'number'
			}
		});
	}, true, 'handles _optional block with value not supplied');

	var opts10 = {
		tableName: 'testing',
		hashkey: '12',
		hashval: 14,
		item: {
			id: 542,
			name: '345'
		}
	};
	t.doesNotThrow(function() {
		passMuster(opts10, {
			tableName: 'string',
			hashkey: 'string',
			hashval: 'number',
			_optional: {
				startFrom: 'date',
				item: {
					id: 'number',
					_optional: {
						name: 'string'
					}
				}
			}
		});
	}, true, 'optional block inside object inside optional block');

	var opts11 = {
		tableName: 'testing',
		hashkey: 12
	};
	t.doesNotThrow(function() {
		passMuster(opts11, {
			tableName: 'string',
			hashkey: ['string', 'number']
		});
	}, true, 'takes array of possible types');

	t.throws(function() {
		passMuster(opts11, {
			tableName: 'string',
			hashkey: ['string', 'array']
		});
	}, /not one of allowed/, 'throws on property of type not in array of types');

	var opts12 = {
		test: 'test1',
		nested: {
			subProp: 'testing'
		}
	};
	t.doesNotThrow(function() {
		passMuster(opts12, {
			test: 'string',
			nested: {
				subProp: ['string', 'number']
			}
		});
	}, true, 'takes array of possible types within nested block');

	t.doesNotThrow(function() {
		passMuster(opts11, {
			tableName: 'string',
			_optional: {
				hashkey: ['string', 'number']
			}
		});
	}, true, 'takes array of possible types within optional block');

	t.throws(function() {
		passMuster(opts11, {
			tableName: 'string',
			_optional: {
				hashkey: ['string', 'array']
			}
		});
	}, /not one of allowed/, 'throws on property not in array within optional block');

	var opts13 = {
		tableName: 'testing'
	};
	t.doesNotThrow(function() {
		passMuster(opts13, {
			tableName: 'string',
			_optional: {
				hashkey: ['string', 'number']
			}
		});
	}, true, 'passes with missing prop + array of possible types within optional block');


	t.doesNotThrow(function() {
		passMuster(opts11, {
			tableName: 'string',
			hashkey: function (p) {
				return p % 2 === 0;
			}
		});
	}, true, 'validates type with predicate function');

	t.throws(function() {
		passMuster(opts11, {
			tableName: 'string',
			hashkey: function (p) {
				return p % 5 === 0;
			}
		});
	}, /does not pass predicate/, 'throws on property with failing predicate');

	t.doesNotThrow(function() {
		passMuster(opts11, {
			tableName: 'string',
			hashkey: function (p) {
				return typeof p !== this.tableName;
			}
		});
	}, true, 'predicate function called in correct context');

	t.doesNotThrow(function() {
		passMuster(opts11, {
			tableName: 'string',
			hashkey: function (p, inObj) {
				return p > inObj.tableName.length;
			}
		});
	}, true, 'predicate function can reference object being validated');

	t.doesNotThrow(function() {
		passMuster(opts12, {
			test: 'string',
			nested: {
				subProp: function (p) {
					return p.length < 20;
				}
			}
		});
	}, true, 'predicate function passes in nested object');

	t.throws(function() {
		passMuster(opts12, {
			test: 'string',
			nested: {
				subProp: function (p) {
					return p.length > 20;
				}
			}
		});
	}, /does not pass predicate/, 'predicate function can fail in nested object');

	t.doesNotThrow(function() {
		passMuster(opts11, {
			tableName: 'string',
			_optional: {
				hashkey: function (p) {
					return p < 20;
				}
			}
		});
	}, true, 'predicate function passes in _optional block with value supplied');

	t.doesNotThrow(function() {
		passMuster(opts13, {
			tableName: 'string',
			_optional: {
				hashkey: function (p) {
					return p < 20;
				}
			}
		});
	}, true, 'predicate function passes in _optional block w/o value supplied');

	t.end();
});
