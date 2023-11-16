define('test/commonjs/transitive/b', [
	'require', 'exports', 'module',
	'test/commonjs/transitive/c'
], function(require, exports, module) {
exports.foo = require('./c').foo;
});
