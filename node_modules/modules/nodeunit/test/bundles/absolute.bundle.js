define('test/commonjs/absolute/a',[
	'require', 'exports', 'module',
	'test/commonjs/absolute/b'
], function(require, exports) {
exports.foo = function () {
    return require('test/commonjs/absolute/b');
};
});

define('test/commonjs/absolute/b', function(require, exports) {
exports.foo = function() {};
});

