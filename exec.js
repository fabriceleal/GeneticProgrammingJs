importScripts("vendors/require.js");

var gpjs;
var madmonkey;

var maxDepth;
var generator;

var populationCount;
var population = [];

var evolver;

addEventListener("message", function(event){
	var err;

	switch(event.data.name) {
		case "load":
			{
				err = null;
				try {
					madmonkey = require('./madmonkey.js');
				} catch(e) {
					err = e;
				}
				if(! err) {
					try {
						gpjs = require('./geneticprog.js');
					} catch(e) {
						err = e.toString();
					}
				}

				postMessage({ name: "load", data: { err:err }});
			}
			break;
		case "generator":
			{
				err = null;
				try {

					maxDepth = event.data.data.maxDepth;
					generator = new madmonkey.Generator(
							'number->number', [{ name: 'x', type:'number'}]);
					//--

					generator.addForm('(function(a,b){ return a+b;})', '(number,number)->number' );
					generator.addForm('(function(a,b){ return a-b;})', '(number,number)->number' );
					generator.addForm('(function(a,b){ return a*b;})', '(number,number)->number' );
					generator.addForm('(function(a,b){ if(b == 0) return 0; else return a/b;})', '(number,number)->number' );
					generator.addForm('(function(){ return Math.floor(Math.random() * 10 - 5)})',	'_->number');

				} catch(e) {
					err = e.toString();
				}

				postMessage({ name: "generator", data: { err:err }});
			}
			break;
		case "population":
			{
				err = null;
				try{
					populationCount = event.data.data.number;
								
					for(var i = 0; i < populationCount; ++i){
						population.push(generator.gen(maxDepth));
					}

				} catch(e) {
					err = e.toString();
				}

				postMessage({ name: "population", data: { err:err }});
			}
			break;
		case "evolver":
			{
				err = null;
				try{
					evolver = new gpjs.Evolver(
							{
								randomCode : function(depth){ return generator.gen(maxDepth); },
								inject : function(t1, t2){ return t1.inject(t2); },
								extract: function(t){ return t.extract(); },
								maxDepth: maxDepth
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
													return test.map(function(i, idx){ 
															return Math.abs( i - data[idx]); 
													}).reduce(function(t,i){
															return t+i; 
													}, 0);
												};											
											})()
							}, 
							population);
					//--
				}catch(e){
					err = e;
				}

				postMessage({ name: "evolver", data: { err:err }});
			}
			break;
		case "start":
			{
				err = null;
				var result = null;
				try{
					switch(event.data.data.type){ 
						case "evolve":
							result = evolver.evolve(event.data.data.arg);
							break;
						case "iterate":
							result = evolver.iterate(event.data.data.arg);
							break;
					}
				}catch(e){
					err = e.toString();
				}

				postMessage({ name: "start", data: { err:err, result:result }});
			}
			break;
	}	
});
