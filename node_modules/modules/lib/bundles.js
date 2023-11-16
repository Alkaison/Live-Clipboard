/**
 * Provides bundling modules into a single file
 **/
'use strict';

var modules = require('./modules');


/**
 * Cached lists of shallow dependencies for modules
 **/
exports.cache = {};


/**
 * Finds all the modules' nested dependencies and provides the ids as an array
 *  id can be a string or an array of absolute module ids
 **/
exports.dependencies = function dependencies(ids, options, next) {
	// options is an optional parameter
	if (!next) {
		next = options;
		options = {};
	}

	options = Object.create(options); // make sure changes don't modify original
	options.compress = false; // don't compress, as it could rename literal requires
	options.nowrap = [ { test: function() { return true; } } ]; // don't wrap either

	ids = Array.isArray(ids) ? ids.slice() : [ ids ];
	var list = [], pendingCount = 0, error;

	// start processing the ids
	ids.forEach(visit);
	check();

	function visit(id) {
		// if it's in the list, it was already run
		if (list.indexOf(id) >= 0) { return; }
		list.push(id);

		getCode(id);
	}

	function getCode(id) {
		// check if already retrieved and cached
		var deps = exports.cache[id];
		if (deps) { return deps.forEach(visit); }

		++pendingCount; // keep track of pending module lookups
		modules.module(id, options, getDeps);
	}

	function getDeps(err, mod) {
		if (err) { return next(error = err); } // keep an error so we know to short-circuit
		--pendingCount;

		// find all shallow dependencies in this module's code
		var id = mod.id,
			deps = modules.dependencies(id, mod.code, { absolute:true });
		exports.cache[id] = deps;

		if (error) { return; } // stop if there was an error

		deps.forEach(visit);
		check();
	}

	function check() {
		if (pendingCount) { return; }
		process.nextTick(function() { next(null, list); });
	}
};


/**
 * expand module id list to include all deep dependencies, and exclude the deep dependencies of the assumed ids
 **/
exports.expand = function expand(ids, assumed, options, next) {
	// options is an optional parameter
	if (!next) {
		next = options;
		options = {};
	}

	var deepIds, deepAssumed;

	// get deep dependencies of includes
	exports.dependencies(ids, options, function(err, ids) {
		if (err) { return next(err); }

		deepIds = ids;
		if (deepAssumed) { done(); }
	});

	// get deep dependencies of excludes
	exports.dependencies(assumed, options, function(err, assumed) {
		if (err) { return next(err); }

		deepAssumed = assumed;
		if (deepIds) { done(); }
	});

	function done() {
		// filter out excludes
		var ids = deepIds.filter(function(id) {
			return deepAssumed.indexOf(id) < 0;
		});

		next(null, ids);
	}
};


/**
 * create a module bundle from the list of includes and excludes
 **/
exports.bundle = function bundle(ids, assumed, options, next) {
	// options is an optional parameter
	if (!next) {
		next = options;
		options = {};
	}

	// expand the list of includes and excludes to single list of deep dependencies
	exports.expand(ids, assumed, options, function(err, list) {
		if (err) { return next(err); }

		modules.modules(list, options, next);
	});
};

