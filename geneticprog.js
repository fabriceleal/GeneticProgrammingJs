/*
	A simple genetic programing framework.
	You should implement the functions to generate the expression trees and the mutate and extract operators. You can use madmonkey (see examples).

	Based in https://gist.github.com/1335696, a simple genetic programming test bed in clojure.
	My javascript version is way longer and dirtier :(

	TODO 
*/


(function(){

	var Evolver = function(generatorConfig, populationConfig, population ){

		// Generate code with maxDepth / extern (generator)
		var randomCode = generatorConfig.randomCode;

		// Code size of a tree / extern (generator)
		//var codesize 	= generatorConfig.codeSize;

		// Inject code into individual / extern (generator)
		var inject 		= generatorConfig.inject;

		// Extract code from individual / extern (generator)
		var extract		= generatorConfig.extract;


		// Error function / extern (population)
		var error		= populationConfig.error;


		var mutate = function(ind){
			return inject(randomCode(generatorConfig.maxDepth), ind);
		};

		var crossover = function(a, b){
			return inject(extract(a), b);
		};

		// TODO This is ugly ...
		Number.prototype.repeat = function(doSomething){
			var last = Math.floor(this);
			var ret = new Array(last);
			for(var i = 0; i < last; ++i){
				ret[i] = doSomething();
			}
			return ret;
		};

		// "select"
		var tournament = function( sortedInds, size ){
			// Generate *size* random numbers, from 0 to sortedInds.length
			var idx = [];
			for(var i = 0; i < size; ++i) 
				idx.push(Math.floor(Math.random() * sortedInds.length));

			// Take the min			
			// Take the individual at position idx
			return sortedInds[ idx.reduce(function(t, i){ return Math.min(t, i); }, sortedInds.length)];
		};

		// private
		var _iterate = function(inds, iterations, maxIterations, maxError){
			var sorted 	= inds.sort(
					function(a, b){
						return error(a) - error(b);
					});

			var best 		= sorted[0];
			var bestError 	= error(best);

			if(iterations < maxIterations && (maxError === undefined || (maxError >= 0 && bestError > maxError))){ 
				return _iterate(
						[].
								concat( (inds.length / 2).repeat(function(){ return mutate(tournament(sorted, 7)) }) ).
								concat( (inds.length / 4).repeat(function(){ return crossover(tournament(sorted, 7), tournament(sorted, 7)) }) ).
								concat( (inds.length / 4).repeat(function(){ return tournament(sorted, 7) }) ),
						iterations + 1, maxIterations, maxError);	
			
			}

			if(iterations == maxIterations && maxError >= 0 && bestError > maxError){
				return {
					// No good enough solution found
					iteration: iterations,
					best : null
				};
			}

			return {
				iteration: iterations,
				best : best.compile(),
				bestError : bestError
			};
		};

		this.iterate = function( iterations ){
			return _iterate(population, 0, Math.max(iterations, 0));
		};

		this.evolve = function( maxError ){
			return _iterate(population, 0, 3000 /* Put max call stack here ...*/, maxError);
		};

		// TODO Getters for these
		var lastPopulation = population;
		var iteration = 0;

		return this;
	};

	var EventEmitter = require('events').EventEmitter;
	Evolver.prototype = new EventEmitter();
	Evolver.prototype.constructor = Evolver;

	// TODO func for empty configs and empty individual (?) ...

	exports.Evolver = Evolver;
})();
