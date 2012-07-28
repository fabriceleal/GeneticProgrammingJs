/*
	Based in https://gist.github.com/1335696, a simple genetic programming test bed in clojure
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


		// Genetic Programming Framework
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
		var _iterate = function(inds, iterations, maxError){
			var sorted 	= inds.sort(
					function(a, b){
						return error(a) - error(b);
					});
			//--
			var best 		= sorted[0];
			var bestError 	= error(best);
		
			// if error was not supplied, continue
			// if error was supplied but is inferior to the maxError wanted, continue
			if((maxError === undefined && iterations > 0) || (maxError >= 0 && bestError > maxError)){ 

				return _iterate(
						[].
								concat( (inds.length / 2).repeat(function(){ return mutate(tournament(sorted, 7)) }) ).
								concat( (inds.length / 4).repeat(function(){ return crossover(tournament(sorted, 7), tournament(sorted, 7)) }) ).
								concat( (inds.length / 4).repeat(function(){ return tournament(sorted, 7) }) ),
						iterations - 1);	
				
			}

			if(maxError >= 0 && bestError > maxError){
				return {
					// No good enough solution found
					iteration: iterations,
					best : null
				};
			}

			return {
				iteration: iterations,
				best : best.compile(),
				bestError : bestError/*,
				results: sorted.map(function(e){ return { individual:e.compile(), error:error(e) }})*/
			}
		}

		this.iterate = function( iterations ){
			return _iterate(population, Math.max(iterations, 0));
		};

		this.evolve = function( maxError ){
			return _iterate(population, 3000 /* Put max call stack here ...*/, maxError);
		};

		// TODO Getters for these
		var lastPopulation = population;
		var iteration = 0;

		return this;
	};

	// TODO func for empty configs and empty individual (?) ...

	exports.Evolver = Evolver;
})();
