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
	 , b2PrismaticJoint = Box2D.Dynamics.Joints.b2PrismaticJoint
	 , b2Transform = Box2D.Common.Math.b2Transform
	 , b2RayCastInput = Box2D.Collision.b2RayCastInput;

var WorldClass = function(interval, adaptive, scale, width, height){
	this.interval = interval;
	this.adaptive = adaptive;
	this.lastTimestamp = Date.now();
	this.world = new b2World(new b2Vec2(0, /*1*/0), true);
	//this.world.SetContinuousPhysics(true);
	
	this.SCALE = scale;
	
	this.bodyDef = new b2BodyDef();
			
	this.fixDef = new b2FixtureDef();
	this.fixDef.density = 1.0;
	this.fixDef.friction = 0.5;
	this.fixDef.restitution = 0.2;
	
	this.bodies = {};

	// Create Ground / Ceilling / Walls (to test collision)
	var bodyDef = new b2BodyDef();
	var fixDef = new b2FixtureDef();
	bodyDef.type = b2Body.b2_staticBody;
	fixDef.shape = new b2PolygonShape;

	bodyDef.position.x = width / 2 / this.SCALE;
	bodyDef.position.y = height / this.SCALE;
	fixDef.shape.SetAsBox(width / this.SCALE / 2, (10/this.SCALE) / 2);
	this.world.CreateBody(bodyDef).CreateFixture(fixDef);

	bodyDef.position.x = width / 2 / this.SCALE;
	bodyDef.position.y = 0;
	fixDef.shape.SetAsBox(width / this.SCALE / 2, (10/this.SCALE) / 2);
	this.world.CreateBody(bodyDef).CreateFixture(fixDef);
	
	bodyDef.position.x = width / this.SCALE;
	bodyDef.position.y = height / 2 / this.SCALE;
	fixDef.shape.SetAsBox((10/this.SCALE) / 2, width / this.SCALE / 2);
	this.world.CreateBody(bodyDef).CreateFixture(fixDef);

	bodyDef.position.x = 0;
	bodyDef.position.y = height / 2 / this.SCALE;
	fixDef.shape.SetAsBox((10/this.SCALE) / 2, width / this.SCALE / 2);
	this.world.CreateBody(bodyDef).CreateFixture(fixDef);

	this.world.SetContactListener({
		BeginContact: function(contact){
			//postMessage({name:'debug', data:'begin contact'});
		},
		EndContact : function(contact){	
			//postMessage({name:'debug', data:'end contact'});
		},
		PreSolve : function(contact, oldManifold){
			if(contact.IsTouching()){
				var bodya = contact.GetFixtureA().GetBody().GetUserData();
				var bodyb = contact.GetFixtureB().GetBody().GetUserData();
				
				if(bodya){
					
				}
				if(bodyb){
					
				}
				//postMessage({name:'debug', data:'pre solve'});
			}
		},
		PostSolve : function(contact, impulse){
			//postMessage({name:'debug', data:'post contact'});
		}
	}
	);
};

WorldClass.prototype.update = function(){
	var now = Date.now();
	var stepRate = (this.adaptive) ? ((now - this.lastTimestamp) / 1000) : (1 / this.interval);
	
	this.lastTimestamp = now;
	this.world.Step(stepRate, 10, 10);
	this.world.ClearForces();
	
	// raycast here?	
	var t = new b2Transform();
	t.SetIdentity();
	
	var i = new b2RayCastInput();
	// Fix these ...
	i.p1.Set(0.0, 0.0, 0.0);
	i.p2.Set(1.0, 0.0, 0.0);
	i.maxFraction = 1500000.0;
	var o = {};	
	
	if (this.bodies['triangle1'].GetFixtureList() && this.bodies['triangle26'].GetFixtureList().GetShape().RayCast(o, i, t, 0)){
		postMessage({ name: 'debug', data: true});

	}
	
	//postMessage({ name: 'debug', data: {} });
	
	this.sendUpdate();
};

WorldClass.prototype.sendUpdate = function(){
	var data = {};
	for(var b = this.world.GetBodyList(); b; b = b.m_next){
		if(typeof b.GetUserData() !== 'undefined' && b.GetUserData() !== null) {
			data[b.GetUserData()] = {
				id: b.GetUserData(),
				x : b.GetPosition().x,
				y : b.GetPosition().y,
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
	this.bodyDef.allowSleep = true;
	this.bodyDef.awake = false;
	//var _this = this;
	
	var entity, body;
	
	for(var k in bodies){		
		entity = bodies[k];
		if(entity.type === 'circle'){
			this.fixDef.shape = new b2CircleShape(entity.radius);
		} else if(entity.type === 'polygon'){
			var points = entity.points.map(function(p){
				var v = new b2Vec2(); 
				v.Set(p.x, p.y); 
				return v;
			});
			this.fixDef.shape = new b2PolygonShape();
			//postMessage({name:'debug', data:['hello', points.length]});
			this.fixDef.shape.SetAsArray(points, points.length);
			//postMessage({name:'debug', data:['hello 2']});
		} else if(entity.type === 'box'){
			this.fixDef.shape = new b2PolygonShape;
			this.fixDef.shape.SetAsBox(entity.width / 2, entity.height / 2);
		}
		this.bodyDef.position.x = entity.x;
		this.bodyDef.position.y = entity.y;
		this.bodyDef.userData = entity.id;
		
		body = this.world.CreateBody(this.bodyDef);
		this.bodies[ entity.id ] = body;
		body.CreateFixture(this.fixDef);

	}
	this.ready = true;
};

var world;
var loop = function(){
	if(world.ready){
		world.update();
	}
};
var intervalId;

addEventListener('message', function(event){
	var err;
	var data = event.data;
	var __name = data.name;
	var __data = data.data;
	
	if(__name === 'create'){
		try{
			if(world)
				throw 'world is already created!';

			world = new WorldClass(30, true, __data.scale, __data.width, __data.height);

		}catch(e){
			err = e.toString();
		}
	}

	if(event.data.name === 'appendBodies'){
		try{
			world.appendBodies(__data);
		}catch(e){
			err = e.toString();
		}
	}
	
	if(__name === 'applyForce'){
		try{			
			var body = world.bodies[__data.id];
			body.ApplyForce(new b2Vec2(
					Math.cos(__data.degrees * Math.PI / 180) * __data.power, 
					Math.sin(__data.degrees * Math.PI / 180) * __data.power), 
					body.GetWorldCenter()); // GetLocalCenter
		}catch(e){
			err = e.toString();
		}
	}
	
	if(__name === 'applyImpulse'){
		try{			
			var body = world.bodies[__data.id];			
			body.ApplyImpulse(new b2Vec2(
					Math.cos(__data.degrees * Math.PI / 180) * __data.power, 
					Math.sin(__data.degrees * Math.PI / 180) * __data.power), 
					body.GetWorldCenter()); // GetLocalCenter
		}catch(e){
			err = e.toString();
		}
	}
	
	
	if(__name === 'start'){
		try{
			intervalId = setInterval(loop, 1000/30);
		}catch(e){
			err = e.toString();
		}
	}
	
	if(__name === 'close'){
		try{
			close();
			clearInterval(intervalId);
		}catch(e){
			err = e.toString();
		}
	}

	postMessage({name:__name, err:err});
});