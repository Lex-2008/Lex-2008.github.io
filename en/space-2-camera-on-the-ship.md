title=Space 2: Camera on the ship
PROCESSOR=Markdown.pl
intro=Let's put a camera onto the ship, to get some FPV experience
tags=Space3D
created=2017-04-14

Controls here are like before, but now you can also look around using press-and-hold mouse.

<div>
    <div id="canvasZone">
        <canvas id="renderCanvas"></canvas>
    </div>
        <script src="http://www.babylonjs.com/hand.minified-1.2.js"></script>
        <script src="http://www.babylonjs.com/cannon.js"></script>
        <script src="http://www.babylonjs.com/oimo.js"></script>
        <script src="http://www.babylonjs.com/babylon.js"></script>
        <style>
            #renderCanvas {
                width: 686px;
                height: 480px;
                touch-action: none;
            }
        </style>
    <script>
        var canvas = document.getElementById("renderCanvas");
        var engine = new BABYLON.Engine(canvas, true);

        var createScene = function() {
          var scene = new BABYLON.Scene(engine);
          scene.clearColor = new BABYLON.Color3( .5, .5, .5);
        
          // camera
          // var camera = new BABYLON.ArcRotateCamera("camera1",  0, 0, 0, new BABYLON.Vector3(7, 0, 0), scene);
          // camera.setPosition(new BABYLON.Vector3(10, 10, -10));
          // lights
          var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 0.5, 0), scene);
          light.intensity = 0.8;
          var spot = new BABYLON.SpotLight("spot", new BABYLON.Vector3(25, 15, -10), new BABYLON.Vector3(-1, -0.8, 1), 15, 1, scene);
          spot.diffuse = new BABYLON.Color3(1, 1, 1);
          spot.specular = new BABYLON.Color3(0, 0, 0);
          spot.intensity = 0.2; 
          // material
          var mat = new BABYLON.StandardMaterial("mat1", scene);
          mat.alpha = 1.0;
          mat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 1.0);
          mat.backFaceCulling = false;
          //mat.wireframe = true;
        
          // show axis
          var showAxis = function(size) {
            var makeTextPlane = function(text, color, size) {
            var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true);
            dynamicTexture.hasAlpha = true;
            dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color , "transparent", true);
            var plane = new BABYLON.Mesh.CreatePlane("TextPlane", size, scene, true);
            plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
            plane.material.backFaceCulling = false;
            plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
            plane.material.diffuseTexture = dynamicTexture;
            return plane;
             };
          
            var axisX = BABYLON.Mesh.CreateLines("axisX", [ 
              new BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0), 
              new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
              ], scene);
            axisX.color = new BABYLON.Color3(1, 0, 0);
            var xChar = makeTextPlane("X", "red", size / 10);
            xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);
            var axisY = BABYLON.Mesh.CreateLines("axisY", [
                new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( -0.05 * size, size * 0.95, 0), 
                new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( 0.05 * size, size * 0.95, 0)
                ], scene);
            axisY.color = new BABYLON.Color3(0, 1, 0);
            var yChar = makeTextPlane("Y", "green", size / 10);
            yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);
            var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
                new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0 , -0.05 * size, size * 0.95),
                new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0, 0.05 * size, size * 0.95)
                ], scene);
            axisZ.color = new BABYLON.Color3(0, 0, 1);
            var zChar = makeTextPlane("Z", "blue", size / 10);
            zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
        };
          
          size =2;
        
        //Local Axes
          
              var pilot_local_axisX = BABYLON.Mesh.CreateLines("pilot_local_axisX", [ 
              new BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0), 
              new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
              ], scene);
        	  pilot_local_axisX.color = new BABYLON.Color3(1, 0, 0);
        
            pilot_local_axisY = BABYLON.Mesh.CreateLines("pilot_local_axisY", [
                new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
                new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(0.05 * size, size * 0.95, 0)
        	], scene);
            pilot_local_axisY.color = new BABYLON.Color3(0, 1, 0);
        
            var pilot_local_axisZ = BABYLON.Mesh.CreateLines("pilot_local_axisZ", [
                new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0 , -0.05 * size, size * 0.95),
                new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0, 0.05 * size, size * 0.95)
                ], scene);
            pilot_local_axisZ.color = new BABYLON.Color3(0, 0, 1);
        	
         	// pilot = new BABYLON.Mesh.CreateCylinder("pilot", 0.75, 0.2, 0.5, 6, 1 , scene);
         	pilot = BABYLON.Mesh.CreateGround("ground1", 2, 3, 2, scene);
          	var greyMat = new BABYLON.StandardMaterial("grey", scene);
          	greyMat.emissiveColor = new BABYLON.Color3(0.2,0.2,0.2);
          	pilot.material = greyMat;
        
          	pilot_local_axisX.parent = pilot;
          	pilot_local_axisY.parent = pilot;
          	pilot_local_axisZ.parent = pilot;
        	  
        	pilot.computeWorldMatrix();
        	
        	//pilot.rotate(BABYLON.Axis.Y, Math.PI / 2, BABYLON.Space.LOCAL);
        	//pilot.rotate(BABYLON.Axis.Y, Math.PI / 2, BABYLON.Space.LOCAL);
        	//pilot.rotate(BABYLON.Axis.X, Math.PI / 2, BABYLON.Space.LOCAL);
        	
        	pilot.locallyTranslate(new BABYLON.Vector3(0, -1, -3));
        	//pilot.locallyTranslate(new BABYLON.Vector3(0, 3, 0));
	  camera = new BABYLON.FreeCamera("sceneCamera", new BABYLON.Vector3(0, 1, -1), scene);
          camera.attachControl(canvas, true);
	  camera.inputs.remove(camera.inputs.attached.keyboard);
	  camera.parent=pilot;
            scene.enablePhysics(new BABYLON.Vector3(0,0, 0));
	    // body = PointerLockControls(camera, pilot,canvas);
	    // canvas.onclick=function(){ canvas.requestPointerLock(); };
          impostor = pilot.physicsImpostor = new BABYLON.PhysicsImpostor(pilot, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, friction: 1, restitution: 1.9 }, scene);
          //impostor.applyImpulse(new BABYLON.Vector3(0, 1, 0), pilot.getAbsolutePosition());
          //impostor.applyImpulse(new BABYLON.Vector3(0, 1, 0), pilot.getAbsolutePosition());
          showAxis(10);
          local2global=function(x,y,z){
              pilot.computeWorldMatrix();
              var m = pilot.getWorldMatrix();
              var v = BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(x,y,z), m);
              v.subtractInPlace(pilot.getAbsolutePosition());
              return v;
          }
        
