/**
 * Test the server-side modules package
 **/
'use strict';

var modules = require('../../lib/modules'),
	path = require('path'), fs = require('fs'),
	async = require('async');
function parseDefine(js) {
	/*jshint evil:true */
	var args, define = function() { args = arguments; };
	eval(js);
	args.id = args[0];
	args.factory = args[1];
	if (args[2]) {
		args.dependencies = args[1];
		args.factory = args[2];
	}
	return args;
}

module.exports = {
	setUp: function(next) {
		next();
	},

	tearDown: function(next) {
		next();
	},


	// tests finding all of the literal requires
	dependencies: {
		testRelative: function(test) {
			test.expect(1);
			var id = 'path1/path2/module', req = 'require',
				js = 'var a = [ '+req+'("./dupe"), '+req+'("../path2/dupe"), '+req+'(\'../sibling\'), '+req+'(\'abs/one\') ]; // '+req+'("in/comment")\n/*\r\n'+req+'("in/comment")*/',
				expect = [ './dupe', '../sibling', 'abs/one' ];
			test.deepEqual(modules.dependencies(id, js), expect, 'Only first of duplicates after resolving is kept.');
			test.done();
		},
		testAbsolute: function(test) {
			test.expect(1);
			var id = 'path1/path2/module', req = 'require',
				js = 'var a = [ '+req+'("./dupe"), '+req+'("../path2/dupe"), '+req+'(\'../sibling\'), '+req+'(\'abs/one\') ]; // '+req+'("in/comment")\n/*\r\n'+req+'("in/comment")*/',
				expect = [ 'path1/path2/dupe', 'path1/sibling', 'abs/one' ];
			test.deepEqual(modules.dependencies(id, js, { absolute:true }), expect, 'Absolute ids can be returned.');
			test.done();
		}
	},


	// tests for the module function
	module: {
		testNoOptions: function(test) {
			test.expect(5);

			var id = module.id.replace(/\.js$/i, '');
			modules.module(id, function(err, js) {
				var args = parseDefine(js.code);

				test.strictEqual(args.id, id, 'The define function should be passed the module\'s id.');
				test.deepEqual(args.dependencies, [
					'require', 'exports', 'module',
					'../../lib/modules',
					'path', 'fs', 'async'
				], 'The define function should be passed the dependencies.');
				test.strictEqual(
					(''+args.factory).replace(/^\s*function\s\([^\)]*?\)\s*\{(var define;)?\s*|\s*}\s*$/g, ''),
					fs.readFileSync(module.filename, 'utf8').trim(),
					'The define factory content should match the file content.');
				test.ok(
					/function\s*\(\s*require\s*,\s*exports\s*,\s*module\s*\)\s*{/.test(''+args.factory),
					'The factory should be expecting require, exports, and module parameters.');
				test.strictEqual(+js.modified, +fs.statSync(module.filename).mtime, '`modified` should match the file\'s modified time.');

				test.done();
			});
		},

		testForbid: function(test) {
			test.expect(5);

			var id = module.id.replace(/\.js$/i, '');
			async.parallel([
				function(next) {
					modules.module(id, { forbid:[ __dirname ] }, function(err, js) {
						test.strictEqual(err && err.message, 'Forbidden', 'Forbidden module gives error.');
						test.ok(!js, 'Forbidden module not loaded.');
						next();
					});
				},
				function(next) {
					modules.module(id, { forbid:[ /\.test$/i ] }, function(err, js) {
						test.ok(err && !js, 'Forbid can be a regular expression.');
						next();
					});
				},
				function(next) {
					modules.module(id, { forbid:[ { test:function(tid) {
							test.strictEqual(tid, id, 'Module id should be passed to test function.');
							return true; // true means this is forbidden'
						} } ] }, function(err, js) {
						test.ok(err && !js, 'Forbid can be an object with a test function.');
						next();
					});
				}
			], test.done);
		},

		testCompress: function(test) {
			test.expect(2);

			var id = module.id.replace(/\.js$/i, '');
			modules.module(id, { compress:function(js, next) {
				test.ok(/^define\(/.test(js.code), 'Wrapped code is passed to compress.');
				next(null, '"use magic";');
			} }, function(err, js) {
				test.strictEqual(js.code, '"use magic";', 'Compressed string is final js.');

				test.done();
			});
		},

		testMap: function(test) {
			test.expect(2);

			var id = 'themodul';
			async.parallel([
				function(next) {
					modules.module(id, { map:{ 'themodul':module.filename } }, function(err, js) {
						modules.module(module.id, function(err, js2) {
							test.strictEqual(''+parseDefine(js.code).factory, ''+parseDefine(js2.code).factory, 'Map ids to filename strings.');
							next();
						});
					});
				},
				function(next) {
					modules.module(id, { map:{ 'themodul':function(id) { return module.filename; } } }, function(err, js) {
						modules.module(module.id, function(err, js2) {
							test.strictEqual(''+parseDefine(js.code).factory, ''+parseDefine(js2.code).factory, 'Map ids to filename with a function.');
							next();
						});
					});
				}
			], test.done);
		},

		testTranslate: function(test) {
			test.expect(17);

			var id = module.id.replace(/\.js$/i, '');
			function trans(mod, opts, next) {
				test.strictEqual(mod.id, id, 'id should be available.');
				test.strictEqual(mod.filename, module.filename, 'filename should be available.');
				test.strictEqual(mod.buffer.toString('utf8'), fs.readFileSync(module.filename, 'utf8'), 'The file contents should be available.');
				test.ok(opts.translate, 'options should be available.');
				next(null, 'return "success";');
			}
			async.parallel([
				function(next) {
					var argopts = { translate:{} };
					argopts.translate[module.filename] = trans;
					modules.module(id, argopts, function(err, js) {
						test.strictEqual(parseDefine(js.code).factory(), 'success', 'translate by filename.');
						next();
					});
				},
				function(next) {
					var argopts = { translate:{} };
					argopts.translate[id] = trans;
					modules.module(id, argopts, function(err, js) {
						test.strictEqual(parseDefine(js.code).factory(), 'success', 'translate by module id.');
						next();
					});
				},
				function(next) {
					var argopts = { translate:{} };
					argopts.translate.js = trans;
					modules.module(id, argopts, function(err, js) {
						test.strictEqual(parseDefine(js.code).factory(), 'success', 'translate by file extension.');
						next();
					});
				},
				function(next) {
					var id = path.resolve(__dirname, '../../package.json'), opts = { root:'/' };
					modules.module(id, opts, function(err, js) {
						test.deepEqual(parseDefine(js.code).factory, require(id), '.json files are handled properly.');
						next();
					});
				},
				function(next) {
					var id = path.resolve(__dirname, '../../LICENSE-MIT'), opts = { root:'/' };
					modules.module(id, opts, function(err, js) {
						test.deepEqual(parseDefine(js.code).factory, fs.readFileSync(id, 'utf8'), 'Other files are handled properly.');
						next();
					});
				}
			], test.done);
		},

		testNoWrap: function(test) {
			test.expect(5);

			var id = module.id.replace(/\.js$/i, '');
			async.parallel([
				function(next) {
					modules.module(id, { nowrap:[ id ] }, function(err, js) {
						test.ok(!/^define\(/.test(js.code), 'No wrap by id.');
						test.strictEqual(js.code, fs.readFileSync(module.filename, 'utf8'), 'The file should be unaltered.');
						next();
					});
				},
				function(next) {
					modules.module(id, { nowrap:[ /\.test$/i ] }, function(err, js) {
						test.ok(!/^define\(/.test(js.code), 'nowrap can be a regular expression.');
						next();
					});
				},
				function(next) {
					modules.module(id, { nowrap:[ { test:function(tid) {
							test.strictEqual(tid, id, 'Module id should be passed to test function.');
							return true; // true means this is module should not be wrapped
						} } ] }, function(err, js) {
						test.ok(!/^define\(/.test(js.code), 'nowrap can be an object with a test function.');
						next();
					});
				}
			], test.done);
		}
	},


	modules: {
		testModules: function(test) {
			test.expect(4);

			var count = 0,
				expected =
					'define("a",function(require,exports,module){exports.a = \'a\';\n\n});\n' +
					'define("b",function(require,exports,module){exports.b = \'b\';\n\n});\n' +
					'define("c",function(require,exports,module){exports.c = \'c\';\n\n});\n';
			modules.modules([ 'a', 'b', 'c' ], {
				root:path.resolve(__dirname, 'modules'),
				compress:function(js, next) {
					++count;
					test.strictEqual(js.code, expected, 'Compress is called on final js.');
					next(null, js.code);
				}
			}, function(err, js) {
				test.strictEqual(js.code, expected, 'Modules are included in order specified.');
				test.ok((js.modified instanceof Date) && +js.modified, '`.modified` is last modified date.');
				test.strictEqual(count, 1, 'Compress is only called once.');
				test.done();
			});
		}
	},


	middleware: {
		testMiddleware: function(test) {
			test.expect(6);

			var	options = {
					root: path.resolve(__dirname, 'modules'),
					maxAge: 1234
				},
				middleware = modules.middleware(options);
			async.parallel([
				function(next) {
					middleware({
						// mock request
						path:'/a.js'
					}, {
						// mock response
						set: function(header, value) {
							if ('Content-Type' === header) {
								test.strictEqual(value, 'application/javascript', 'Send proper MIME.');
							} else if ('Last-Modified' === header) {
								test.ok(+new Date(value), 'Send last-modified date.');
							} else if ('Cache-Control' === header) {
								test.strictEqual(value, 'public, max-age=1234', 'Send proper Cache header.');
							}
						},
						send: function(content) {
							test.strictEqual(content, 'define("a",function(require,exports,module){exports.a = \'a\';\n\n});\n', 'Send proper content.');
							next();
						}
					}, function(err) {
						test.fail('Dont call next on handled requests.');
						next();
					});
				},
				function(next) {
					middleware({
						// mock request
						path:'/bogus.js'
					}, {
						// mock response
						set: function(header, value) {
							test.fail('Should not set a header.');
						},
						send: function(content) {
							test.fail('Should not send content.');
							next();
						}
					}, function(err) {
						test.ok(!err, 'Pass through 404 requests with no error.');
						next();
					});
				},
				function(next) {
					modules.middleware({
						root: path.resolve(__dirname, 'modules'),
						maxAge: 0
					})({ // mock request
						path:'/a.js'
					}, { // mock response
						set: function(header, value) {
							if ('Cache-Control' === header) {
								test.strictEqual(value, 'public, max-age=0', 'Send proper Cache header.');
							}
						},
						send: function(content) { next(); }
					}, function(err) {
						test.fail('Dont call next on handled requests.');
						next();
					});
				},
				function(next) {
					modules.middleware({
						root: path.resolve(__dirname, 'modules'),
					})({ // mock request
						path:'/a.js'
					}, { // mock response
						set: function(header, value) {
							if ('Cache-Control' === header) {
								test.fail('Don\'t send Cache-Control header.');
							}
						},
						send: function(content) { next(); }
					}, function(err) {
						test.fail('Dont call next on handled requests.');
						next();
					});
				}
			], test.done);
		}
	}
};

