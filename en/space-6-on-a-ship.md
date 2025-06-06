title=Space 6: on a ship
uuid=49035403-146f-4954-af4e-74ff102e29b4
PROCESSOR=Markdown.pl
intro=FPV mode, so we can walk on the ship
tags=Space3D
created=2017-10-01

So I'm back, and here's a new step: now we can walk on the ship, too!

Note, however, that there is no collision detection, so you can walk through walls.

Also,now we have stars and my wife helped me to design the ship this time.

Controls:

* WASD - move the ship
* RF - move the ship up/down
* Arrows - turn the ship
* QE - bank the ship
* YGHJ - move the player onboard the ship
* Click the game and move the mouse to look around

<div>
		<script src="three.js"></script>
		<script src="cannon.js"></script>
		<script src="PointerLockControls-6.js"></script>
		<script>
			// Our Javascript will go here.

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, 686/460, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();
renderer.setSize(  686, 460);
document.querySelector('.post').appendChild( renderer.domElement );

world = new CANNON.World();
world.gravity.set(0,0,0);
world.broadphase = new CANNON.NaiveBroadphase();
world.solver.iterations = 10;

world2 = new CANNON.World();
world2.gravity.set(0,0,-10);
world2.broadphase = new CANNON.NaiveBroadphase();
world2.solver.iterations = 10;

world.defaultContactMaterial.contactEquationStiffness = 1e6;
world.defaultContactMaterial.contactEquationRelaxation = 10;

world2.defaultContactMaterial.friction=0;


var ship={
	w:3,
	h:5,
	cells:
		[[3,3,3],
		 [1,1,1],
		 [1,1,1],
		 [1,1,1],
		 [5,0,5]],
	walls:[//h
		[[3,3,3],
		 [0,0,0],
		 [0,0,0],
		 [0,0,0],
		 [1,2,1],
		 [0,0,0]],
	       //v
		[[3,3,3,3],
		 [2,0,0,2],
		 [1,0,0,1],
		 [2,0,0,2],
		 [0,0,0,0]]],
	};

