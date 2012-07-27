/*
	Based in https://gist.github.com/1335696, a simple genetic programming test bed in clojure
*/


(function(){

	var Evolver = function(generatorConfig, populationConfig, population ){

		// Generate code with maxDepth / extern (generator)
		var randomCode = generatorConfig.randomCode;

		// Code size of a tree / extern (generator)
		var codesize 	= generatorConfig.codeSize;

		// Inject code into individual / extern (generator)
		var inject 		= generatorConfig.inject;

		// Extract code from individual / extern (generator)
		var extract		= generatorConfig.extract;


		// Error function / extern (population)
		var error		= populationConfig.error;


		// Genetic Programming Framework
		var mutate = function(ind){
			return inject(randomCode(MAX_DEPTH), ind);
		};

		var crossover = function(a, b){
			return inject(extract(a), b);
		};


		// "select" (TODO make a enum ...)
		var tournament = function( inds ){
			
		};

		// "evolve" TODO
		this.iterate = function( inds ){
			
		};

		// TODO Getters for these
		var lastPopulation = population;
		var iteration = 0;

		return this;
	};

	// TODO func for empty configs and empty individual (?) ...

	exports.Evolver = Evolver;
})();
