#!/usr/local/bin/node

with(require("../geneticprog.js")){
	var population = [];

	var g = new (require("../../jsrandomproggen/madmonkey.js").Generator)('_->number');

	g.addForm('(Math.sin)', 												'(number)->number' ).
			addForm('(Math.cos)', 											'(number)->number' ).			
			addForm('(150)', 													'number');

	for(var i = 0; i < 1000; ++i){
		population.push(g.gen(10));
	}

	var e = new Evolver(
			{
				randomCode : function(depth){ return g.gen(depth); },
				inject : function(t1, t2){ return t1.inject(t2); },
				extract: function(t){ return t.extract(); },
				maxDepth: 10
			},
			{
				error : (function(){
								var target = Math.sin(Math.cos(Math.sin(Math.cos(150)))); 
								return function(i){
									var tmp = eval(i.compile()); 
									if(tmp == NaN || tmp == null) /* Invalid expression, penalty*/ return 99999; 
									return Math.abs(tmp - target);
								} 
							})()
			}, 
			population);
	//--
	console.log(JSON.stringify(e.iterate(2), null, 3));
	
}