// if(false)
        document.addEventListener( 'keydown', function(e){
         switch(e.keyCode){
             case 38: //up
               var v = local2global(1, 0, 0);
               impostor.setAngularVelocity(new BABYLON.Quaternion(v.x,v.y,v.z,0));
            break;
            case 37: //left
               var v = local2global(0, -1, 0);
               impostor.setAngularVelocity(new BABYLON.Quaternion(v.x,v.y,v.z,0));
            break;
             case 40: //down
               var v = local2global(-1, 0, 0);
               impostor.setAngularVelocity(new BABYLON.Quaternion(v.x,v.y,v.z,0));
            break;
            case 39: //right
               var v = local2global(0, 1, 0);
               impostor.setAngularVelocity(new BABYLON.Quaternion(v.x,v.y,v.z,0));
            break;
            case 87: //w
               impostor.applyImpulse(local2global(0, 0, 0.1),pilot.getAbsolutePosition());
            break;
            case 65: //a
               impostor.applyImpulse(local2global(-0.1, 0, 0),pilot.getAbsolutePosition());
            break;
            case 83: //s
               impostor.applyImpulse(local2global(0, 0, -0.1),pilot.getAbsolutePosition());
            break;
            case 68: //d
               impostor.applyImpulse(local2global(0.1, 0, 0),pilot.getAbsolutePosition());
            break;
            case 81: //q
               var v = local2global(0, 0, 1);
               impostor.setAngularVelocity(new BABYLON.Quaternion(v.x,v.y,v.z,0));
            break;
            case 69: //e
               var v = local2global(0, 0, -1);
               impostor.setAngularVelocity(new BABYLON.Quaternion(v.x,v.y,v.z,0));
            break;
            case 82: //r
               impostor.applyImpulse(local2global(0, 0.1, 0),pilot.getAbsolutePosition());
            break;
            case 70: //f
               impostor.applyImpulse(local2global(0, -0.1, 0),pilot.getAbsolutePosition());
            break;
            //  case 89: //y
            //    var v = local2global(-1, 0, 0);
            //    impostor.setAngularVelocity(new BABYLON.Quaternion(v.x,v.y,v.z,0));
            // break;
            // case 71: //g
            //    var v = local2global(0, -1, 0);
            //    impostor.setAngularVelocity(new BABYLON.Quaternion(v.x,v.y,v.z,0));
            // break;
            //  case 72: //h
            //    var v = local2global(1, 0, 0);
            //    impostor.setAngularVelocity(new BABYLON.Quaternion(v.x,v.y,v.z,0));
            // break;
            // case 74: //j
            //    var v = local2global(0, 1, 0);
            //    impostor.setAngularVelocity(new BABYLON.Quaternion(v.x,v.y,v.z,0));
            // break;
            case 80: //p
               // body.locallyTranslate(new BABYLON.Vector3(0, 0, 0.1));
               // impostor.setAngularVelocity(new BABYLON.Quaternion(v.x,v.y,v.z,0));
            break;
            // case 84: //t
	    //    camera.locallyTranslate(new BABYLON.Vector3(0, 0, 1))
            // break;
            // case 70: //f
	    //    camera.locallyTranslate(new BABYLON.Vector3(-1, 0, 0))
            // break;
            // case 71: //g
	    //    camera.locallyTranslate(new BABYLON.Vector3(0, 0, -1))
            // break;
            // case 72: //h
	    //    camera.locallyTranslate(new BABYLON.Vector3(1, 0, 0))
            // break;
         }   
	 e.preventDefault();
        }, false );
          
	  var sphere = BABYLON.Mesh.CreateSphere("sphere1", 8, 2, scene);
	  sphere.material = new BABYLON.StandardMaterial("s-mat", scene);
	  sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9 }, scene);

          return scene;


        };
        
        
        var scene = createScene();

        engine.runRenderLoop(function () {
              impostor.setLinearVelocity(impostor.getLinearVelocity().scale(0.99));
              impostor.setAngularVelocity(impostor.getAngularVelocity().scale(0.9));
            scene.render();
        });

        // Resize
        window.addEventListener("resize", function () {
            engine.resize();
        });
    </script>
</div>
