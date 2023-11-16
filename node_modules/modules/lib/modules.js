/**
 * Provides wrapping of modules for use in the browser.
 **/
'use strict';

var fs = require('fs'),
	extexp = /\.([^.\\\/]+)$/; // matches file extension

/**
 * The default options used
 **/
exports.defaults = {
	encoding: 'utf8',
	nowrap: [ /\.amd\.js$/i ],
	root: process.cwd()
};


/**
 * Turn a relative id to absolute given a parent id
 **/
function resolve(parent, id) {
	if (/^\.\.?\//.test(id) && parent) { // is a relative id
		id = parent.replace(/[^\/]+$/, id); // prepend parent's dirname
	}
	var terms = [];
	id.split('/').forEach(function(term) {
		if ('..' === term) { terms.pop(); } // remove previous, don't add ..
		else if ('.' !== term) { terms.push(term); } // add term
		// else if ('.' === term) // ignore .
	});
	return terms.join('/');
}


/**
 * Convert arbitrary file to commonjs+return exports
 **/
function translate(id, filename, buffer, options, next) {
	var ext = (filename.match(extexp) || [])[1] || '',
		encoding = options.encoding || exports.defaults.encoding,
		trans = options.translate, js, nowrap;

	// make a list of what not to wrap
	nowrap = options.nowrap || exports.defaults.nowrap;
	nowrap = [ 'define', 'define.min', 'define.shim' ].concat(nowrap);
	// should this code get wrapped with a define?
	nowrap = nowrap.some(function(no) {
		return no.test ? no.test(id) : (no === id);
	});

	// convert commonjs to amd
	function wrap(err, js) {
		if (err) { return next(err); }

		var deps = exports.dependencies(id, js), params = [], undef = '';

		// make sure require, exports, and module are properly passed into the factory
		if (/\brequire\b/.test(js)) { params.push('require'); }
		if (/\bexports\b/.test(js)) { params.push('exports'); }
		if (/\bmodule\b/.test(js)) { params.push('module'); }

		// make sure code follows the `exports` path instead of `define` path once wrapped
		if (/\bdefine\.amd\b/.test(js)) { undef = 'var define;'; }

		if (deps.length) {
			deps = ',' + JSON.stringify(params.concat(deps));
		} else if (params.length) {
			params = [ 'require', 'exports', 'module' ];
		}

		js = 'define(' + JSON.stringify(id) + deps + ',function(' + params + ')' +
				'{' + js + '\n' + undef + '}' + // rely on hoisting for define
			');\n';
		next(null, js);
	}

	// find the translate function
	trans = trans && (trans[filename] || trans[id] || trans[ext]);
	if (trans) { // user configured translation
		return trans(
			{ id:id, filename:filename, buffer:buffer },
			options, (nowrap ? next : wrap)
		);
	}

	js = buffer.toString(encoding);

	// handle javascript files
	if ('js' === ext) {
		return (nowrap ? next : wrap)(null, js);
	}

	// handle non-javascript files
	if ('json' !== ext) { js = JSON.stringify(js); } // export file as json string
	if (nowrap) { return next(null, 'return ' + js); }
	return next(null, 'define(' + JSON.stringify(id) + ',' + js + ');\n');
}


/**
 * convert module id to filename
 **/
function getFilename(id, options, next) {
	var Path = require('path'),
		root = options.root || exports.defaults.root,
		map = options.map || {},
		forbid = (options.forbid || []).map(function(forbid) {
			return forbid.test ? forbid : Path.resolve(root, forbid);
		}),
		filename;

	function test(forbid) {
		return forbid.test ? forbid.test(filename) :
			(filename.slice(0, forbid.length) === forbid); // filename starts with forbid
	}

	// mapped modules can be in forbidden places. (define and define.shim should be mapped)
	map.define = map.define || Path.resolve(__dirname, 'define');
	map['define.min'] = map['define.min'] || Path.resolve(__dirname, 'define.min');
	map['define.shim'] = map['define.shim'] || Path.resolve(__dirname, 'define.shim');

	// get a filename from the id
	filename = map[id] || id; // look for the file in the id map
	if ('function' === typeof filename) { filename = filename(id, options); } // if function use result
	filename = Path.resolve(root, filename); // relative to root

	if (!map[id]) {
		// anything below options.root is forbidden
		if ('..' === Path.relative(root, filename).slice(0, 2) || forbid.some(test)) {
			return next(new Error('Forbidden'), '');
		}
	}

	fs.stat(filename, function(err, stats) {
		if (err) { // not found without .js, try with
			return fs.exists(filename + '.js', function(exists) {
				return next(null, filename + (exists ? '.js' : ''));
			});
		}

		if (stats.isDirectory()) { // directories look for /index.js
			return fs.exists(filename + '/index.js', function(exists) {
				return next(null, filename + (exists ? '/index.js' : ''));
			});
		}

		return next(null, filename);
	});
}