function ship_builder(ship, THREE_scene, CANNON_world, CANNON_world2){
	var x_origin=ship.h/2.0-0.5;
	var y_origin=ship.w/2.0-0.5;
	var THREE_Geometry, CANNON_body, CANNON_body2;
	var add_box=function(x,y,z,x0,y0,z0){
		//note: uses real coords (x fw, y lt, z up)
		var geometry = new THREE.BoxGeometry(x,y,z);
		var cube = new THREE.Mesh( geometry ); // adding material argument might save garbage
		cube.position.set(x0,y0,z0);
		THREE_Geometry.mergeMesh( cube );
		var shape = new CANNON.Box(new CANNON.Vec3(x/2,y/2,z/2));
		CANNON_body.addShape(shape, new CANNON.Vec3(x0,y0,z0));
		CANNON_body2.addShape(shape, new CANNON.Vec3(x0,y0,z0));
	};
	var mkbox=function(r,c,up,r0,c0,up0){
		//wrapper around above function to pass expected args
		//uses map coords (row, column, floor)
		return add_box(r,c,up,-r0+x_origin,-c0+y_origin,up0);
	}
	var floor=function(r,c,ceil=0){
		return mkbox(1, 1, 0.1, r, c, ceil);
	};
	var wwfloor=function(r,c,ceil=0){
		// return mkbox(1, 1, 0.1, r, c, ceil);
		mkbox(0.1, 1, 0.1, r-0.45, c, ceil);
		mkbox(0.1, 1, 0.1, r+0.45, c, ceil);
		mkbox(1, 0.1, 0.1, r, c-0.45, ceil);
		mkbox(1, 0.1, 0.1, r, c+0.45, ceil);
		xceil=ceil?(1-0.05/2):0.05/2;
		mkbox(0.05, 1, 0.05, r, c, xceil);
		mkbox(1, 0.05, 0.05, r, c, xceil);
	};
	var add_cyl=function(r1,r2,len,x0,y0,z0){
		segments = 12;
		//(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded, thetaStart, thetaLength)
		var geometry = new THREE.CylinderGeometry( r1, r2, len, segments );
		var cylinder = new THREE.Mesh( geometry ); // adding material argument might save garbage
		cylinder.rotation.z=-Math.PI/2;
		cylinder.position.set(x0,y0,z0);
		THREE_Geometry.mergeMesh( cylinder );

		// ( radiusTop  radiusBottom  height  numSegments )
		var shape = new CANNON.Cylinder ( r1, r2, len, segments );
		var quat = new CANNON.Quaternion();
		quat.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
		var translation = new CANNON.Vec3(0,0,0);
		shape.transformAllPoints(translation,quat);
		quat.setFromAxisAngle(new CANNON.Vec3(0,0,1),-Math.PI/2);
		shape.transformAllPoints(translation,quat);
		CANNON_body.addShape(shape, new CANNON.Vec3(x0,y0,z0));
	};
	var engine=function(r,c){
		return add_cyl(0.4, 0.5, 1, -r+x_origin, -c+y_origin, 0.5);
	};
	var wall=[
		function(r,c){//h
		return mkbox(0.1, 1, 1, r, c, 0.5);
		},
		function(r,c){//v
		return mkbox(1, 0.1, 1, r, c, 0.5);
		}];
	var wwall=[
		function(r,c){//h
			mkbox(0.1, 1, 0.33, r, c, 0.33/2);
			mkbox(0.1, 1, 0.33, r, c, 1-0.33/2);
			mkbox(0.1, 0.33, 0.34, r, c-0.335, 0.5);
			mkbox(0.1, 0.33, 0.34, r, c+0.335, 0.5);
		},
		function(r,c){//v
			mkbox(1, 0.1, 0.33, r, c, 0.33/2);
			mkbox(1, 0.1, 0.33, r, c, 1-0.33/2);
			mkbox(0.33, 0.1, 0.34, r-0.335, c, 0.5);
			mkbox(0.33, 0.1, 0.34, r+0.335, c, 0.5);
		}];
	var www_w=0.05;
	var wwwall=[
		function(r,c){//h
			mkbox(www_w, 1, www_w, r, c, 0.05);
			mkbox(www_w, 1, www_w, r, c, 0.95);
			mkbox(www_w, www_w, 1, r, c-0.45, 0.5);
			mkbox(www_w, www_w, 1, r, c+0.45, 0.5);
			mkbox(0.05, 1, 0.05, r, c, 0.5);
			mkbox(0.05, 0.05, 1, r, c, 0.5);
		},
		function(r,c){//v
			mkbox(1, www_w, www_w, r, c, 0.05);
			mkbox(1, www_w, www_w, r, c, 0.95);
			mkbox(www_w, www_w, 1, r-0.45, c, 0.5);
			mkbox(www_w, www_w, 1, r+0.45, c, 0.5);
			mkbox(1, 0.05, 0.05, r, c, 0.5);
			mkbox(0.05, 0.05, 1, r, c, 0.5);
		}];
	var THREE_Geometry = new THREE.Geometry();
	// var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	var CANNON_body = new CANNON.Body({ mass: 1 });
	var CANNON_body2 = new CANNON.Body({ mass: 0 });
	//cells
	for(var r=0;r<ship.h;r++){
		for(var c=0;c<ship.w;c++){
			switch(ship.cells[r][c]){
				case 1:
					floor(r,c);
					floor(r,c,1);
				break;
				case 3:
					wwfloor(r,c);
					wwfloor(r,c,1);
				break;
				case 5:
					engine(r,c);
				break;
			}
		}
	}
	//horiz walls
	for(var c=0;c<ship.w;c++){
		for(var r=0;r<=ship.h;r++){
			switch(ship.walls[0][r][c]){
				case 1:
					wall[0](r-0.5,c);
				break;
				case 2:
					wwall[0](r-0.5,c);
				break;
				case 3:
					wwwall[0](r-0.5,c);
				break;
			}
		}
	}
	//vert walls
	for(var c=0;c<=ship.w;c++){
		for(var r=0;r<ship.h;r++){
			switch(ship.walls[1][r][c]){
				case 1:
					wall[1](r,c-0.5);
				break;
				case 2:
					wwall[1](r,c-0.5);
				break;
				case 3:
					wwwall[1](r,c-0.5);
				break;
			}
		}
	}
	// return boxes;
	var mat = new THREE.MeshLambertMaterial( );
	var mesh = new THREE.Mesh( THREE_Geometry, mat);
	THREE_scene.add( mesh );
	CANNON_world.addBody(CANNON_body);
	CANNON_world2.addBody(CANNON_body2);
	return [mesh,CANNON_body];
};

function lturn(x,y,z){
	var v=ship[0].localToWorld(new THREE.Vector3( x, y, z ));
	v=v.sub(ship[0].position);
	v.multiplyScalar(0.1);
	// ship[1].angularVelocity.vadd(new CANNON.Vec3(v.x,v.y,v.z));
	ship[1].angularVelocity=ship[1].angularVelocity.vadd(v);
	// ship[1].angularVelocity.set(v.x*mod,v.y*mod,v.z*mod);
}

