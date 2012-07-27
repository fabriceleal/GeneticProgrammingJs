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

		// "evolve"
		this.iterate = function( iterations ){
			var sorted 	= population.sort(function(a, b){ return error(a) - error(b)});
			var best 	= sorted[0];
			var bestError = error(best);
			
			if(iterations > 0){

			}
			
			return {
				best : best.compile(),
				bestError : bestError,
				results: population.map(function(e){ return { individual:e.compile(), error:error(e) }})
			}
		};

		// TODO Getters for these
		var lastPopulation = population;
		var iteration = 0;

		return this;
	};

	// TODO func for empty configs and empty individual (?) ...

	exports.Evolver = Evolver;
})();
