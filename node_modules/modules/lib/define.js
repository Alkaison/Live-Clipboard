(function(global, undefined) {
	var doc = global.document, modules = {}, waits = {}, factories = {}, urls = {},
		link = doc.createElement('a'),
		main = doc.querySelector('#modules-define,script[data-main]'),
		path = main ? (main.getAttribute('data-path') || main.src) : '',
		uids = JSON.parse(main ? main.getAttribute('data-urls') : '{}') || {};

	// a poor-man's Array.prototype.map
	function map(arr, fn) {
		for (var arr2 = [], a = 0, aa = arr.length; a < aa; ++a) { arr2[a] = fn(arr[a]); }
		return arr2;
	}

	// run all functions waiting for the module
	function fireWaits(module) {
		map(waits[module.id], function(fn) { fn(module); });
		waits[module.id] = [];
	}

	// make a url absolute
	function canonicalize(url) {
		link.href = url; // Ensures that the href is properly escaped
		return link.href;
	}

	// look for all of the modules at the given url
	function mapUrlToIds(url, ids) {
		map(ids, function(id) { urls[id] = url; });
	}

	// define a new module
	function define(id, deps, exp) {
		if (!exp) { exp = deps; deps = [ 'require', 'exports', 'module' ]; }
		var module = getModule(undefined, id);
		module.children = map(deps, function(dep) { return getModule(module, dep); });
		module.loaded = true;
		factories[id] = exp;
		fireWaits(module);
	}

	// build out the require function specific to the module scope
	function makeRequire(module) {
		var mrequire = function(id, fn) { return require(module, id, fn); };
		mrequire.resolve = function(id) { return getModule(module, id).uri; };
		mrequire.toUrl = function(id) {
			return getModule(module, id.replace(/\.[^.\\\/]+$/, ''))
				.uri.replace(/\.js$/i, id.match(/\.[^.\\\/]+$/));
		};
		mrequire.cache = modules;
		mrequire.main = main;
		mrequire.map = mapUrlToIds; // allow mapping multiple module ids to a url
		return mrequire;
	}

	// build or retrieve a specific module object
	function getModule(parent, id) {
		if ('require' === id || 'exports' === id || 'module' === id) {
			return { id:id, loaded:true, exports:parent[id] || parent, children:[] };
		}

		id = resolve(parent, id).replace(/\.js$/i, '');
		if (modules[id]) { return modules[id]; }
		var uri = canonicalize(urls[id] ? urls[id] : path.replace(/[^\/]*$/, id + '.js')),
			module = (modules[id] = { id:id, filename:uri, uri:uri, loaded:false, children:[] });
		module.require = makeRequire(module);
		waits[id] = [];
		return module;
	}

	// execute a module's code, and return its exports
	function require(parent, id, fn) {
		if (fn) { return ensure(parent, id, fn); }
		var module = getModule(parent, id);
		if (!module.loaded) { throw new Error(id + ' not found'); }
		if (!('exports' in module)) {
			module.parent = parent; // first module to actually require this one is parent

			// if define was passed a non-function, just assign it to exports
			if ('function' !== typeof factories[id = module.id]) { module.exports = factories[id]; }
			else {
				module.exports = {};
				fn = map(module.children.slice(0, factories[id].length), // don't require prematurely on wrapped commonjs
						function(child) { return require(module, child.id); });
				if ((fn = factories[id].apply(global, fn))) { module.exports = fn; } // if something was returned, export it instead
			}
		}
		return module.exports;
	}

	// resolve a module id relative to the parent scope
	function resolve(parent, id) {
		if (/^\.\.?\//.test(id) && parent && parent.id) { // is a relative id
			id = parent.id.replace(/[^\/]+$/, id); // prepend parent's dirname
		}
		var terms = [];
		map(id.split('/'), function(term) {
			if ('..' === term) { terms.pop(); } // remove previous, don't add ..
			else if ('.' !== term) { terms.push(term); } // add term
			// else if ('.' === term) // ignore .
		});
		return terms.join('/');
	}

	// make sure the modules are loaded
	function ensure(parent, ids, fn) {
		ids = [].concat(ids);
		var visited = {}, wait = 0;

		function done() {
			if (fn) { fn.apply(global, map(ids, function(id) { return require(parent, id); })); }
			fn = undefined;
		}
		function visit(module) {
			if (module.id in visited) { return; }
			if ((visited[module.id] = module.loaded)) { return map(module.children, visit); }

			++wait;
			waits[module.id].push(function() {
				map(module.children, visit);
				if (--wait <= 0) { setTimeout(done, 0); }
			});

			var script;
			map(doc.querySelectorAll('script'), function(node) {
				if (canonicalize(node.src) === module.uri) { script = node; }
			});

			if (!script) {
				script = doc.createElement('script');
				script.onload = script.onerror = script.onreadystatechange = function() {
					if ('loading' === script.readyState) { return; }
					script.onload = script.onerror = script.onreadystatechange = null;
					fireWaits(module);
				};
				script.defer = true;
				script.src = module.uri;
				doc.querySelector('head').appendChild(script);
			}
		}

		map(ids, function(id) { visit(getModule(parent, id)); });
		if (wait <= 0) { setTimeout(done, 0); } // always async
	}



	// if there were modules shim defined before now, really define them now
	if (global.define && global.define.amd) {
		if (!global.define.amd.d) { return; } // bail if not define.shim, defer to other loader
		map(global.define.amd.d, function(args) { define.apply(undefined, args); });
	}

	// this define function is AMD compatible
	define.amd = {};

	// make sure we map all of the urls in the attribute
	for (var url in uids) { mapUrlToIds(url, uids[url]); }

	// if there is a main module, require it when the page is ready
	function run() { require(undefined, main.id, function(){}); }
	if ((main = main && main.getAttribute('data-main') || undefined)) {
		(main = getModule(undefined, main)).require.main = main;
		if ('loading' !== doc.readyState) { setTimeout(run, 0); }
		else if (doc.addEventListener) {
			doc.addEventListener('DOMContentLoaded', run, false);
			global.addEventListener('load', run, false);
		} else { // if (global.attachEvent) assume if addEventListener wasn't found
			global.attachEvent('onload', run);
		}
	}

	// export `define`, `require`, and `global` to global object
	global.global = global; // for greater nodejs compat
	global.define = define;
	global.require = makeRequire();

}(this));

