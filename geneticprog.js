/*
	Based in https://gist.github.com/1335696, a simple genetic programming test bed in clojure

*/


(function(){

	// Generate code with maxDepth / extern
	var randomCode = function(maxDepth){

	};

	// Code size of a tree / extern
	var codesize = function(code){

	};
	
	// Inject code into individual / extern
	var inject = function(code, ind){

	};

	// Extract code from individual / extern
	var extract = function(ind){

	};

	// Error function / extern
	var error = function(ind){

	};
	

	var mutate = function(ind){
		return inject(randomCode(MAX_DEPTH), ind);
	};

	var crossover = function(mary, joseph){
		return inject(extract(joseph), mary);
	};


	// "select" (TODO make a enum ...)
	var tournament = function(){
		
	};

	// "evolve" TODO
	// YOU are responsible for generating the population!
	var iterate = function(population){
		
	};

})();
