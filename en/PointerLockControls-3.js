/**
 * @author mrdoob / http://mrdoob.com/
 * @author Aleksei.Shpakovsky.ru
 */

PointerLockControls = function ( camera, base, element ) {

	var scope = this;

	var player_body = new BABYLON.MeshBuilder.CreateBox("player_body", {height: 0.45, width: 0.3, depth: 0.25}, scene);
	player_body.position.y = 0.225;
	// player_body.scaling.x = 0.4;
	// player_body.scaling.z = 0.25;
	player_body.parent = pilot;
        	
	var player_head = new BABYLON.Mesh.CreateBox("player_head", 0.2, scene);
	player_head.position.y = 0.5-player_body.position.y;
	player_head.parent = player_body;

	camera.parent = player_head;

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
		player_body.rotation.y -= movementX * 0.002;
		player_head.rotation.x -= movementY * 0.002;

		// pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );
		player_head.rotation.x = Math.max( - PI_2, Math.min( PI_2, player_head.rotation.x ) );

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

	element.requestPointerLock();

	return player_body;

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
