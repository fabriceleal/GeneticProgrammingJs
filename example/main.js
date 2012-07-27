#!/usr/local/bin/node

with(require("../geneticprog.js")){
	var population = null;

	var g = new (require("../../jsrandomproggen/madmonkey.js").Generator)('_->number');

	g.addForm('(Math.sin)', 												'(number)->number' ).
			addForm('(Math.cos)', 											'(number)->number' ).
			addForm('(Math.sqrt)', 											'(number)->number' ).
			addForm('(Math.tan)', 											'(number)->number' ).
			addForm('(150)', 													'number');

	population = [g.gen(10), g.gen(10), g.gen(10)];
	//console.log(JSON.stringify(population, null, 3));

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
								return function(i){ return eval(i.compile()) - target } 
							})()
			}, 
			population);
	//--
	console.log(JSON.stringify(e.iterate(), null, 3));
	
}
