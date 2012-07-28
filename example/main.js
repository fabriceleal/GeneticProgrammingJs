#!/usr/local/bin/node

with(require("../geneticprog.js")){
	var population = [];

	var g = new (require("../../jsrandomproggen/madmonkey.js").Generator)(
			'number->number', [{ name: 'x', type:'number'}]);
	//--

	g.addForm('(function(a,b){ return a+b;})', 												'(number,number)->number' );
	g.addForm('(function(a,b){ return a-b;})', 												'(number,number)->number' );
	g.addForm('(function(a,b){ return a*b;})', 												'(number,number)->number' );
	g.addForm('(function(a,b){ if(b == 0) return 0; else return a/b;})',	'(number,number)->number' );
	g.addForm('(function(){ return Math.floor(Math.random() * 10 - 5)})',			'_->number');

	for(var i = 0; i < 1000; ++i){
		population.push(g.gen(5));
	}

	var e = new Evolver(
			{
				randomCode : function(depth){ return g.gen(depth); },
				inject : function(t1, t2){ return t1.inject(t2); },
				extract: function(t){ return t.extract(); },
				maxDepth: 2
			},
			{
				error : (function(){
								var fn = function(x){ return x*x + x + 1; };
								var idx = new Array(20), data = new Array(20);
								for(var i = -1, y = 0; i <=1; i+=0.1, ++y){
									idx[y] = i;
								}
								data = idx.map(fn);

								return function(i){
									var genred = eval(i.compile());
									var test = idx.map(genred);
									return test.map(function(i, idx){ return Math.abs( i - data[idx]); }).reduce(function(t,i){return t+i}, 0);
								};
								/*return function(i){
									var tmp2 = i.compile();
									console.log(tmp2);
									var tmp = eval(tmp2); 
									if(tmp == NaN || tmp == null) // Invalid expression, penalty 
										return 99999; 
									return Math.abs(tmp - target);
								} */
							})()
			}, 
			population);
	//--
	console.log(JSON.stringify(e.evolve(0.1), null, 3));
	
}