/**
 * find all requires with string literal ids
 **/
exports.dependencies = function dependencies(id, js, options) {
	var comments = /\/\/[^\r\n]*/g, // single line comments //
		mcomments = /\/\*[\s\S]*?\*\//g, // multi line comments /*
		reqexp = /\brequire\s*\(\s*(['"]).+?\1\s*\)/g, // find require calls
		idexp = /(['"])(.+?)\1/, // find literal identifier in require call
		rid, aid, abs = [], rel = [],
		// find all require calls after removing comments
		matches = js
			.replace(comments, '')
			.replace(mcomments, '')
			.match(reqexp),
		m, mm = matches && matches.length;

	for (m = 0; m < mm; ++m) {
		// resolve to absolute id
		aid = resolve(id, rid = matches[m].match(idexp)[2]);
		if (abs.indexOf(aid) < 0) {
			// keep both relative and absolute ids
			abs.push(aid);
			rel.push(rid);
		}
	}

	// return either relative or absolute ids
	return (options && options.absolute) ? abs : rel;
};


/**
 * Prints the code for the module, including define wrapper code necessary in the browser.
 **/
exports.module = function module(id, options, next) {
	// options is an optional parameter
	if (!next) {
		next = options;
		options = {};
	}

	// remove .js suffix
	if (id.slice(-3) === '.js') { id = id.slice(0, -3); }

	var filename, stat, mod;

	getFilename(id, options, getStat);

	function getStat(err, mfilename) {
		if (err) { return next(err); }
		filename = mfilename;
		fs.stat(filename, getFile);
	}

	function getFile(err, mstat) {
		if (err) { return next(err); }
		stat = mstat;
		fs.readFile(filename, getCode);
	}

	function getCode(err, buffer) {
		if (err) { return next(err); }
		translate(id, filename, buffer, options, compressCode);
	}

	function compressCode(err, js) {
		if (err) { return next(err); }
		// create module object
		mod = {
			id: id,
			filename: filename,
			code: js,
			modified: (stat && stat.mtime)
		};

		if (options.compress) {
			options.compress(mod, done);
		} else {
			done(null, js);
		}
	}

	function done(err, js) {
		if (err) { return next(err); }
		mod.code = (js.code || js);
		next(null, mod);
	}
};


/**
 * Prints the code for the modules
 **/
exports.modules = function modules(ids, options, next) {
	// options is an optional parameter
	if (!next) {
		next = options;
		options = {};
	}

	var results = [], doneCount = 0,
		compress = options.compress, modified;

	// don't compress each individually
	options.compress = null;

	// loop through all the modules
	ids.forEach(moduleToCode);
	if (!ids.length) { process.nextTick(alldone); }

	// convert a module
	function moduleToCode(id, r) {
		exports.module(id, options, done);
		function done(err, result) {
			if (err) {
				next(err);
				next = function(){}; // make sure you only call next(err) once
				return;
			}

			if (result && (!modified || result.modified > modified)) {
				modified = result.modified; // update latest last modified date
			}

			results[r] = result && result.code || '';
			if (++doneCount >= ids.length) { alldone(); } // done with all of them

		}
	}

	// put it all together
	function alldone() {
		// combine and compress modules
		var module = {
				code: results.join(''),
				modified: modified
			};

		// no compressing? done.
		if (!compress) { return next(null, module); }

		compress(module, function(err, js) {
			module.code = js.code || js;
			next(err, err ? null : module);
		});
	}
};


/**
 * Provides middleware to format module code for use in the browser.
 **/
exports.middleware = function middleware(options) {

	// string passed means root directory
	if ('string' === typeof options) {
		options = { root:options };
	}
	options = options || {};
	var maxage = options.maxAge;

	// return middleware function
	return function(req, res, next) {
		var id = req.path.replace(/^\/+/, ''); // remove leading slashes
		exports.module(id, options, send);
		function send(err, module) {
			if (err) {
				// if file not found, let other handlers try
				if ('ENOENT' === err.code) { return next(); }
				return next(err);
			}

			// send proper headers
			res.set('Content-Type', 'application/javascript');
			res.set('Last-Modified', module.modified.toGMTString());
			if (maxage || 0 === maxage) {
				res.set('Cache-Control', 'public, max-age=' + maxage);
			}

			// send javascript code
			res.send(module.code);
		}
	};
};

