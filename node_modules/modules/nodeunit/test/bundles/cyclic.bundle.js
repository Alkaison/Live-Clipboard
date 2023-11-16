define('test/commonjs/cyclic/a', [
	'require', 'exports', 'module',
	'test/commonjs/cyclic/b'
], function(require, exports, module) {
exports.a = function () {
    return b;
};
var b = require('./b');
});

define('test/commonjs/cyclic/b', [
	'require', 'exports', 'module',
	'test/commonjs/cyclic/a'
], function(require, exports, module) {
var a = require('./a');
exports.b = function () {
    return a;
};
});
