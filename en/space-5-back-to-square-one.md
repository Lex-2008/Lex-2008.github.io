title=Space 5: back to square one
uuid=9afddbcd-4638-4603-9123-81f700a3753f
PROCESSOR=Markdown.pl
intro=Changing the engine
tags=Space3D
created=2017-04-17

Researching proper ways of combining meshes to make collision detection for a ship,
I stumbled upon this forum [thread][] suggesting that it's close to impossible to achieve
with overlapping meshes.

However, it's relatively easy to achieve when using cannon.js, which babylon.js is using internally.
Also, cannon.js and three.js integrate [nicely][].

[thread]: http://www.html5gamedevs.com/topic/27859-what-is-the-future-way-to-create-compound-impostors/
[nicely]: https://github.com/schteppe/cannon.js/blob/master/examples/threejs.html

So I decided to switch from babylon.js to three.js and cannon.js.
And now we have same stuff as on the [first step][].

[first step]: space-1-movement.html

<div>
		<script src="three.js"></script>
		<script src="cannon.js"></script>
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


var ship={
	w:3,
	h:5,
	cells:
		[[0,1,0],
		 [1,1,1],
		 [1,1,1],
		 [1,1,1],
		 [2,0,2]],
	walls:[//h
		[[0,2,0],
		 [1,0,1],
		 [0,0,0],
		 [0,0,0],
		 [1,2,1],
		 [0,0,0]],
	       //v
		[[0,2,2,0],
		 [2,0,0,2],
		 [1,0,0,1],
		 [2,0,0,2],
		 [0,0,0,0]]],
	};

function ship_builder(ship, THREE_parent, CANNON_world){
	var x_origin=ship.h/2.0-0.5;
	var y_origin=ship.w/2.0-0.5;
	var THREE_Geometry, CANNON_body;
	var add_box=function(x,y,z,x0,y0,z0){
		//note: uses real coords (x fw, y lt, z up)
		var geometry = new THREE.BoxGeometry(x,y,z);
		var cube = new THREE.Mesh( geometry ); // adding material argument might save garbage
		cube.position.set(x0,y0,z0);
		THREE_Geometry.mergeMesh( cube );
		var shape = new CANNON.Box(new CANNON.Vec3(x,y,z));
		CANNON_body.addShape(shape, new CANNON.Vec3(x0,y0,z0));
	};
	var mkbox=function(r,c,up,r0,c0,up0){
		//wrapper around above function to pass expected args
		//uses map coords (row, column, floor)
		return add_box(r,c,up,-r0+x_origin,-c0+y_origin,up0);
	}
	var floor=function(r,c,ceil=0){
		return mkbox(1, 1, 0.1, r, c, ceil);
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
	var THREE_Geometry = new THREE.Geometry();
	// var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	var CANNON_body = new CANNON.Body({ mass: 1 });
	//cells
	for(var r=0;r<ship.h;r++){
		for(var c=0;c<ship.w;c++){
			switch(ship.cells[r][c]){
				case 1:
					// boxes.push(floor(x,y));
					floor(r,c);
				break;
				case 2:
					// boxes.push(engine(x,y));
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
			}
		}
	}
	// return boxes;
	var mat = new THREE.MeshLambertMaterial( );
	var cube = new THREE.Mesh( THREE_Geometry, mat);
	THREE_parent.add( cube );
	CANNON_world.addBody(CANNON_body);
	return [cube,CANNON_body];
};

function lturn(x,y,z){
	var v=ship[0].localToWorld(new THREE.Vector3( x, y, z ));
	v=v.sub(ship[0].position);
	v.multiplyScalar(0.1);
	// ship[1].angularVelocity.vadd(new CANNON.Vec3(v.x,v.y,v.z));
	ship[1].angularVelocity=ship[1].angularVelocity.vadd(v);
	// ship[1].angularVelocity.set(v.x*mod,v.y*mod,v.z*mod);
}

function lmove(x,y,z){
	mod=0.1;
	ship[1].applyLocalImpulse(new CANNON.Vec3(x*mod,y*mod,z*mod),new CANNON.Vec3( 0, 0, 0 ))
}

ship=(ship_builder(ship,scene,world));
var axisHelper = new THREE.AxisHelper( 5 );
ship[0].add( axisHelper );
ship[1].angularDamping = 0.5;
ship[1].linearDamping = 0.5;
// ship[1].angularVelocity.set(0.1,0.2,0.3);
// ship[1].angularVelocity.set(0.0,0.0,0.5);

const pointLight =
  new THREE.PointLight(0xFFFFFF);

  // set its position
  pointLight.position.x = 10;
  pointLight.position.y = 50;
  pointLight.position.z = 130;

  // add to the scene
  scene.add(pointLight);

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

camera.position.z = 5

buttons=[];
document.addEventListener( 'keyup', function(e){buttons[e.keyCode]=false;});
document.addEventListener( 'keydown', function(e){ buttons[e.keyCode]=true; e.preventDefault(); });
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
}

function render() {
	requestAnimationFrame( render );
	// cube.rotation.x += 0.1;
	// cube.rotation.y += 0.01;
	// cube.rotation.z += 0.001;
	controls();
	         world.step(1/60);

		   // Copy coordinates from Cannon.js to Three.js
	   // cube.position.copy(body.position);
	   ship[0].position.copy(ship[1].position);
	   // cube.quaternion.copy(body.quaternion);
	   ship[0].quaternion.copy(ship[1].quaternion);

	renderer.render( scene, camera );
}
render();
		</script>
</div>
