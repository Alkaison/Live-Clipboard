define('test/commonjs/client', [
	'require', 'exports', 'module',
	'test/commonjs/absolute/a',
	'test/commonjs/cyclic/a',
	'test/commonjs/cyclic/b',
	'client',
	'test/commonjs/method/a',
	'test/commonjs/bogus',
	'test/commonjs/nested/a/b/c/d',
	'test/commonjs/relative/a',
	'test/commonjs/relative/b',
	'test/commonjs/transitive/a'
], function(require, exports, module) {

var savedThis = this;

exports.run = function(test) {
	test.expect(19);

	var a, b, foo;

	test.equal(global, savedThis, 'global aliases this');
	test.ok('object' === typeof exports && exports === module.exports, 'exports aliases module.exports');
	test.strictEqual(require(module.id), exports, 'require(module.id) returns exports');

	exports = module.exports = { bar:'baz' };
	test.strictEqual(require(module.id).bar, 'baz', 'assign to module.exports');

	a = require('test/commonjs/absolute/a'), b = require('test/commonjs/absolute/b');
	test.strictEqual(a.foo().foo, b.foo, 'require works with absolute identifiers');

	a = require('./cyclic/a'), b = require('./cyclic/b');
	test.ok(a.a, 'a exists');
	test.ok(b.b, 'b exists')
	test.strictEqual(a.a().b, b.b, 'a gets b');
	test.strictEqual(b.b().a, a.a, 'b gets a');
	exports.a = a;
	test.ok(require(module.id).a && !require(module.id).b, 'partial export available');
	exports.b = b;
	test.ok(require(module.id).a && require(module.id).b, 'export is updated properly');


	test.throws(function() { require('client'); }, 'require does not fall back to relative modules when absolutes are not available.');

	a = require('./method/a'), foo = a.foo;
	test.equal(a.foo(), a, 'calling a module member');
	test.equal(foo(), global, 'members not implicitly bound');
	a.set(10);
	test.equal(a.get(), 10, 'get and set');

	test.throws(function() { require('./bogus'); }, 'require throws error when module missing.');

	test.strictEqual(require('./nested/a/b/c/d').foo(), 1, 'nested module identifier');

	a = require('./relative/a'), b = require('./relative/b');
	test.strictEqual(a.foo, b.foo, 'a and b share foo through a relative require.');

	test.strictEqual(require('./transitive/a').foo(), 1, 'transitive requires works.');

	test.done();
};
});
