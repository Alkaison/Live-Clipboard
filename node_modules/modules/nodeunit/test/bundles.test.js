/**
 * Test the server-side modules package
 **/
'use strict';

var bundles = require('../../lib/bundles'),
	path = require('path'), fs = require('fs'),
	async = require('async');

module.exports = {
	setUp: function(next) {
		next();
	},

	tearDown: function(next) {
		next();
	},


	// tests finding all of the literal requires
	dependencies: {
		testDependencies: function(test) {
			test.expect(3);
			var options = {
				root: path.resolve(__dirname, 'bundles')
			};
			async.parallel([
				function(next) {
					bundles.dependencies([ 'a' ], options, function(err, list) {
						test.deepEqual(list.sort(), [ 'a', 'b', 'c' ], 'Finds the recursive dependencies of a.');
						next();
					});
				},
				function(next) {
					bundles.dependencies([ 'a', 'b' ], options, function(err, list) {
						test.deepEqual(list.sort(), [ 'a', 'b', 'c' ], 'Finds the recursive dependencies of a and b.');
						next();
					});
				},
				function(next) {
					bundles.dependencies([ 'c' ], options, function(err, list) {
						test.deepEqual(list.sort(), [ 'c' ], 'Finds the recursive dependencies of c.');
						next();
					});
				}
			], test.done);
		}
	},


	expand: {
		testExpand: function(test) {
			test.expect(3);
			var options = {
				root: path.resolve(__dirname, 'bundles')
			};
			async.parallel([
				function(next) {
					bundles.expand([ 'a' ], [ 'c' ], options, function(err, list) {
						test.deepEqual(list.sort(), [ 'a', 'b' ], 'Finds the recursive dependencies of a - c.');
						next();
					});
				},
				function(next) {
					bundles.expand([ 'a' ], [ 'b' ], options, function(err, list) {
						test.deepEqual(list.sort(), [ 'a' ], 'Finds the recursive dependencies of a - b.');
						next();
					});
				},
				function(next) {
					bundles.expand([ 'b' ], [ 'a' ], options, function(err, list) {
						test.deepEqual(list.sort(), [], 'Finds the recursive dependencies of b - a (Nothing).');
						next();
					});
				}
			], test.done);
		}
	},


	bundle: {
		testBundle: function(test) {
			test.expect(3);
			var options = {
				root: path.resolve(__dirname, 'bundles')
			};
			async.parallel([
				function(next) {
					bundles.bundle([ 'a' ], [ 'c' ], options, function(err, js) {
						var expect =
							'define("a",["require","exports","b"],function(require,exports){exports.b = require(\'b\');\n\n});\n' +
							'define("b",["require","exports","c"],function(require,exports){exports.c = require(\'c\');\n\n});\n';
						test.strictEqual(js.code, expect, 'Bundle the recursive dependencies of a - c.');
						next();
					});
				},
				function(next) {
					bundles.bundle([ 'a' ], [ 'b' ], options, function(err, js) {
						var expect =
							'define("a",["require","exports","b"],function(require,exports){exports.b = require(\'b\');\n\n});\n';
						test.strictEqual(js.code, expect, 'Bundle the recursive dependencies of a - b.');
						next();
					});
				},
				function(next) {
					bundles.bundle([ 'b' ], [ 'a' ], options, function(err, js) {
						test.strictEqual(js.code, '', 'Bundle the recursive dependencies of b - a (Nothing).');
						next();
					});
				}
			], test.done);
		}
	}
};

