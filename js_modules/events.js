(function(){
	var EventEmitter = function(){

	};
	exports.EventEmitter = EventEmitter;

	EventEmitter.prototype.emit = function(){
		throw new Error('event emitter for browser not implemented!');
	};
	EventEmitter.prototype.on = function(){
		throw new Error('event emitter for browser not implemented!');
	};
	EventEmitter.prototype.addListener = function(){
		throw new Error('event emitter for browser not implemented!');
	};
})();
