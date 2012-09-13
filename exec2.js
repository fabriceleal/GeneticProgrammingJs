importScripts('vendors/Box2d.debug.js');

// Nice aliases for box2d
var   b2Vec2 = Box2D.Common.Math.b2Vec2
	 , b2BodyDef = Box2D.Dynamics.b2BodyDef
	 , b2Body = Box2D.Dynamics.b2Body
	 , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
	 , b2Fixture = Box2D.Dynamics.b2Fixture
	 , b2World = Box2D.Dynamics.b2World
	 , b2MassData = Box2D.Collision.Shapes.b2MassData
	 , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
	 , b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
	 , b2DebugDraw = Box2D.Dynamics.b2DebugDraw
	 , b2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef
	 , b2PrismaticJoint = Box2D.Dynamics.Joints.b2PrismaticJoint;

var WorldClass = function(interval, adaptive){
	this.interval = interval;
	this.adaptive = adaptive;
	this.lastTimestamp = Date.now();
	this.world = new b2World(new b2Vec2(0, 10), true);
	//this.world.SetContinuousPhysics(true);
	
	this.SCALE = 30;
	
	this.bodyDef = new b2BodyDef();
			
	this.fixDef = new b2FixtureDef();
	this.fixDef.density = 1.0;
	this.fixDef.friction = 0.5;
	this.fixDef.restitution = 0.2;
};

WorldClass.prototype.update = function(){
	var now = Date.now();
	var stepRate = this.adaptive ? now - this.lastTimestamp / 1000 : (1 / this.interval);
	this.lastTimestamp = now;
	this.world.Step(stepRate, 10, 10);
	this.world.ClearForces();
	this.sendUpdate();
};

WorldClass.prototype.sendUpdate = function(){
	var data = {};
	for(var b = this.world.GetBodyList(); b; b = b.m_next){
		if(typeof b.GetUserData() !== 'undefined' && b.GetUserData() !== null) {
			data[b.GetUserData()] = {
				id: b.GetUserData(),
				x : b.GetPosition().x * this.SCALE,
				y : b.GetPosition().y * this.SCALE,
				a : b.GetAngle()
			};
		}
	}
	postMessage({ name: 'update', data: data });
};

WorldClass.prototype.appendBodies = function(bodies){
	//postMessage({name:'debug', data:bodies });
	this.ready = false;
	this.bodyDef.type = b2Body.b2_dynamicBody;
	var world = this;
	for(var k in bodies){		
		(function(entity){
			if(entity.type === 'circle'){
				world.fixDef.shape = new b2CircleShape(entity.radius);
			} else if(entity.type === 'polygon'){
				var points = entity.points.map(function(p){
					var v = new b2Vec2(); 
					v.Set(p.x, p.y); 
					return v;
				});
				world.fixDef.shape = new b2PolygonShape();
				postMessage({name:'debug', data:['hello', points.length]});
				world.fixDef.shape.SetAsArray(points, points.length);
				postMessage({name:'debug', data:['hello 2']});
			} else if(entity.type === 'box'){
				world.fixDef.shape = new b2PolygonShape;
				world.fixDef.shape.SetAsBox(entity.width / 2, entity.height / 2);
			}
			world.bodyDef.position.x = entity.x / world.SCALE;
			world.bodyDef.position.y = entity.y / world.SCALE;
			world.bodyDef.userData = entity.id;
			world.world.CreateBody(world.bodyDef).CreateFixture(world.fixDef);
			//postMessage({name:'debug', data:[k] });
		})(bodies[k]);		
	}
	this.ready = true;
};

var world;
var loop = function(){
	if(world.ready){
		world.update();
	}
}

addEventListener('message', function(event){
	var err;
	
	if(event.data.name === 'create'){
		try{
			world = new WorldClass(30, false);
		}catch(e){
			err = e.toString();
		}		

	}
	if(event.data.name === 'appendBodies'){
		try{
			world.appendBodies(event.data.data);
		}catch(e){
			err = e.toString();
		}

	}
	if(event.data.name === 'start'){
		try{
			setInterval(loop, 1000/30);
		}catch(e){
			err = e.toString();
		}

	}
	
	postMessage({name:event.data.name, err:err});
});