function pturn(x,y,z){
	var v=player[0].localToWorld(new THREE.Vector3( x, y, z ));
	v=v.sub(ship[0].position);
	v=v.sub(player[0].position);
	v.multiplyScalar(0.1);
	// ship[1].angularVelocity.vadd(new CANNON.Vec3(v.x,v.y,v.z));
	player[1].angularVelocity=player[1].angularVelocity.vadd(v);
	// ship[1].angularVelocity.set(v.x*mod,v.y*mod,v.z*mod);
}

function lmove(x,y,z){
	mod=0.1;
	ship[1].applyLocalImpulse(new CANNON.Vec3(x*mod,y*mod,z*mod),new CANNON.Vec3( 0, 0, 0 ))
	// ship[1].applyLocalForce(new CANNON.Vec3(x*mod,y*mod,z*mod),new CANNON.Vec3( 0, 0, 0 ))
}

function pmove(x,y,z){
	mod=0.1;
	// player[1].applyLocalImpulse(new CANNON.Vec3(x*mod,y*mod,z*mod),new CANNON.Vec3( 0, 0, 0 ))
	// player[0].position.x+=x*mod;
	// player[0].position.y+=y*mod;
	// player[0].position.z+=z*mod;
	player[0].translateX(x*mod);
	player[0].translateY(y*mod);
	player[0].translateZ(z*mod);
}

ship=(ship_builder(ship,scene,world,world2));
// var axisHelper = new THREE.AxisHelper( 5 );
// ship[0].add( axisHelper );
ship[1].angularDamping = 0.5;
ship[1].linearDamping = 0.5;
// ship[1].angularVelocity.set(0.1,0.2,0.3);
// ship[1].angularVelocity.set(0.0,0.0,0.5);

const pointLight =
  new THREE.PointLight(0xFFFFFF);

  // set its position
  pointLight.position.x = 0;
  pointLight.position.y = 0;
  pointLight.position.z = 0.75;

  // add to the scene
  ship[0].add(pointLight);

  var light = new THREE.AmbientLight( 0x404040 ); // soft white light
  // var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
  scene.add( light );

  geometry = new THREE.BoxGeometry( 1, 1, 1 );
  material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
  mesh = new THREE.Mesh( geometry, material );
  scene.add( mesh );
  shape = new CANNON.Box(new CANNON.Vec3(0.5,0.5,0.5));
  mass = 1;
  body = new CANNON.Body({
	  mass: 1
  });
body.addShape(shape);
body.angularVelocity.set(0,10,0);
body.angularDamping = 0.5;
body.linearDamping = 0.5;
body.position.x=20;
world.addBody(body);


// var localPivotA = new CANNON.Vec3(1, 0, 0);
// var localPivotB = new CANNON.Vec3(-1, 0, 0);
// var constraint = new CANNON.PointToPointConstraint(body, localPivotA, ship[1], localPivotB);
// world.addConstraint(constraint);

fix_coord=['x','x','y','y','z','z'];
val_coord=[-1,1,   -1,1,   -1,1];
fix_mul=1e5;
star_size=fix_mul/1e3*3;
var frand=function(){
	return Math.random()*2*fix_mul-fix_mul;
}
mat2 = new THREE.MeshBasicMaterial( { color: 0xffffff} );
for (var f=0;f<6;f++){
	for (var i=0;i<100;i++){
		var g1=new THREE.BoxGeometry( star_size, star_size, star_size );
		var cube = new THREE.Mesh( g1, mat2 ); // adding material argument might save garbage
		cube.position.set(frand(),frand(),frand());
		// cube.position.set(10,0,0);
		cube.position[fix_coord[f]]=val_coord[f]*fix_mul;
		  scene.add( cube );
	}
}

// var geometry = new THREE.Geometry();
// var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// body = new CANNON.Body({ mass: 1 });
// // add_box(1,2,3,0,0,0,geometry,body);
// var cube = new THREE.Mesh( geometry, material );
// var axisHelper = new THREE.AxisHelper( 5 );
// cube.add( axisHelper );
// scene.add( cube );
// body.angularVelocity.set(0,10,0);
// body.angularDamping = 0.1;
// world.addBody(body);

// camera.position.z = 0.5
// camera.position.x = -3.5
camera.rotation.z = -Math.PI/2
camera.rotation.y = -Math.PI/2
// ship[0].add(camera);
player=PointerLockControls( camera, ship[0], world2, renderer.domElement );
// var orto_co = new CANNON.RotationalEquation(player[1],ship[1], {axisA:CANNON.Vec3(0,0,1),axisB:CANNON.Vec3(1,0,0)});
// co={update:function(){},equations:[orto_co]};
// world2.addConstraint(co);
// var orto_co = new CANNON.RotationalEquation(player[1],ship[1], {axisA:CANNON.Vec3(0,0,1),axisB:CANNON.Vec3(0,1,0)});
// co={update:function(){},equations:[orto_co]};
// world2.addConstraint(co);

