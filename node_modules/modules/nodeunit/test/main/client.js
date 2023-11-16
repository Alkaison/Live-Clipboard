define('test/main/client', [
	'test', 'test/done', 'test/main/a'
], function(test, done, a) {
	test.expect(1);
	test.ok('a' === a.a, 'Dependencies were loaded before main was run.');
	done();
});
