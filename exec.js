importScripts("vendors/require.js");

var gpjs;
var madmonkey;

var population;
var maxDepth;

addEventListener("message", function(event){
	switch(event.data.name) {
		case "load":
			{
				var err = null;
				try {
					gpjs = require('./madmonkey.js');
				} catch(e) {
					err = e;
				}
				if(! err) {
					try {
						gpjs = require('./geneticprog.js');
					} catch(e) {
						err = e;
					}
				}

				postMessage({ name: "load", data: { err:err, }});
			}
			break;
		case "population":
			{
				population = 0;
				maxDepth = 0;
			}
			break;
		case "evolver":
			{

			}
			break;
		case "start":
			{

			}
			break;
	}	
});
