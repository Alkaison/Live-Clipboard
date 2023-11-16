define('test/commonjs/relative/a', [
	'require', 'exports', 'module',
	'test/commonjs/relative/b'
], function(require, exports, module) {
exports.foo = require('./b').foo;
});
