define('test/bundles/client', [
	'require', 'exports', 'module', 'test',
	'test/commonjs/absolute/a',
	'test/commonjs/absolute/b',
	'test/commonjs/cyclic/a',
	'test/commonjs/cyclic/b'
], function(require, exports, module, test) {
	test.expect(5);

	var a, b, foo;

	a = require('test/commonjs/absolute/a'), b = require('test/commonjs/absolute/b');
	test.strictEqual(a.foo().foo, b.foo, 'require works with absolute identifiers');

	a = require('../commonjs/cyclic/a'), b = require('../commonjs/cyclic/b');
	test.ok(a.a, 'a exists');
	test.ok(b.b, 'b exists')
	test.strictEqual(a.a().b, b.b, 'a gets b');
	test.strictEqual(b.b().a, a.a, 'b gets a');

	test.done();
});