canvas=renderer.domElement;
canvas.onclick=function(){ canvas.requestPointerLock(); };


buttons=[];
document.addEventListener( 'keyup', function(e){buttons[e.keyCode]=false;});
document.addEventListener( 'keydown', function(e){ buttons[e.keyCode]=true; });
function controls(){
	       if(buttons[38]){ //up
		       lturn(0,-1,0)
	       }
	       if(buttons[37]){ //left
		       lturn(0,0,1)
	       }
	       if(buttons[40]){ //down
		       lturn(0,1,0)
	       }
	       if(buttons[39]){ //right
		       lturn(0,0,-1)
	       }
	       if(buttons[87]){ //w
		       lmove(1,0,0)
	       }
	       if(buttons[65]){ //a
		       lmove(0,1,0)
	       }
	       if(buttons[83]){ //s
		       lmove(-1,0,0)
	       }
	       if(buttons[68]){ //d
		       lmove(0,-1,0)
	       }
	       if(buttons[81]){ //q
		       lturn(-1,0,0)
	       }
	       if(buttons[69]){ //e
		       lturn(1,0,0)
	       }
	       if(buttons[82]){ //r
		       lmove(0,0,1)
	       }
	       if(buttons[70]){ //f
		       lmove(0,0,-1)
	       }
	       if(buttons[89]){ //y
	        // body.locallyTranslate(new BABYLON.Vector3(0.01, 0, 0));
		       pmove(0.1,0,0)
	       }
	       if(buttons[71]){ //g
               // body.locallyTranslate(new BABYLON.Vector3(0, 0.01, 0));
		       pmove(0,0.1,0)
	       }
	       if(buttons[72]){ //h
		       pmove(-0.1,0,0)
	       }
	       if(buttons[74]){ //j
               // body.locallyTranslate(new BABYLON.Vector3(0, -0.01, 0));
		       pmove(0,-0.1,0)
	       }
	       if(buttons[32]){ //space
		       // ship[1].applyForce()
		       var mod=0.002;
		       var box_corner=body.pointToWorldFrame(new CANNON.Vec3( 0.5, -0.5, 0 ));
		       var ship_point=ship[1].pointToWorldFrame(new CANNON.Vec3( 2.5, 0.5, 0.5 ));
		       var ship_to_box=ship_point.vsub(box_corner);//.scale(-mod);
		       ship_to_box.normalize();
		       ship_to_box=ship_to_box.scale(-mod);
		       console.log(ship_to_box.length());
		       var box_to_ship=ship_to_box.negate();
	               ship[1].applyImpulse(ship_to_box,ship_point);
	               body.applyImpulse(box_to_ship,box_corner);
		       var box_corner=body.pointToWorldFrame(new CANNON.Vec3( 0.5, 0.5, 0 ));
		       var ship_point=ship[1].pointToWorldFrame(new CANNON.Vec3( 2.5, -0.5, 0.5 ));
		       var ship_to_box=ship_point.vsub(box_corner);//.scale(-mod);
		       ship_to_box.normalize();
		       ship_to_box=ship_to_box.scale(-mod);
		       console.log(ship_to_box.length());
		       var box_to_ship=ship_to_box.negate();
	               ship[1].applyImpulse(ship_to_box,ship_point);
	               body.applyImpulse(box_to_ship,box_corner);
	       }
}

function render() {
	requestAnimationFrame( render );
	// cube.rotation.x += 0.1;
	// cube.rotation.y += 0.01;
	// cube.rotation.z += 0.001;
	controls();
	   // player[1].applyLocalForce(new CANNON.Vec3(0,0,-1), new CANNON.Vec3(0,0,0));
	         world.step(1/60);
	         // world2.step(1/60);

		   // Copy coordinates from Cannon.js to Three.js
	   // cube.position.copy(body.position);
	   mesh.position.copy(body.position);
	   ship[0].position.copy(ship[1].position);
	   // player[0].position.copy(player[1].position);
	   // cube.quaternion.copy(body.quaternion);
	   mesh.quaternion.copy(body.quaternion);
	   // mesh.quaternion.copy(player[0].children[0].getWorldQuaternion());
	   ship[0].quaternion.copy(ship[1].quaternion);
	   // player[0].quaternion.copy(player[1].quaternion);

	renderer.render( scene, camera );
}
render();
		</script>
</div>
