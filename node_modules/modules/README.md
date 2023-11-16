# modules [![Build Status](https://secure.travis-ci.org/thetalecrafter/modules.png?branch=master)](http://travis-ci.org/thetalecrafter/modules)

> Use CommonJS modules client-side in web applications

## Getting started

Install via npm

	npm install modules --save-dev

Add the middleware to your express or connect app

	app.get('/module', require('modules').middleware({
		root: './component', // where modules live in the filesystem
		// ... other options
	});

Add the client script to your html


	<script src="/module/define.min.js" data-main="my-main-module"></script>



### Mapping and Bundling

You can create bundles (files containing multiple modules), and/or map modules to
urls outside of the conventional location.

Client-side, this mapping is handled with the `data-urls` attribute on the script
tag, or with a call to `define.url()`. `define.url(url, ids)` maps a single url
to all the modules at that url, and the `data-urls` attribute expects a JSON
object with urls as keys, and arrays of module ids as the values.

	define.url("url/of/bundle.js", [ "moduleid" ])

	<script ... data-urls='{"bundle.js":["moduleid"]}'></script>


Server-side and at build time you can generate bundles with the following snippets:

	// Generate a bundle with a specific set of modules included
	require('modules').modules(
		[ 'module1', 'module2' ],
		{ /* options */ }, // specify optional compression, etc.
		function(err, js, modified) {
			// js is a string containing the AMD-wrapped javascript for the modules
			// modified is the most recent modified date among the included modules
		}
	);

	// Generate a bundle with all of the deep dependencies of the modules, excluding
	//  the deep dependencies of another list of modules
	require('modules/lib/bundles').bundle(
		[ 'module1', 'module2' ], // include these and their deep dependencies
		[ 'module3', 'module4' ], // except any of these or their deep dependencies
		{ /* options */ },
		function(err, js, modified) {
		}
	);




## API

### In Browser

#### define.js or define.min.js

These scripts create the `define` function used to create a module environment
in the browser. You can reference the file how ever you'd like; they are in the
`lib` folder in the source code. However, the preferred way is to include a
script tag pointing to the path the middleware is listening to, or to a bundle
including define:

	<script src="/path/to/define.min.js"></script>

* `define(id, dependencies?, factory)` -- Define module `id`. `id` is required
	in this implementation. If the `dependencies` parameter is omitted, the factory
	will not be scanned for `require()` calls, `[ 'require', 'exports', 'module' ]`
	will be used instead.
	See the [AMD wiki](https://github.com/amdjs/amdjs-api/wiki/AMD) for details.
* `define.amd` -- Object denoting AMD compatibility.


#### define.shim.js

This is only useful to include first in a bundle that may be loaded before the
`define` or `define.min` script has run. Usually the main bundle includes
`define.min` and the shim is not needed.

* `define(id, dependencies?, factory)` -- Saves the arguments for when `define`
	or `define.min` is loaded.
* `define.amd` -- Object denoting AMD compatibility.


#### module scope

(inside the factory function)

See the [CommonJS Module spec](http://wiki.commonjs.org/wiki/Modules/1.1.1),
the [AMD spec](https://github.com/amdjs/amdjs-api/wiki/AMD), and
[Node.js modules](http://nodejs.org/api/modules.html)

* `exports` -- Alias for `module.exports`. An object to assign properties to
	in order to export values.
* `module` -- An object representing this module.
* `module.children` -- An array of `module` objects for the modules this one
	requires synchronously.
* `module.exports` -- This object will be returned from `require()` calls for
	this module. Assign to this to export the value. Note if you assign to this
	property, the `exports` variable is not automatically updated.
* `module.filename` -- Alias of `uri`. The url of the script containing this
	module.
* `module.loaded` -- True if the module has already been defined.
* `module.parent` -- The `module` object for the module that first required
	this module.
* `module.id` -- A string of slash separated terms identifying the module.
* `module.require()` -- A `require()` function that always resolves relative
	ids against this module's id.
* `module.uri` -- Alias of `filename`. The url of the script containing this
	module.
* `require(id)` -- Returns the `exports` for the module identified. Throws an
	error if the module has not been loaded. `id` is a module id string.
* `require(ids, next)` -- Asynchronously load the modules, require them, and
	pass them as arguments to the callback function `next`. `ids` may be a
	single id string, or an array of module id strings.
* `require.cache` -- A store of all modules the system knows about. You may
	undefine a module by `delete require.cache[module.id]`. Assigning to
	this property will have no effect.
* `require.main` -- The `module` object of the module loaded by the `data-main`
	attribute of the define script.
* `require.resolve(id)` -- Resolves a relative module id against this module's
	id, and returns the `uri` for that module.
* `require.toUrl(id)` -- Similar to `require.resolve()`. See the AMD spec.
* `require.map(url, ids)` -- Tell require where to load specific modules.
	`url` is the url to request, and `ids` is an array of module ids that are
	defined by the file at the url.



### In Node.js

#### modules

	modules = require('modules')

Provides middleware and functions to wrap and bundle your modules for use in the
browser.

* `modules.dependencies(id, js, options?)` -- Finds all literal synchronous
	`require()` calls in a module identified by `id`. `js` is the code for the
	module as a string. If `options.absolute` is true, the returned dependency ids
	are made absolute, otherwise they are returned as written in the code. Returns
	an array of module id strings. *Note: this uses regular expressions instead
	of a parser. Comments are excluded. The function will miss any calls with a
	renamed require, or a variable instead of a string literal id.*
* `modules.middleware(options?)` -- Returns an express / connect middleware using
	the `options` passed in.

	* `compress` -- Defaults to `false`. If a function is specified, it will be
		passed a module object with `id`, `filename`, `code`, and `modified`
		properties as the first parameter, and a function as the second. It expects
		the function to be called with either an error or null in the first argument,
		and the compressed code as a string in the second. Example:

			compress:function(js, next) {
				var UglifyJS = require('uglify-js');
				js = UglifyJS.minify(js.code, { fromString:true });
				next(null, js);
			}

	* `forbid` Defaults to `[]`. If the file path to a module matches an entry
		in this list, a `'Forbidden'` error will be passed to the next error
		middleware. Entries can be a string module id (filename starts with
		entry), a regular expression (`exp.test(filename)`) or any object with
		a `test` function property (`obj.test(filename)`). Files outside of the
		`root` directory are always forbidden, unless they have been mapped.
		Mapped files are always allowed. Example:

			forbid: [
				'server', /\.middleware\.js$/,
				{ test:function(filename) {
					return filename.slice(-3) === 'foo';
				} }
			]

	* `encoding` Defaults to `'utf8'`. Encoding to read module files in.
	* `map` Defaults to `{}`. Map module ids to files in the filesystem.
		`define`, `define.min`, and `define.shim` will be mapped to their
		locations in `lib` unless explicitly mapped elsewhere. Relative paths
		are resolved against `root`. Values can also be functions Example:

			map: {
				jquery: './vendor/jquery.min.js',
				session: function(id, options) {
					// figure out or generate the file for this user
					return sessionFilename;
				}
			}

	* `maxAge` -- Defaults to `undefined`. Seconds the browser should cache the
		module code. If set, will be put in a `Cache-Control: public, max-age=`
		HTTP header.
	* `nowrap` Defaults to `[ 'uris.json', /\.amd\.js$/i ]`. If a module id
		matches an entry in this list, it is not wrapped with a `define()`
		call. Entries can be a string module id (`entry === id`), a regular
		expression (`exp.test(id)`) or any object with a `test` function
		property (`obj.test(id)`).
	* `root` -- Defaults to `process.cwd()`. Base path for modules in the filesystem.
	* `translate` Defaults to `{}`. Translate specific files into CommonJS
		modules. Object keys may be filenames, module ids, or file extensions.
		The functions are passed a module object, with `id`, `filename`, and
		`buffer` properties. Example:

			translate: {
				html: function(module, options, next) {
					var id = module.id, // String
						filename = module.filename, // String
						content = module.buffer, // Buffer
						_ = require('underscore');
					content = content.toString('utf8');
					next(null, 'exports.template = ' + _.template(content).source);
				}
			}

		If they do not match any keys in this option, modules are converted from
		`Buffer` to string with `options.encoding`.
* `modules.module(id, options?, next)` -- Generate the client-side code for
	the module. `id` is a module id string. `options` are the same as for
	`modules.middleware()`. `next(err, result)` will be called when
	done. `err` is any error that may have occured, or `null` otherwise.
	`result` is an object with properties `code`, which is the browser javascript
	as a string, and `modified`, which is a `Date` of the last modified time on
	the source file.
* `modules.modules(ids, options?, next)` -- Exactly like `modules.module` only
	`ids` is an array of module id strings, all of which are included in the
	resulting `result.code`. The `result.modified` is the most recent modified
	time among all of the source files loaded.


#### bundles

	bundles = require('modules/lib/bundles')

Provides functions for bundling modules with their deep dependencies.

* `bundles.bundle(ids, exclude, options?, next)` -- Generate a bundle including
	the browser code for all of the modules in the `ids` array and their deep
	dependencies, except `exclude` and all of their deep dependencies.
	`ids` and `exclude` are arrays of module id strings. `options` are the
	same as `modules.middleware()`. `next` is called when complete, with the
	same arguments as `next` in `modules.module()`.
* `bundles.dependencies(ids, options?, next)` -- Gets a list of `ids` and all
	of their deep dependencies. Modules need to be loaded in order to determine
	their dependencies, so `modules.module()` is called inside this method,
	with the `options` passed in. `next(err, ids)` is called when complete,
	with `ids` as an array of absolute module id strings.
* `bundles.expand(ids, exclude, options?, next)` -- Gets a list just like
	`bundles.dependencies()`, only the ids in `exclude` and their deep
	dependencies are omitted from the list.



## Client-Side Features

 * CommonJS Modules 1.1.1 implementation for in-browser use
 * `module.require` function similar to Node.js implementation
 * `require(id, callback)` for async a la require.js
 * Map module ids to arbirary uris




## Server-Side Features

 * Middleware for express / connect
 * Create bundles of all the deep dependencies of a list of modules
 * Configure minification using your favorite compressor




## Browser Support

* IE 8+, Chrome, Firefox, Safari, Opera
* IE Mobile, Chrome Mobile, Firefox Mobile, Safari Mobile, Opera Mobile

Basically, bugs reported in any common browser will get fixed.
If you need to support IE6 or IE7, please use the last version to support them:
[v0.3.3](https://github.com/thetalecrafter/modules/tree/v0.3.3).




## Who and Why

**modules** was written by Andy VanWagoner
([thetalecrafter](http://github.com/thetalecrafter)).

Some of the motivation for this project can be found in
[this article](http://thetalecrafter.com/2011/09/22/commonjs-in-the-browser/).

* If you like writing your modules in AMD, use
	[require.js](http://requirejs.org).
* If you want the browser environment to be just like Node.js, use
	[browserify](http://browserify.org/).
* If you want simple CommonJS in the browser, then **modules** is for you.

