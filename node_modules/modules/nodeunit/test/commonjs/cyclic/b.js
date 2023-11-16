define('test/commonjs/cyclic/b', [
	'require', 'exports', 'module',
	'test/commonjs/cyclic/a'
], function(require, exports, module) {
var a = require('./a');
exports.b = function () {
    return a;
};
});
