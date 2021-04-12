/**
 * @author mrdoob / http://mrdoob.com/
 * @author Aleksei.Shpakovsky.ru
 */

PointerLockControls = function ( camera, THREE_scene, CANNON_world, HTML_element ) {

	var scope = this;

  var geometry = new THREE.BoxGeometry( 0.25, 0.3, 0.45 );
  var player_body = new THREE.Mesh( geometry );
  player_body.position.z = 0.225;
  player_body.visible = false;

  var geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
  var player_head = new THREE.Mesh( geometry );
  player_head.position.z = 0.5-player_body.position.z;

  player_head.add( camera );
  player_body.add( player_head );
  THREE_scene.add( player_body );

  // var shape = new CANNON.Box(new CANNON.Vec3(0.15,0.15,0.6));
  // var CANNON_body = new CANNON.Body({
	//   mass: 1,
	//   shape: shape,
	//   position: new CANNON.Vec3(0.15,0.15,0.8),
  // 	  // angularDamping: 0.999,
  // });
  // CANNON_world.addBody(CANNON_body);

	// var player_body = new BABYLON.MeshBuilder.CreateBox("player_body", {height: 0.45, width: 0.3, depth: 0.25}, scene);
	// player_body.position.y = 0.225;
	// player_body.parent = pilot;
	// player_body.visibility = 0;
        	
	// var player_head = new BABYLON.Mesh.CreateBox("player_head", 0.2, scene);
	// player_head.position.y = 0.5-player_body.position.y;
	// player_head.parent = player_body;

	// camera.parent = player_head;

	// camera.rotation.set( 0, 0, 0 );
        //
	// var pitchObject = new THREE.Object3D();
	// pitchObject.add( camera );
        //
	// var yawObject = new THREE.Object3D();
	// yawObject.position.y = 10;
	// yawObject.add( pitchObject );

	var PI_2 = Math.PI / 2;

	var onMouseMove = function ( event ) {

		if ( scope.enabled === false ) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		// yawObject.rotation.y -= movementX * 0.002;
		// pitchObject.rotation.x -= movementY * 0.002;
		player_body.rotation.z -= movementX * 0.002;
	       // pturn(0,0,-movementX * 0.2);
		player_head.rotation.y += movementY * 0.002;

		// pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );
		// player_head.rotation.y = Math.max( - PI_2, Math.min( PI_2, player_head.rotation.x ) );
		player_head.rotation.y = Math.max( - Math.PI/2, Math.min( Math.PI/2, player_head.rotation.y ) );
		// player_head.rotation.y = Math.max( -Math.PI, Math.min( player_head.rotation.x, 0 ) );

	};

	// this.dispose = function() {
	// 	document.removeEventListener( 'mousemove', onMouseMove, false );
	// };
	var changeCallback = function(){
		scope.enabled=(!!document.pointerLockElement)
	};

	document.addEventListener( 'mousemove', onMouseMove, false );
	document.addEventListener('pointerlockchange', changeCallback, false);

	this.enabled = false;

	HTML_element.requestPointerLock();

	// return [player_body, CANNON_body];
	return [player_body];

	// this.getObject = function () {
	// 	return yawObject;
	// };

	// this.getDirection = function() {
        //
	// 	// assumes the camera itself is not rotated
        //
	// 	var direction = new THREE.Vector3( 0, 0, - 1 );
	// 	var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );
        //
	// 	return function( v ) {
        //
	// 		rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );
        //
	// 		v.copy( direction ).applyEuler( rotation );
        //
	// 		return v;
        //
	// 	};
        //
	// }();

};
