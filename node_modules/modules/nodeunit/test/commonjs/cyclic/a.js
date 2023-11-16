define('test/commonjs/cyclic/a', [
	'require', 'exports', 'module',
	'test/commonjs/cyclic/b'
], function(require, exports, module) {
exports.a = function () {
    return b;
};
var b = require('./b');
});
