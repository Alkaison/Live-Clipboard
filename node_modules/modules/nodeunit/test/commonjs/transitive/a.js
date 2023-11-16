define('test/commonjs/transitive/a', [
	'require', 'exports', 'module',
	'test/commonjs/transitive/b'
], function(require, exports, module) {
exports.foo = require('./b').foo;
});
